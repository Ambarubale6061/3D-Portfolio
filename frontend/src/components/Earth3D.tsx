/**
 * Earth3D.tsx
 *
 * Performance fix: three.js, three-globe, and OrbitControls are now
 * DYNAMICALLY imported inside useEffect instead of being static module-level
 * imports.
 *
 * Why this matters:
 *   Static imports mean the moment the Contact chunk is downloaded (even if the
 *   user hasn't scrolled anywhere near it), Vite must also fetch vendor-three
 *   (~472 kB) and vendor-globe (~471 kB) — nearly 1 MB of JS — before any code
 *   in that chunk can execute.
 *
 *   With dynamic imports, those two chunks are only fetched when Earth3D's
 *   useEffect actually runs, i.e. when the Contact section is mounted, which
 *   (with the ViewportSection gate in App.tsx) only happens when the user
 *   scrolls near the bottom of the page.
 *
 * Everything else (scene setup, globe config, animation loop, cleanup) is
 * unchanged — same visual output, same interaction, no design changes.
 */

import { useEffect, useRef } from "react";
import type * as THREE_TYPES from "three"; // type-only: zero runtime cost
import { isMobile } from "@/lib/webgl";

// ── Data (tiny JSON, fine to keep static) ──────────────────────────────────
import countries     from "../assets/globe-data-min.json";
import travelHistory from "../assets/my-flights.json";
import airportHistory from "../assets/my-airports.json";

// Computed once at module evaluation — cheap, no GPU cost
const IS_MOBILE = isMobile();

export const Earth3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ── Mutable state shared between async init and the cleanup closure ──────
    let frameId        = 0;
    let cancelled      = false;
    let rendererRef: THREE_TYPES.WebGLRenderer | null = null;

    // These are set inside the async block and read by the cleanup closure
    let removeVisibility: (() => void) | null = null;
    let removeResize:     (() => void) | null = null;
    let ioRef:            IntersectionObserver | null = null;
    let resizeTimer:      ReturnType<typeof setTimeout> | null = null;

    // ── Async initialiser ────────────────────────────────────────────────────
    async function init() {
      if (cancelled || !containerRef.current) return;

      /*
       * ✅ KEY CHANGE: these three imports were previously static at the top of
       * the file.  Moving them here means the ~944 kB of JS (vendor-three +
       * vendor-globe) is only downloaded when this component actually renders.
       */
      const [THREE, { default: ThreeGlobe }, { OrbitControls }] =
        await Promise.all([
          import("three"),
          import("three-globe"),
          import("three/examples/jsm/controls/OrbitControls.js"),
        ]);

      // Guard: component may have unmounted while the imports were in-flight
      if (cancelled || !containerRef.current) return;

      // ─── 1. Renderer ──────────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({
        antialias: !IS_MOBILE,
        alpha: true,
        powerPreference: "high-performance",
      });
      rendererRef = renderer;

      const dpr = IS_MOBILE
        ? Math.min(window.devicePixelRatio, 1.25)
        : Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      );
      containerRef.current.appendChild(renderer.domElement);

      // ─── 2. Scene & Camera ────────────────────────────────────────────────
      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        45,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000,
      );
      camera.position.z = 400;

      // ─── 3. Lighting ──────────────────────────────────────────────────────
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

      // ─── 4. Globe ─────────────────────────────────────────────────────────
      const Globe = new ThreeGlobe({
        waitForGlobeReady: true,
        animateIn: true,
      })
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(IS_MOBILE ? 3 : 4)
        .hexPolygonMargin(0.7)
        .showAtmosphere(true)
        .atmosphereColor("#3a228a")
        .atmosphereAltitude(0)
        .hexPolygonColor((e: any) => {
          if (
            ["KGZ", "KOR", "THA", "RUS", "UZB", "IDN", "KAZ", "MYS"].includes(
              e.properties.ISO_A3,
            )
          ) {
            return "rgba(200,220,255, 1)";
          }
          return "rgba(255,255,255, 0.7)";
        });

      // Arc / label data added after globe is ready
      const arcTimer = setTimeout(() => {
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

      // Initial rotation
      Globe.rotateY(-Math.PI * (5 / 9));
      Globe.rotateZ(-Math.PI / 6);

      const globeMaterial =
        Globe.globeMaterial() as THREE_TYPES.MeshStandardMaterial;
      globeMaterial.color           = new THREE.Color(0x3a228a);
      globeMaterial.emissive        = new THREE.Color(0x220038);
      globeMaterial.emissiveIntensity = 0.1;
      globeMaterial.roughness       = 0.7;

      scene.add(Globe);

      // ─── 5. Controls ──────────────────────────────────────────────────────
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping    = true;
      controls.enablePan        = false;
      controls.enableZoom       = false;
      controls.minDistance      = 400;
      controls.maxDistance      = 400;
      controls.rotateSpeed      = IS_MOBILE ? 0.5 : 0.8;
      controls.autoRotate       = false;
      controls.minPolarAngle    = Math.PI / 3.5;
      controls.maxPolarAngle    = Math.PI - Math.PI / 3;

      // ─── 6. Visibility-aware animation loop ───────────────────────────────
      let isPageVisible = !document.hidden;
      let isInView      = true;

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        if (!isPageVisible || !isInView) return;
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Pause when tab is hidden
      const onVisibility = () => { isPageVisible = !document.hidden; };
      document.addEventListener("visibilitychange", onVisibility);
      removeVisibility = () =>
        document.removeEventListener("visibilitychange", onVisibility);

      // Pause when scrolled out of view
      ioRef = new IntersectionObserver(
        ([entry]) => { isInView = entry.isIntersecting; },
        { threshold: 0.05 },
      );
      if (containerRef.current) ioRef.observe(containerRef.current);

      // ─── 7. Debounced resize ──────────────────────────────────────────────
      const handleResize = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (!containerRef.current || !renderer) return;
          camera.aspect =
            containerRef.current.clientWidth / containerRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight,
          );
        }, 150);
      };
      window.addEventListener("resize", handleResize, { passive: true });
      removeResize = () => window.removeEventListener("resize", handleResize);

      // Register the arc timer for cleanup
      const _arcTimer = arcTimer; // capture for cleanup
      const prevCleanup = () => clearTimeout(_arcTimer);
      // chain into removeVisibility so single cleanup ref covers it
      const origRemoveVis = removeVisibility;
      removeVisibility = () => {
        origRemoveVis?.();
        prevCleanup();
      };
    }

    // Start
    init().catch((err) => {
      if (!cancelled) console.warn("[Earth3D] Init failed:", err);
    });

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      cancelled = true;

      cancelAnimationFrame(frameId);

      if (resizeTimer)     clearTimeout(resizeTimer);
      removeVisibility?.();
      removeResize?.();
      ioRef?.disconnect();

      rendererRef?.dispose();

      // Clear the DOM node the renderer appended its canvas to
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
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