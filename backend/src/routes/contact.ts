import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `📬 New message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e0e0e0;border-radius:8px;">
          <h2 style="color:#06b6d4;margin-bottom:16px;">New Portfolio Contact</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="margin:16px 0;border:none;border-top:1px solid #eee;" />
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap;color:#374151;">${message}</p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err: any) {
    console.error("Email error:", err);
    res.status(500).json({ error: err?.message ?? "Failed to send email." });
  }
});

export { router as default };   // ← ESM-safe named + default export