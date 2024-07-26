'use client'

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Three: React.FC = () => {
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
        
        // Animate (could use library: GSAP)
        // Control frame rate through elapsed time (60fps = 16 ms)
        const clock = new THREE.Clock()

        const tick = () =>
            {
                const elapsedTime = clock.getElapsedTime()

                // Update objects
                mesh.rotation.y = elapsedTime * 2;
                mesh.rotation.x = elapsedTime;

                mesh.position.x = Math.cos(elapsedTime)
                mesh.position.y = Math.sin(elapsedTime)

            
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
  
export default Three;
