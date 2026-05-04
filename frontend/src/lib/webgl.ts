export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

/** True on phones / narrow-viewport devices */
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  );
}

/**
 * Clamp device-pixel-ratio so high-DPI mobiles don't render
 * at 3× (900 % more pixels than needed).
 */
export function getOptimalDPR(desktopMax = 2, mobileMax = 1.5): number {
  if (typeof window === "undefined") return 1;
  const raw = window.devicePixelRatio || 1;
  return isMobile() ? Math.min(raw, mobileMax) : Math.min(raw, desktopMax);
}

/** Honours the OS-level "reduce motion" preference */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}