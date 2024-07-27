'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import GUI from 'lil-gui';
import gsap from 'gsap';

interface DebugObject {
    color: string;
    spin: () => void;
    subdivision: number;
}

const Six: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Set up GUI
        const gui = new GUI({ width: 300, title: 'Nice debug UI', closeFolders: false });
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'h') gui.show(gui._hidden);
        };
        window.addEventListener('keydown', handleKeyDown);

        const debugObject: DebugObject = {
            color: '#FFFFFF',
            spin: () => {},
            subdivision: 2
        };
        
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: debugObject.color });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        // GUI
        const cubeTweaks = gui.addFolder('Awesome cube');

        cubeTweaks
            .add(cube.position, 'y')
            .min(- 3)
            .max(3)
            .step(0.01)
            .name('elevation');

        cubeTweaks
            .add(cube, 'visible');

        cubeTweaks
            .add(material, 'wireframe');

        cubeTweaks
            .addColor(debugObject, 'color')
            .onChange(() => {
                material.color.set(debugObject.color);
            });

        debugObject.spin = () => {
            gsap.to(cube.rotation, { duration: 1, y: cube.rotation.y + Math.PI * 2 });
        };
        cubeTweaks
            .add(debugObject, 'spin');

        cubeTweaks
            .add(debugObject, 'subdivision')
            .min(1)
            .max(20)
            .step(1)
            .onFinishChange(() => {
                cube.geometry.dispose();
                cube.geometry = new THREE.BoxGeometry(
                    1, 1, 1,
                    debugObject.subdivision, debugObject.subdivision, debugObject.subdivision
                );
            });

        // Animation
        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // Resize handler
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleKeyDown); // Remove keydown event listener
            window.removeEventListener('resize', handleResize);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            while (scene.children.length > 0) {
                scene.remove(scene.children[0]);
            }
            gui.destroy();
        };
    }, []);

    return <div ref={mountRef} />;
};

export default Six;