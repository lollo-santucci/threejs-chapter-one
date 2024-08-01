'use client'

import './Scroll.style.css'
import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap'
import GUI from 'lil-gui'

const Scroll: React.FC = () => {
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

        // Debug
        const gui = new GUI()
        const parameters = {
            materialColor: '#ffeded'
        }
        gui.addColor(parameters, 'materialColor').onChange(() => {
            material.color.set(parameters.materialColor)
        })

        // Scene setup
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        const canvas = renderer.domElement;
        mountRef.current.appendChild(canvas);

        // Objects
        // Texture
        const textureLoader = new THREE.TextureLoader()
        const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
        gradientTexture.magFilter = THREE.NearestFilter

        // Material
        const material = new THREE.MeshToonMaterial({
            color: parameters.materialColor,
            gradientMap: gradientTexture
        })

        // Meshes
        const mesh1 = new THREE.Mesh(
            new THREE.TorusGeometry(1, 0.4, 16, 60),
            material
        )
        const mesh2 = new THREE.Mesh(
            new THREE.ConeGeometry(1, 2, 32),
            material
        )
        const mesh3 = new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
            material
        )

        // Position
        const objectsDistance = 4

        mesh1.position.y = - objectsDistance * 0
        mesh2.position.y = - objectsDistance * 1
        mesh3.position.y = - objectsDistance * 2

        mesh1.position.x = 2
        mesh2.position.x = - 2
        mesh3.position.x = 2

        scene.add(mesh1, mesh2, mesh3)

        const sectionMeshes = [mesh1, mesh2, mesh3]

        //// Particles
        // Geometry
        const particlesCount = 200
        const positions = new Float32Array(particlesCount * 3)

        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 10
            positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10
        }

        const particlesGeometry = new THREE.BufferGeometry()
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

        // Material
        const particlesMaterial = new THREE.PointsMaterial({
            color: parameters.materialColor,
            sizeAttenuation: true,
            size: 0.03
        })

        // Points
        const particles = new THREE.Points(particlesGeometry, particlesMaterial)
        scene.add(particles)

        // Lights
        const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
        directionalLight.position.set(1, 1, 0)
        scene.add(directionalLight)

        // Scroll
        let scrollY = window.scrollY
        let currentSection = 0
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY
            const newSection = Math.round(scrollY / sizes.height)

            if (newSection != currentSection) {
                currentSection = newSection

                // Animate
                gsap.to(
                    sectionMeshes[currentSection].rotation,
                    {
                        duration: 1.5,
                        ease: 'power2.inOut',
                        x: '+=6',
                        y: '+=3'
                    }
                )
            }
        })

        // Cursor
        const cursor = {
            x: 0,
            y: 0
        }

        window.addEventListener('mousemove', (event) => {
            cursor.x = event.clientX / sizes.width - 0.5
            cursor.y = event.clientY / sizes.height - 0.5
        })

        // Base camera
        // Group
        const cameraGroup = new THREE.Group()
        scene.add(cameraGroup)

        // Base camera
        const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
        camera.position.z = 6
        cameraGroup.add(camera)

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
        let previousTime = 0

        const animate = () => {
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - previousTime
            previousTime = elapsedTime

            // Animate camera
            camera.position.y = - scrollY / sizes.height * objectsDistance
            const parallaxX = cursor.x * 0.5
            const parallaxY = - cursor.y * 0.5
            cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
            cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

            // Animate meshes
            for (const mesh of sectionMeshes) {
                mesh.rotation.x += deltaTime * 0.1
                mesh.rotation.y += deltaTime * 0.12
            }

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

    return (
        <div>
            <div className="webgl" ref={mountRef} style={{ width: '100%', height: '100vh' }} />
            <section className="section">
                <h1>My Portfolio</h1>
            </section>
            <section className="section">
                <h2>My projects</h2>
            </section>
            <section className="section">
                <h2>Contact me</h2>
            </section>
        </div>
    );
};

export default Scroll;