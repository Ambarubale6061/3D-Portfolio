import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Mail, MessageCircle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Earth3D } from "../Earth3D";

// ─── PERSONAL DETAILS ────────────────────────────────────────────────────────
const MY_EMAIL    = "hello@ambar.dev";
const MY_WHATSAPP = "919579377966";          // country code + number, no +
const MY_PHONE    = "+919579377966";
const MY_NAME     = "Ambar Ubale";
const MY_LOCATION = "Remote / Global";
// ─────────────────────────────────────────────────────────────────────────────

const API_URL = import.meta.env.VITE_API_URL;

const PREFILLED_MSG = encodeURIComponent(
  `Hi ${MY_NAME}, I came across your portfolio and would love to connect!`
);

const quickContacts = [
  {
    label: "Email",
    icon: Mail,
    href: `mailto:${MY_EMAIL}`,
    target: "_self",
    color: "hover:border-sky-400/60 hover:text-sky-400",
    glow: "hover:shadow-[0_0_18px_rgba(56,189,248,0.25)]",
    iconColor: "group-hover:text-sky-400",
    bg: "hover:bg-sky-400/5",
  },
  {
    label: "WhatsApp",
    icon: MessageCircle,
    href: `https://wa.me/${MY_WHATSAPP}?text=${PREFILLED_MSG}`,
    target: "_blank",
    color: "hover:border-green-400/60 hover:text-green-400",
    glow: "hover:shadow-[0_0_18px_rgba(74,222,128,0.25)]",
    iconColor: "group-hover:text-green-400",
    bg: "hover:bg-green-400/5",
  },
  {
    label: "SMS",
    icon: Phone,
    href: `sms:${MY_PHONE}?body=${PREFILLED_MSG}`,
    target: "_self",
    color: "hover:border-violet-400/60 hover:text-violet-400",
    glow: "hover:shadow-[0_0_18px_rgba(167,139,250,0.25)]",
    iconColor: "group-hover:text-violet-400",
    bg: "hover:bg-violet-400/5",
  },
];

export function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Something went wrong.");
      }
      toast({
        title: "Message sent ✅",
        description: "Thanks for reaching out! I'll get back to you soon.",
      });
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      toast({
        title: "Failed to send",
        description: err?.message ?? "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full flex items-center justify-center py-20 overflow-hidden bg-transparent"
    >
      {/* Glow blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Heading - Top Center */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-cyan-400 font-mono text-xs tracking-[0.4em] uppercase"
          >
            // Get In Touch
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mt-3">
            Let's Build{" "}
            <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)] whitespace-nowrap">
              Something Legendary
            </span>
          </h2>
        </motion.div>

        {/* Two-column layout: Left = Earth, Right = Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT: 3D Earth */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <div className="relative w-full aspect-square max-w-[800px] mx-auto">
              <div className="absolute inset-0 bg-radial-gradient-to-b from-transparent to-transparent pointer-events-none z-10" />
              <Earth3D className="w-full h-full" />
            </div>
          </motion.div>

          {/* RIGHT: Contact Form + Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex flex-col order-1 lg:order-2"
          >
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 max-w-[400px]">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { name: "name",    type: "text",  placeholder: "NAME" },
                  { name: "email",   type: "email", placeholder: "EMAIL" },
                ].map((field) => (
                  <div key={field.name} className="group">
                    <input
                      type={field.type}
                      name={field.name}
                      required
                      value={form[field.name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full bg-transparent border-b border-white/20 py-4 text-white text-sm focus:outline-none focus:border-cyan-400 transition-all font-mono tracking-widest placeholder:text-white/20 rounded-none"
                    />
                  </div>
                ))}
                <div className="group">
                  <textarea
                    name="message"
                    required
                    rows={3}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="MESSAGE"
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white text-sm focus:outline-none focus:border-cyan-400 transition-all font-mono tracking-widest placeholder:text-white/20 resize-none rounded-none"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex items-center justify-between w-full p-4 border border-white/10 hover:border-cyan-400/50 transition-all bg-transparent overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed rounded-none"
                >
                  <span className="relative z-10 text-xs font-bold tracking-[0.3em] uppercase text-white group-hover:text-cyan-400 transition-colors">
                    {isSubmitting ? "TRANSMITTING..." : "SEND MESSAGE"}
                  </span>
                  <Send className="w-4 h-4 relative z-10 text-white group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            </form>

            {/* Info row */}
            <div className="mt-12">

              {/* Quick-Contact Buttons */}
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4">
                Reach me directly
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                {quickContacts.map(({ label, icon: Icon, href, target, color, glow, iconColor, bg }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={target}
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className={`
                      group relative flex items-center gap-2.5
                      px-5 py-3 rounded-sm
                      border border-white/10
                      text-white/50 text-[11px] font-mono tracking-[0.2em] uppercase
                      transition-all duration-300
                      ${color} ${glow} ${bg}
                    `}
                  >
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 group-hover:h-full bg-current transition-all duration-300 rounded-full opacity-60" />
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 transition-colors duration-300 ${iconColor}`}
                    />
                    <span className="transition-colors duration-300">{label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}