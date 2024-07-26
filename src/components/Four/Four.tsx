'use client'

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const Four: React.FC = () => {
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
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100)
        camera.position.z = 3
        camera.lookAt(mesh.position);

        // Cursor
        const cursor = {
            x: 0,
            y: 0
        }

        window.addEventListener('mousemove', (event) =>
        {
            cursor.x = event.clientX / sizes.width - 0.5
            cursor.y = - (event.clientY / sizes.height - 0.5)

            console.log(cursor.x, cursor.y)
        })

        // Add to scene
        scene.add(mesh)
        scene.add(camera)

        // Set up render
        renderer.setSize(sizes.width, sizes.height)
        // Animate (Camera), there are built-in controls to use ex. OrbitControls
        const tick = () =>
            {
                // Update camera (full rotation on x and z)
                camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
                camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
                camera.position.y = cursor.y * 3
                camera.lookAt(mesh.position)

            
                // Render
                renderer.render(scene, camera)
            
                // Call tick again on the next frame
                window.requestAnimationFrame(tick)
            }
            
        tick()

        // Pulizia
        return () => {
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
      }, []);
    
    return <div ref={mountRef} />;
};
  
export default Four;
