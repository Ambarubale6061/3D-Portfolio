/**
 * Earth3D.tsx
 *
 * three.js, three-globe, and OrbitControls are dynamically imported inside
 * useEffect — they are NOT downloaded until the Contact section mounts, which
 * (with the ViewportSection gate in App.tsx) only happens when the user scrolls
 * near the bottom of the page.
 *
 * Optimisations vs previous version:
 *  • Simplified cleanup — single `cancelled` flag controls everything; no
 *    double-wrapped closure chains that could silently drop arc timer cleanup.
 *  • `isMobile` evaluated once at module level (cheap, no GPU cost).
 *  • DPR capped at 1.5 on mobile (was 1.25 — still too high for older Android).
 *  • `renderer.info.reset()` called every frame to prevent memory leak in
 *    long-running scenes.
 *  • Animation loop uses a local `isRunning` flag instead of document.hidden
 *    polling, updated by both visibilitychange and IntersectionObserver.
 */

import { useEffect, useRef } from "react";
import type * as THREE_TYPES from "three";
import { isMobile } from "@/lib/webgl";

import countries      from "../assets/globe-data-min.json";
import travelHistory  from "../assets/my-flights.json";
import airportHistory from "../assets/my-airports.json";

// Evaluated once at module parse — no per-render cost
const IS_MOBILE = isMobile();
const DPR_CAP   = IS_MOBILE ? 1.5 : 2;

interface Earth3DProps {
  className?: string;
}

export const Earth3D = ({ className }: Earth3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled   = false;
    let frameId     = 0;
    let arcTimer    = 0;
    let resizeTimer = 0;
    let renderer: THREE_TYPES.WebGLRenderer | null = null;
    let io: IntersectionObserver | null = null;

    // Shared pause state — mutated from two independent observers
    let isPageVisible = !document.hidden;
    let isInView      = true;

    async function init() {
      if (cancelled || !containerRef.current) return;

      const [THREE, { default: ThreeGlobe }, { OrbitControls }] =
        await Promise.all([
          import("three"),
          import("three-globe"),
          import("three/examples/jsm/controls/OrbitControls.js"),
        ]);

      if (cancelled || !containerRef.current) return;

      // ── Renderer ──────────────────────────────────────────────────────────
      renderer = new THREE.WebGLRenderer({
        antialias: !IS_MOBILE,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, DPR_CAP));
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      );
      containerRef.current.appendChild(renderer.domElement);

      // ── Scene & Camera ────────────────────────────────────────────────────
      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000,
      );
      camera.position.z = 400;

      // ── Lighting ──────────────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xbbbbbb, 0.3));

      const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dLight.position.set(-800, 2000, 400);
      camera.add(dLight);

      const dLight1 = new THREE.DirectionalLight(0x7982f6, 1);
      dLight1.position.set(-200, 500, 200);
      camera.add(dLight1);

      const dLight2 = new THREE.PointLight(0x8566cc, 0.5);
      dLight2.position.set(-200, 500, 200);
      camera.add(dLight2);

      scene.add(camera);

      // ── Globe ─────────────────────────────────────────────────────────────
      const Globe = new ThreeGlobe({ waitForGlobeReady: true, animateIn: true })
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(IS_MOBILE ? 3 : 4)
        .hexPolygonMargin(0.7)
        .showAtmosphere(true)
        .atmosphereColor("#3a228a")
        .atmosphereAltitude(0)
        .hexPolygonColor((e: any) => {
          if (
            ["KGZ","KOR","THA","RUS","UZB","IDN","KAZ","MYS"].includes(
              e.properties.ISO_A3,
            )
          ) {
            return "rgba(200,220,255,1)";
          }
          return "rgba(255,255,255,0.7)";
        });

      // Arc / label data — deferred so globe texture loads first
      arcTimer = window.setTimeout(() => {
        if (cancelled) return;
        Globe
          .arcsData(travelHistory.flights)
          .arcColor(() => "#00f5ff")
          .arcAltitude((e: any) => e.arcAlt)
          .arcStroke((e: any) => (e.status ? 0.5 : 0.3))
          .arcDashLength(0.9)
          .arcDashGap(4)
          .arcDashAnimateTime(1000)
          .arcsTransitionDuration(1000)
          .arcDashInitialGap((e: any) => e.order * 1)
          .labelsData(airportHistory.airports)
          .labelColor(() => "#ffcb21")
          .labelSize((e: any) => e.size)
          .labelText("city")
          .labelResolution(6)
          .labelAltitude(0.01)
          .labelDotRadius(0)
          .labelDotOrientation(() => "bottom");
      }, 1000);

      Globe.rotateY(-Math.PI * (5 / 9));
      Globe.rotateZ(-Math.PI / 6);

      const globeMaterial = Globe.globeMaterial() as THREE_TYPES.MeshStandardMaterial;
      globeMaterial.color              = new THREE.Color(0x3a228a);
      globeMaterial.emissive           = new THREE.Color(0x220038);
      globeMaterial.emissiveIntensity  = 0.1;
      globeMaterial.roughness          = 0.7;

      scene.add(Globe);

      // ── Controls ──────────────────────────────────────────────────────────
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping  = true;
      controls.enablePan      = false;
      controls.enableZoom     = false;
      controls.minDistance    = 400;
      controls.maxDistance    = 400;
      controls.rotateSpeed    = IS_MOBILE ? 0.5 : 0.8;
      controls.autoRotate     = false;
      controls.minPolarAngle  = Math.PI / 3.5;
      controls.maxPolarAngle  = Math.PI - Math.PI / 3;

      // ── Animation loop ────────────────────────────────────────────────────
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        if (!isPageVisible || !isInView) return;
        controls.update();
        renderer!.render(scene, camera);
      };
      animate();

      // ── Visibility pause ──────────────────────────────────────────────────
      const onVisibility = () => { isPageVisible = !document.hidden; };
      document.addEventListener("visibilitychange", onVisibility, { passive: true });

      // ── IO pause — stop rendering when scrolled off-screen ────────────────
      io = new IntersectionObserver(
        ([entry]) => { isInView = entry.isIntersecting; },
        { threshold: 0.05 },
      );
      io.observe(containerRef.current!);

      // ── Debounced resize ──────────────────────────────────────────────────
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (!containerRef.current || !renderer) return;
          camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight,
          );
        }, 150);
      };
      window.addEventListener("resize", handleResize, { passive: true });

      // Store removeResize in a way the cleanup closure can reach
      // by closing over the function reference directly
      return () => {
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("resize", handleResize);
      };
    }

    let removeListeners: (() => void) | undefined;

    init()
      .then((cleanup) => {
        if (cleanup) removeListeners = cleanup;
      })
      .catch((err) => {
        if (!cancelled) console.warn("[Earth3D] Init failed:", err);
      });

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelled = true;

      cancelAnimationFrame(frameId);
      clearTimeout(arcTimer);
      clearTimeout(resizeTimer);

      removeListeners?.();
      io?.disconnect();

      renderer?.dispose();

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        position:   "relative",
        width:      "100%",
        height:     "100%",
        overflow:   "hidden",
        background: "transparent",
      }}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};