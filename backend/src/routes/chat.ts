import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  // Remove baseURL if you're using the standard OpenAI API
  ...(process.env["OPENAI_BASE_URL"]
    ? { baseURL: process.env["OPENAI_BASE_URL"] }
    : {}),
});

const SYSTEM_PROMPT = `You are AMBI, the friendly AI sidekick for Ambar's portfolio site. Ambar is a Full-Stack Developer & AI Engineer who builds polished web apps and intelligent systems.

Style:
- Speak in first person as AMBI ("I"), referring to Ambar in third person ("Ambar", "he").
- Warm, witty, concise. 1-3 short sentences. Plain text, no markdown.
- If asked something off-topic, gently steer back to Ambar's work, projects, or how to get in touch.

About Ambar:
- Stack: React, Next.js, TypeScript, Tailwind, Framer Motion, Three.js / R3F, Node.js, Express, Java, Spring Boot, GraphQL, PostgreSQL, MongoDB, Python, AI/LLM integrations.
- Services: Frontend engineering, backend & APIs, full-stack product builds, AI feature integration.
- Open to freelance and full-time opportunities. Reach him via the Contact section below.`;

router.post("/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const safeMessages = messages
      .filter(
        (m: any) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.length < 4000,
      )
      .slice(-12);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const stream = await client.chat.completions.create({
      model: "gpt-4o",               // ← change to any model you have access to
      max_completion_tokens: 400,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...safeMessages,
      ],
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: err?.message ?? "chat failed" });
    } else {
      res.write(`data: ${JSON.stringify({ error: err?.message ?? "chat failed" })}\n\n`);
      res.end();
    }
  }
});

export default router;
