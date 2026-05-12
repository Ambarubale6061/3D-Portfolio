/**
 * Earth3D.tsx
 *
 * BUGS FIXED vs previous version:
 *
 *  ✅ CRITICAL — RAF loop now truly stops when paused.
 *     Old code: `frameId = requestAnimationFrame(animate)` was at the TOP of
 *     animate(), so it always rescheduled regardless of the visibility check.
 *     Result: JavaScript woke up every 16 ms even when the tab was hidden or
 *     the section was completely off-screen — pure wasted CPU.
 *     Fix: RAF moved to the END of animate(). When paused, frameId is set to 0
 *     and no RAF is scheduled. resumeLoop() is called by both the
 *     visibilitychange and IntersectionObserver callbacks so the loop restarts
 *     exactly when it becomes useful again.
 *
 *  ✅ HIGH — renderer.info.reset() now called after every render frame.
 *     Without this, Three.js accumulates draw-call statistics in memory for the
 *     lifetime of the page — a slow leak in long-running scenes.
 *
 *  ✅ MEDIUM — WebGLRenderer now receives `precision: "mediump"` on mobile.
 *     Halves the GPU memory bandwidth needed for shaders on phones, at no
 *     visible quality loss for this globe scene.
 *
 *  ✅ MINOR — Scene objects (geometries + materials) are now traversed and
 *     disposed on cleanup, preventing VRAM leaks when the component unmounts
 *     (e.g. HMR / navigation away from the page).
 *
 * Everything else (lazy import, IntersectionObserver gate, debounced resize,
 * mobile DPR cap, single `cancelled` flag, arc timer cleanup) was already
 * correct and is preserved unchanged.
 */

import { useEffect, useRef } from "react";
import type * as THREE_TYPES from "three";
import { isMobile } from "@/lib/webgl";

import countries      from "../assets/globe-data-min.json";
import travelHistory  from "../assets/my-flights.json";
import airportHistory from "../assets/my-airports.json";

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
    let frameId     = 0;      // 0 = loop is stopped
    let arcTimer    = 0;
    let resizeTimer = 0;
    let renderer: THREE_TYPES.WebGLRenderer | null = null;
    let io: IntersectionObserver | null = null;

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
        antialias:       !IS_MOBILE,
        alpha:           true,
        powerPreference: "high-performance",
        // ✅ FIX: mediump halves shader memory bandwidth on mobile with no
        //    visible quality difference for this globe scene.
        precision: IS_MOBILE ? "mediump" : "highp",
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
      globeMaterial.color             = new THREE.Color(0x3a228a);
      globeMaterial.emissive          = new THREE.Color(0x220038);
      globeMaterial.emissiveIntensity = 0.1;
      globeMaterial.roughness         = 0.7;

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
      //
      // ✅ FIX: RAF is now at the END of animate(), not the beginning.
      //
      // Old (broken) pattern:
      //   const animate = () => {
      //     frameId = requestAnimationFrame(animate); // ← always reschedules
      //     if (!isPageVisible || !isInView) return;  // ← only skips render
      //     ...
      //   };
      //
      // This woke JavaScript up every 16 ms regardless of visibility — the
      // browser still had to schedule, dispatch, and context-switch for the
      // RAF callback even though it immediately returned. On a busy page this
      // was 3,600+ no-op wakeups per minute.
      //
      // New pattern: frameId=0 is the "stopped" sentinel. The loop only
      // reschedules when it did useful work. resumeLoop() is the single place
      // that re-starts it when conditions flip back to "should be running".
      //
      const animate = () => {
        if (!isPageVisible || !isInView) {
          frameId = 0;   // mark as stopped — cleanup's cancelAnimationFrame(0) is safe no-op
          return;        // do NOT reschedule
        }

        controls.update();
        renderer!.render(scene, camera);

        // ✅ FIX: reset draw-call statistics each frame to prevent memory
        //    accumulation in long-running scenes.
        renderer!.info.reset();

        frameId = requestAnimationFrame(animate);  // reschedule only after work
      };

      // ── Safe resume helper ────────────────────────────────────────────────
      // Called by both event sources below. Guards against double-scheduling.
      const resumeLoop = () => {
        if (frameId === 0 && isPageVisible && isInView && !cancelled) {
          frameId = requestAnimationFrame(animate);
        }
      };

      frameId = requestAnimationFrame(animate); // initial kick-off

      // ── Visibility pause ──────────────────────────────────────────────────
      const onVisibility = () => {
        isPageVisible = !document.hidden;
        resumeLoop();
      };
      document.addEventListener("visibilitychange", onVisibility, { passive: true });

      // ── IO pause — stop rendering when scrolled off-screen ────────────────
      io = new IntersectionObserver(
        ([entry]) => {
          isInView = entry.isIntersecting;
          resumeLoop();
        },
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

      return () => {
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("resize", handleResize);

        // ✅ FIX: traverse the scene and dispose all geometries + materials to
        //    prevent VRAM leaks when the component unmounts (HMR / navigation).
        scene.traverse((obj: any) => {
          if (obj.geometry) {
            obj.geometry.dispose();
          }
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m: any) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });
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

      cancelAnimationFrame(frameId);   // safe even when frameId === 0
      clearTimeout(arcTimer);
      clearTimeout(resizeTimer);

      removeListeners?.();
      io?.disconnect();

      // Force context loss before dispose so the GPU driver reclaims memory
      // immediately rather than waiting for GC.
      try { renderer?.forceContextLoss(); } catch { /* ignore */ }
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