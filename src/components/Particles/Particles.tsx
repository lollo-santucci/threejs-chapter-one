'use client'

import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

const One: React.FC = () => {
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

        // Scene setup
        const scene = new THREE.Scene();
        //scene.background = new THREE.Color(0x1A3546);  // Sky blue color
        const renderer = new THREE.WebGLRenderer();
        const canvas = renderer.domElement;
        mountRef.current.appendChild(canvas);

        // Texture
        const textureLoader = new THREE.TextureLoader()
        const particleTexture = textureLoader.load('/textures/particles/2.png')
        particleTexture.colorSpace = THREE.SRGBColorSpace

        // Geometry
        const particlesGeometry = new THREE.BufferGeometry()
        const count = 20000

        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 10
            colors[i] = Math.random()
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        // Material
        const particlesMaterial = new THREE.PointsMaterial({
            alphaMap: particleTexture,
            transparent: true,
            depthWrite: false,
            size: 0.02,
            sizeAttenuation: true,
            vertexColors: true
        })

        // Points
        const particles = new THREE.Points(particlesGeometry, particlesMaterial)
        scene.add(particles)

        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(),
            new THREE.MeshBasicMaterial()
        )
        scene.add(cube)

        /**
         * Camera
         */
        // Base camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        camera.position.z = 3

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
            // Particles
            const elapsedTime = clock.getElapsedTime()
            // Update particles
            for (let i = 0; i < count; i++) {
                const i3 = i * 3
                const x = particlesGeometry.attributes.position.array[i3]
                particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
            }
            particlesGeometry.attributes.position.needsUpdate = true 

            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [handleResize, sizes]);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default One;