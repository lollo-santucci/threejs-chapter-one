'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

const HauntedHouse: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        /**
         * Base
         */
        // Debug
        const gui = new GUI()

        // Scene
        const scene = new THREE.Scene()
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        const canvas = renderer.domElement;
        mountRef.current.appendChild(canvas);

        /**
        * House
        */
        // Temporary sphere
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshStandardMaterial({ roughness: 0.7 })
        )
        scene.add(sphere)

        /**
         * Lights
         */
        // Ambient light
        const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
        scene.add(ambientLight)

        // Directional light
        const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
        directionalLight.position.set(3, 2, -8)
        scene.add(directionalLight)

        /**
         * Sizes
         */
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        window.addEventListener('resize', () => {
            // Update sizes
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight

            // Update camera
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()

            // Update renderer
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })

        /**
         * Camera
         */
        // Base camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        camera.position.x = 4
        camera.position.y = 2
        camera.position.z = 5
        scene.add(camera)

        // Controls
        const controls = new OrbitControls(camera, canvas)
        controls.enableDamping = true

        /**
         * Renderer
         */
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        /**
         * Animate
         */
        const timer = new Timer()

        const tick = () => {
            // Timer
            timer.update()
            const elapsedTime = timer.getElapsed()

            // Update controls
            controls.update()

            // Render
            renderer.render(scene, camera)

            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }

        tick()

        // Cleanup
        return () => {
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default HauntedHouse;