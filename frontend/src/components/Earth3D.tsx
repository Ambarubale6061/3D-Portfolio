import React, { useEffect, useRef } from 'react';
import ThreeGlobe from "three-globe";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// डेटा इम्पोर्ट्स
import countries from "../assets/globe-data-min.json";
import travelHistory from "../assets/my-flights.json";
import airportHistory from "../assets/my-airports.json";

export const Earth3D = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- १. Scene, Camera & Renderer ---
        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(45, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        camera.position.z = 400;

        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(renderer.domElement);

        // --- २. Lighting ---
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

        // --- ३. Globe Design ---
        const Globe = new ThreeGlobe({
            waitForGlobeReady: true,
            animateIn: true,
        })
            .hexPolygonsData(countries.features)
            .hexPolygonResolution(4)
            .hexPolygonMargin(0.7)
            .showAtmosphere(true)
            .atmosphereColor("#3a228a")
            .atmosphereAltitude(0)
            .hexPolygonColor((e: any) => {
                if (["KGZ", "KOR", "THA", "RUS", "UZB", "IDN", "KAZ", "MYS"].includes(e.properties.ISO_A3)) {
                    return "rgba(200,220,255, 1)";
                } else return "rgba(255,255,255, 0.7)";
            });

        // अ‍ॅनिमेशन आणि डेटा
        setTimeout(() => {
            Globe.arcsData(travelHistory.flights)
                .arcColor(() => "#00f5ff")
                .arcAltitude((e: any) => e.arcAlt)
                .arcStroke((e: any) => (e.status ? 0.5 : 0.3))
                .arcDashLength(0.9)
                .arcDashGap(4)
                .arcDashAnimateTime(1000)
                .arcsTransitionDuration(1000)
                .arcDashInitialGap((e: any) => e.order * 1)
                
                // ✅ original state
                .pointsData([])  
                .barsData([])
                
                .labelsData(airportHistory.airports)
                .labelColor(() => "#ffcb21")
                .labelSize((e: any) => e.size)
                .labelText("city")
                .labelResolution(6)
                .labelAltitude(0.01)
                .labelDotRadius(0)
                .labelDotOrientation(() => 'bottom');
        }, 1000);

        // प्रारंभिक रोटेशन
        Globe.rotateY(-Math.PI * (5 / 9));
        Globe.rotateZ(-Math.PI / 6);
        
        const globeMaterial = Globe.globeMaterial() as THREE.MeshStandardMaterial;
        globeMaterial.color = new THREE.Color(0x3a228a);
        globeMaterial.emissive = new THREE.Color(0x220038);
        globeMaterial.emissiveIntensity = 0.1;
        globeMaterial.roughness = 0.7;

        scene.add(Globe);

        // --- ४. Controls ---
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.enableZoom = false;
        
        controls.minDistance = 400;
        controls.maxDistance = 400;
        
        controls.rotateSpeed = 0.8;
        controls.autoRotate = false;
        controls.minPolarAngle = Math.PI / 3.5;
        controls.maxPolarAngle = Math.PI - Math.PI / 3;

        // --- ५. Animation ---
        let frameId: number;
        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
            if (!containerRef.current) return;
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(frameId);
            renderer.dispose();
            if (containerRef.current) containerRef.current.innerHTML = '';
        };
    }, []);

    return (
        <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '100%', 
            overflow: 'hidden',
            background: 'transparent' 
        }}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};