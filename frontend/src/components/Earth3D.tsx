import React, { useEffect, useRef } from 'react';
import ThreeGlobe from "three-globe";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { isMobile } from "@/lib/webgl";

// Data imports
import countries from "../assets/globe-data-min.json";
import travelHistory from "../assets/my-flights.json";
import airportHistory from "../assets/my-airports.json";

// Compute once at module level – never changes during a session
const IS_MOBILE = isMobile();

export const Earth3D = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // ─── 1. Renderer ──────────────────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({
            antialias: !IS_MOBILE,   // antialias off on mobile = significant GPU saving
            alpha: true,
            powerPreference: "high-performance",
        });

        // Clamp pixel-ratio: phones can report 3× — rendering at that costs 9× the pixels
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
            // Lower resolution on mobile: 3 vs 4 hex rings (roughly 4× fewer polygons)
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
        setTimeout(() => {
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
                // ✅ REMOVED: .pointsData([]) — passing empty array is a no-op but
                //    chaining it here interrupted the fluent API on some three-globe
                //    versions, contributing to the method-not-found crash.
                //
                // ✅ REMOVED: .barsData([]) — THIS was the direct cause of the crash:
                //    "barsData is not a function"
                //
                //    three-globe does NOT expose a `.barsData()` method. The bars /
                //    hex-bin layer uses `.hexBinPointsData()` instead. Calling a
                //    non-existent method on the chain threw a TypeError and halted
                //    all subsequent globe setup (labels, rotation, etc.).
                //
                //    Fix: simply remove it. If you later need bar-chart pins on the
                //    globe, use `.hexBinPointsData(data)` with the correct options.
                .labelsData(airportHistory.airports)
                .labelColor(() => "#ffcb21")
                .labelSize((e: any) => e.size)
                .labelText("city")
                .labelResolution(6)
                .labelAltitude(0.01)
                .labelDotRadius(0)
                .labelDotOrientation(() => 'bottom');
        }, 1000);

        // Initial rotation
        Globe.rotateY(-Math.PI * (5 / 9));
        Globe.rotateZ(-Math.PI / 6);

        const globeMaterial = Globe.globeMaterial() as THREE.MeshStandardMaterial;
        globeMaterial.color = new THREE.Color(0x3a228a);
        globeMaterial.emissive = new THREE.Color(0x220038);
        globeMaterial.emissiveIntensity = 0.1;
        globeMaterial.roughness = 0.7;

        scene.add(Globe);

        // ─── 5. Controls ──────────────────────────────────────────────────────
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.minDistance = 400;
        controls.maxDistance = 400;
        controls.rotateSpeed = IS_MOBILE ? 0.5 : 0.8;
        controls.autoRotate = false;
        controls.minPolarAngle = Math.PI / 3.5;
        controls.maxPolarAngle = Math.PI - Math.PI / 3;

        // ─── 6. Visibility-aware animation loop ───────────────────────────────
        let frameId: number;
        let isPageVisible = !document.hidden;
        let isInView = true;

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            // Skip rendering when off-screen or tab is hidden — saves battery & GPU
            if (!isPageVisible || !isInView) return;
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Pause when the tab is hidden
        const onVisibility = () => {
            isPageVisible = !document.hidden;
        };
        document.addEventListener("visibilitychange", onVisibility);

        // Pause when the canvas scrolls out of the viewport
        const io = new IntersectionObserver(
            ([entry]) => { isInView = entry.isIntersecting; },
            { threshold: 0.05 },
        );
        if (containerRef.current) io.observe(containerRef.current);

        // ─── 7. Debounced resize ──────────────────────────────────────────────
        let resizeTimer: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (!containerRef.current) return;
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

        // ─── Cleanup ─────────────────────────────────────────────────────────
        return () => {
            clearTimeout(resizeTimer);
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("visibilitychange", onVisibility);
            io.disconnect();
            renderer.dispose();
            if (containerRef.current) containerRef.current.innerHTML = "";
        };
    }, []);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                background: "transparent",
            }}
        >
            <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
};