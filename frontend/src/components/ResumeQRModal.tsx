import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { X, Download, ScanLine, Smartphone, Check } from "lucide-react";
import { downloadResume, getResumeBlobUrl, RESUME_FILE } from "@/lib/resume";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ResumeQRModal({ open, onClose }: Props) {
  const [blobUrl, setBlobUrl] = useState<string>("");
  const [pageUrl, setPageUrl] = useState<string>("");
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!open) return;
    const url = getResumeBlobUrl();
    setBlobUrl(url);
    // For QR we need a public URL the phone can hit. Blob URLs aren't reachable
    // by another device. Use the current origin + a marker that triggers download
    // for any visitor (handled in App via ?dl=resume).
    const origin = window.location.origin + window.location.pathname;
    setPageUrl(`${origin}?dl=resume`);
    return () => URL.revokeObjectURL(url);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleDownload = () => {
    downloadResume();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2400);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            <button
              data-hover
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900 border border-white/10 text-white/70 hover:bg-cyan-400 hover:text-slate-950 transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold tracking-[0.22em] uppercase">
                <ScanLine className="w-3 h-3" />
                Resume Scanner
              </div>

              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Scan to download
                </h3>
                <p className="text-sm text-white/55 mt-2 flex items-center justify-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  Point your phone camera at the code
                </p>
              </div>

              {/* QR code */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative mx-auto w-fit p-5 rounded-2xl bg-white shadow-[0_20px_60px_-20px_rgba(56,189,248,0.5)]"
              >
                {/* Scan beam */}
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-x-5 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_2px_rgba(56,189,248,0.7)] pointer-events-none"
                  style={{ top: "10%" }}
                />
                {/* Corner brackets */}
                {[
                  "top-2 left-2 border-t-2 border-l-2",
                  "top-2 right-2 border-t-2 border-r-2",
                  "bottom-2 left-2 border-b-2 border-l-2",
                  "bottom-2 right-2 border-b-2 border-r-2",
                ].map((c) => (
                  <span
                    key={c}
                    className={`absolute w-4 h-4 border-cyan-400 rounded-sm ${c}`}
                  />
                ))}
                {pageUrl && (
                  <QRCodeSVG
                    value={pageUrl}
                    size={208}
                    bgColor="#ffffff"
                    fgColor="#0c4a6e"
                    level="M"
                    includeMargin={false}
                  />
                )}
              </motion.div>

              <p className="text-[11px] text-white/40 break-all px-4">
                {pageUrl}
              </p>

              <div className="relative">
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
                <span className="relative inline-block px-3 bg-slate-950 text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">
                  Or
                </span>
              </div>

              <button
                data-hover
                onClick={handleDownload}
                disabled={downloaded}
                className="w-full px-6 py-3.5 rounded-full bg-gradient-cta text-white font-bold text-xs tracking-[0.22em] uppercase flex items-center justify-center gap-2 hover:shadow-[0_10px_40px_-10px_rgba(56,189,248,0.7)] transition-shadow disabled:opacity-80"
              >
                {downloaded ? (
                  <>
                    <Check className="w-4 h-4" /> Downloaded
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download Now
                  </>
                )}
              </button>

              {blobUrl && (
                <a
                  data-hover
                  href={blobUrl}
                  download={RESUME_FILE}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[11px] text-cyan-300 hover:text-cyan-200 transition-colors"
                >
                  Open PDF in a new tab →
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
