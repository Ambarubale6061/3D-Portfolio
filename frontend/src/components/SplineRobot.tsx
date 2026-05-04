/**
 * SplineRobot.tsx
 *
 * Standalone Spline scene wrapper.
 * The Hero section directly manages the spline-viewer element for full-bleed
 * rendering — this component is exported for use in OTHER sections if needed
 * (e.g. a small robot in the About section, a sidebar widget, etc.)
 *
 * Usage:
 *   <SplineRobot url="https://prod.spline.design/..." height={500} />
 */

import { useEffect, useRef, useState } from "react";

interface SplineRobotProps {
  /** Spline scene URL */
  url?: string;
  /** Container height (default: 500px) */
  height?: number | string;
  /** Extra class on the container div */
  className?: string;
  /** Called once the scene fires its internal load event */
  onLoad?: () => void;
}

const DEFAULT_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export function SplineRobot({
  url = DEFAULT_URL,
  height = 500,
  className = "",
  onLoad,
}: SplineRobotProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!wrapRef.current || viewerRef.current) return;

    const el = document.createElement("spline-viewer") as HTMLElement;
    el.setAttribute("url", url);
    el.setAttribute("loading", "lazy");
    el.style.cssText = "width:100%;height:100%;display:block;";

    const handleLoad = () => {
      setReady(true);
      onLoad?.();
    };

    const fallback = setTimeout(() => {
      setReady(true);
      onLoad?.();
    }, 5000);

    el.addEventListener("load", handleLoad);
    wrapRef.current.appendChild(el);
    viewerRef.current = el;

    return () => {
      clearTimeout(fallback);
      el.removeEventListener("load", handleLoad);
      try {
        wrapRef.current?.removeChild(el);
      } catch {
        /* already unmounted */
      }
      viewerRef.current = null;
    };
  }, [url, onLoad]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
        opacity: ready ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    />
  );
}

export default SplineRobot;