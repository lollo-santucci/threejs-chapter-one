'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js' //env map

const Seven: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const canvas = renderer.domElement;
        mountRef.current.appendChild(canvas);
        
        // Environmental map
        const rgbeLoader = new RGBELoader()
        rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) => {
            environmentMap.mapping = THREE.EquirectangularReflectionMapping

            scene.background = environmentMap
            scene.environment = environmentMap
        })

        // Textures
        const textureLoader = new THREE.TextureLoader()

        const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
        const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
        const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
        const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
        const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
        const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
        const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
        const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
        const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

        // Right color encoding
        doorColorTexture.colorSpace = THREE.SRGBColorSpace
        matcapTexture.colorSpace = THREE.SRGBColorSpace

        // Light
        const pointLight = new THREE.PointLight(0xffffff, 30)
        pointLight.position.x = -4
        pointLight.position.y = 0
        pointLight.position.z = -1
        scene.add(pointLight)

        // Objects
        const material = new THREE.MeshToonMaterial()
        material.side = THREE.DoubleSide
        //material.flatShading = true

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            material
        )
        sphere.position.x = -1.5

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            material
        )

        const torus = new THREE.Mesh(
            new THREE.TorusGeometry(0.3, 0.2, 16, 32),
            material
        )
        torus.position.x = 1.5

        scene.add(sphere, plane, torus)

        // Setup camera
        camera.position.set(0, 0, 4)
        scene.add(camera)

        // Setup OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Resize handler
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Fullscreen toggle
        const toggleFullscreen = () => {
            const fullscreenElement = document.fullscreenElement || (document as any).webkitFullscreenElement;

            if (!fullscreenElement) {
                if (canvas.requestFullscreen) {
                    canvas.requestFullscreen();
                } else if ((canvas as any).webkitRequestFullscreen) {
                    (canvas as any).webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if ((document as any).webkitExitFullscreen) {
                    (document as any).webkitExitFullscreen();
                }
            }
        };

        window.addEventListener('dblclick', toggleFullscreen);

        // Animation loop
        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        handleResize();
        animate();

        // Cleanup
        return () => {
            // Remove event listeners
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('dblclick', toggleFullscreen);

            // Dispose of geometries
            sphere.geometry.dispose();
            plane.geometry.dispose();
            torus.geometry.dispose();

            // Dispose of material
            material.dispose();

            // Remove objects from scene
            scene.remove(sphere, plane, torus, camera);

            // Dispose of renderer
            renderer.dispose();

            // Dispose of OrbitControls
            controls.dispose();

            // Remove canvas from DOM
            if (mountRef.current) {
                mountRef.current.removeChild(canvas);
            }

            // Cancel any ongoing animations
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Seven;