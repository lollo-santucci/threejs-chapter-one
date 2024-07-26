'use client'

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Two: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    console.log(THREE);

    useEffect(() => {
        if (!mountRef.current) return; // Early return if mountRef.current is null

        // Scene setup
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer();

        mountRef.current.appendChild(renderer.domElement);

        //Objects
        const group = new THREE.Group()
        group.scale.y = 2
        group.rotation.y = 0.2
        scene.add(group)

        const cube1 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        )
        cube1.position.x = - 1.5
        group.add(cube1)

        const cube2 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        )
        cube2.position.x = 0
        group.add(cube2)

        const cube3 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        )
        cube3.position.x = 1.5
        group.add(cube3)

        // Camera
        const sizes = {
            width: 800,
            height: 600
        };
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
        camera.position.z = 3;

        // Add to scene
        scene.add(camera);

        //Axes Helper
        const axesHelper = new THREE.AxesHelper(2)
        scene.add(axesHelper)

        // Set up render
        renderer.setSize(sizes.width, sizes.height);
        renderer.render(scene, camera);

        // Pulizia
        return () => {
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
      }, []);
    
    return <div ref={mountRef} />;
};
  
export default Two;
