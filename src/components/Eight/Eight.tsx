'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const Eight: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Loaders
        const fontLoader = new FontLoader()
        const textureLoader = new THREE.TextureLoader();

        // Scene setup
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const canvas = renderer.domElement;
        mountRef.current.appendChild(canvas);

        // Text
        // TexTure and material
        const matcapTexture = textureLoader.load('/textures/matcaps/6.png')
        matcapTexture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

        fontLoader.load(
            '/fonts/helvetiker_regular.typeface.json',
            (font) => {
                const textGeometry = new TextGeometry(
                    'Scemo chi legge',
                    {
                        font: font,
                        size: 0.5,
                        depth: 0.2,
                        curveSegments: 12,
                        bevelEnabled: true,
                        bevelThickness: 0.03,
                        bevelSize: 0.02,
                        bevelOffset: 0,
                        bevelSegments: 5
                    }
                )
                const text = new THREE.Mesh(textGeometry, material)

                // Text transformation
                textGeometry.center()

                scene.add(text)
            }
        )

        // Objects
        // Geometries
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
        const sphereGeometry = new THREE.SphereGeometry(1)
        const coneGeometry = new THREE.ConeGeometry(1, Math.random() + 0.5)

        for (let i = 0; i < 25; i++) {
            // Objects
            const donut = new THREE.Mesh(donutGeometry, material)
            const cube = new THREE.Mesh(cubeGeometry, material)
            const sphere = new THREE.Mesh(sphereGeometry, material)
            const cone = new THREE.Mesh(coneGeometry, material)

            // Position
            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10
            cube.position.x = (Math.random() - 0.5) * 10
            cube.position.y = (Math.random() - 0.5) * 10
            cube.position.z = (Math.random() - 0.5) * 10
            sphere.position.x = (Math.random() - 0.5) * 10
            sphere.position.y = (Math.random() - 0.5) * 10
            sphere.position.z = (Math.random() - 0.5) * 10
            cone.position.x = (Math.random() - 0.5) * 10
            cone.position.y = (Math.random() - 0.5) * 10
            cone.position.z = (Math.random() - 0.5) * 10

            // Trasformation
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            cube.rotation.x = Math.random() * Math.PI
            cube.rotation.y = Math.random() * Math.PI
            sphere.rotation.x = Math.random() * Math.PI
            sphere.rotation.y = Math.random() * Math.PI
            cone.rotation.x = Math.random() * Math.PI
            cone.rotation.y = Math.random() * Math.PI


            const scale = Math.random() * 0.5
            donut.scale.set(scale, scale, scale)
            cube.scale.set(scale, scale, scale)
            sphere.scale.set(scale, scale, scale)
            cone.scale.set(scale, scale, scale)

            scene.add(donut, cube, sphere, cone)
        }



        camera.position.z = 5;

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

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        handleResize();
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('dblclick', toggleFullscreen);
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Eight;