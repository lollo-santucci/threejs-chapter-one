'use client'

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const One: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    console.log(THREE);

    useEffect(() => {
        if (!mountRef.current) return; // Early return if mountRef.current is null

        // Scene setup
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer();

        mountRef.current.appendChild(renderer.domElement);

        // Object
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(geometry, material);

        // Camera
        const sizes = {
            width: 800,
            height: 600
        }
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
        camera.position.z = 3

        // Add to scene
        scene.add(mesh)
        scene.add(camera)

        // Set up render
        renderer.setSize(sizes.width, sizes.height)
        renderer.render(scene, camera)

        // Pulizia
        return () => {
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
      }, []);
    
    return <div ref={mountRef} />;
};
  
export default One;
