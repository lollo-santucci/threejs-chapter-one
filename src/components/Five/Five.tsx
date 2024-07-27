'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Five: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const canvas = renderer.domElement;
        mountRef.current.appendChild(canvas);

        // Object
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

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

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        handleResize();
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('dblclick', toggleFullscreen);
            mountRef.current?.removeChild(renderer.domElement);
            scene.remove(cube);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Five;