'use client'

import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

const Galaxy: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [sizes, setSizes] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });

    const handleResize = useCallback(() => {
        if (!mountRef.current) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        setSizes({ width, height });
    }, []);

    useEffect(() => {
        if (!mountRef.current) return;

        const gui = new GUI();

        // Scene setup
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer();
        const canvas = renderer.domElement;
        mountRef.current.appendChild(canvas);

        // Galaxy
        let geometry: THREE.BufferGeometry | null = null;
        let material: THREE.PointsMaterial | null = null;
        let points: THREE.Points | null = null;
        const parameters = {
            count: 100000,
            size: 0.01,
            radius: 5,
            branches: 3,
            spin: 1,
            randomness: 0.02,
            randomnessPower: 3,
            insideColor: '#ff6030',
            outsideColor: '#1b3984'
        }

        const generateGalaxy = () => {
            // Destroy old galaxy
            if (points !== null) {
                geometry?.dispose()
                material?.dispose()
                scene.remove(points)
            }

            /**
             * Geometry
             */
            geometry = new THREE.BufferGeometry()
            const positions = new Float32Array(parameters.count * 3)
            const colors = new Float32Array(parameters.count * 3)

            const colorInside = new THREE.Color(parameters.insideColor)
            const colorOutside = new THREE.Color(parameters.outsideColor)

            for (let i = 0; i < parameters.count; i++) {
                const i3 = i * 3

                const radius = Math.random() * parameters.radius
                const spinAngle = radius * parameters.spin
                const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

                const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
                const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
                const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

                positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
                positions[i3 + 1] = randomY
                positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

                const mixedColor = colorInside.clone()
                mixedColor.lerp(colorOutside, radius / parameters.radius)

                colors[i3] = mixedColor.r
                colors[i3 + 1] = mixedColor.g
                colors[i3 + 2] = mixedColor.b
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
            material = new THREE.PointsMaterial({
                size: parameters.size,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true
            })

            points = new THREE.Points(geometry, material)
            scene.add(points)
        }
        generateGalaxy()

        gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
        gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
        gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
        gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
        gui.add(parameters, 'spin').min(- 5).max(5).step(0.001).onFinishChange(generateGalaxy)
        gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
        gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
        gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
        gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

        /**
         * Camera
         */
        // Base camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        camera.position.z = 6
        camera.position.y = 3
        camera.rotation.x = 3

        // Controls
        const controls = new OrbitControls(camera, canvas)
        controls.enableDamping = true

        // Add to scene
        scene.add(camera)

        // Set up render
        const updateRenderer = () => {
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();
            renderer.setSize(sizes.width, sizes.height);
            renderer.render(scene, camera);
        };

        updateRenderer();

        // Resize event listener
        window.addEventListener('resize', handleResize);

        // Animation loop
        const clock = new THREE.Clock()
        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            gui.destroy();
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [handleResize, sizes]);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Galaxy;