'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import { Sky } from 'three/addons/objects/Sky.js'
import GUI from 'lil-gui'

const HauntedHouse: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        /**
         * Base
         */
        // Debug
        const gui = new GUI()

        // Scene
        const scene = new THREE.Scene()
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        const canvas = renderer.domElement;
        mountRef.current.appendChild(canvas);

        /**
         * Textures
         */
        const textureLoader = new THREE.TextureLoader()

        // Floor
        const floorAlphaTexture = textureLoader.load('textures/floor/alpha.jpg')
        const floorColorTexture = textureLoader.load('textures/floor/brown_mud_leaves_01_diff_1k.jpg')
        const floorARMTexture = textureLoader.load('textures/floor/brown_mud_leaves_01_arm_1k.jpg')
        const floorNormalTexture = textureLoader.load('textures/floor/brown_mud_leaves_01_nor_gl_1k.jpg')
        const floorDisplacementTexture = textureLoader.load('textures/floor/brown_mud_leaves_01_disp_1k.jpg')

        floorColorTexture.colorSpace = THREE.SRGBColorSpace

        floorColorTexture.wrapS = THREE.RepeatWrapping
        floorARMTexture.wrapS = THREE.RepeatWrapping
        floorNormalTexture.wrapS = THREE.RepeatWrapping
        floorDisplacementTexture.wrapS = THREE.RepeatWrapping

        floorColorTexture.wrapT = THREE.RepeatWrapping
        floorARMTexture.wrapT = THREE.RepeatWrapping
        floorNormalTexture.wrapT = THREE.RepeatWrapping
        floorDisplacementTexture.wrapT = THREE.RepeatWrapping

        // Wall
        const wallColorTexture = textureLoader.load('textures/wall/church_bricks_03_diff_1k.jpg')
        const wallARMTexture = textureLoader.load('textures/wall/church_bricks_03_arm_1k.jpg')
        const wallNormalTexture = textureLoader.load('textures/wall/church_bricks_03_nor_gl_1k.jpg')

        wallColorTexture.colorSpace = THREE.SRGBColorSpace

        // Roof
        const roofColorTexture = textureLoader.load('textures/roof/roof_slates_02_diff_1k.jpg')
        const roofARMTexture = textureLoader.load('textures/roof/roof_slates_02_arm_1k.jpg')
        const roofNormalTexture = textureLoader.load('textures/roof/roof_slates_02_nor_gl_1k.jpg')

        roofColorTexture.repeat.set(3, 1)
        roofARMTexture.repeat.set(3, 1)
        roofNormalTexture.repeat.set(3, 1)

        roofColorTexture.wrapS = THREE.RepeatWrapping
        roofARMTexture.wrapS = THREE.RepeatWrapping
        roofNormalTexture.wrapS = THREE.RepeatWrapping

        roofColorTexture.colorSpace = THREE.SRGBColorSpace

        // Bush
        const bushColorTexture = textureLoader.load('textures/bush/leaves_forest_ground_diff_1k.jpg')
        const bushARMTexture = textureLoader.load('textures/bush/leaves_forest_ground_arm_1k.jpg')
        const bushNormalTexture = textureLoader.load('textures/bush/leaves_forest_ground_nor_gl_1k.jpg')

        bushColorTexture.colorSpace = THREE.SRGBColorSpace

        bushColorTexture.repeat.set(2, 1)
        bushARMTexture.repeat.set(2, 1)
        bushNormalTexture.repeat.set(2, 1)

        bushColorTexture.wrapS = THREE.RepeatWrapping
        bushARMTexture.wrapS = THREE.RepeatWrapping
        bushNormalTexture.wrapS = THREE.RepeatWrapping

        // Grave
        const graveColorTexture = textureLoader.load('textures/grave/plastered_stone_wall_diff_1k.jpg')
        const graveARMTexture = textureLoader.load('textures/grave/plastered_stone_wall_arm_1k.jpg')
        const graveNormalTexture = textureLoader.load('textures/grave/plastered_stone_wall_nor_gl_1k.jpg')

        graveColorTexture.colorSpace = THREE.SRGBColorSpace

        graveColorTexture.repeat.set(0.3, 0.4)
        graveARMTexture.repeat.set(0.3, 0.4)
        graveNormalTexture.repeat.set(0.3, 0.4)

        // Door
        const doorColorTexture = textureLoader.load('textures/door/color.jpg')
        const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
        const doorAmbientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
        const doorHeightTexture = textureLoader.load('textures/door/height.jpg')
        const doorNormalTexture = textureLoader.load('textures/door/normal.jpg')
        const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')
        const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')

        doorColorTexture.colorSpace = THREE.SRGBColorSpace

        /**
        * House
        */
        // Floor
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20, 100, 100),
            new THREE.MeshStandardMaterial({
                alphaMap: floorAlphaTexture,
                transparent: true,
                map: floorColorTexture,
                aoMap: floorARMTexture,
                roughnessMap: floorARMTexture,
                metalnessMap: floorARMTexture,
                normalMap: floorNormalTexture,
                displacementMap: floorDisplacementTexture,
                displacementScale: 0.2,
                displacementBias: -0.05
            })
        )
        gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale')
        gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floorDisplacementBias')
        floor.rotation.x = - Math.PI * 0.5
        scene.add(floor)

        // House container
        const house = new THREE.Group()
        scene.add(house)

        // Walls
        const walls = new THREE.Mesh(
            new THREE.BoxGeometry(4, 2.5, 4),
            new THREE.MeshStandardMaterial({
                map: wallColorTexture,
                aoMap: wallARMTexture,
                roughnessMap: wallARMTexture,
                metalnessMap: wallARMTexture,
                normalMap: wallNormalTexture
            })
        )
        walls.position.y += 1.25
        house.add(walls)

        // Roof
        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(3.5, 1.5, 4),
            new THREE.MeshStandardMaterial({
                map: roofColorTexture,
                aoMap: roofARMTexture,
                roughnessMap: roofARMTexture,
                metalnessMap: roofARMTexture,
                normalMap: roofNormalTexture
            })
        )
        roof.position.y += 2.5 + 0.75
        roof.rotation.y = Math.PI * 0.25
        house.add(roof)

        // Door
        const door = new THREE.Mesh(
            new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
            new THREE.MeshStandardMaterial({
                displacementScale: 0.15,
                displacementBias: -0.04,
                map: doorColorTexture,
                transparent: true,
                alphaMap: doorAlphaTexture,
                aoMap: doorAmbientOcclusionTexture,
                displacementMap: doorHeightTexture,
                normalMap: doorNormalTexture,
                metalnessMap: doorMetalnessTexture,
                roughnessMap: doorRoughnessTexture
            })
        )
        door.position.y += 1
        door.position.z = 2 + 0.01
        house.add(door)

        // Bushes
        const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
        const bushMaterial = new THREE.MeshStandardMaterial({
            color: '#ccffcc',
            map: bushColorTexture,
            aoMap: bushARMTexture,
            roughnessMap: bushARMTexture,
            metalnessMap: bushARMTexture,
            normalMap: bushNormalTexture
        })

        const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush1.scale.set(0.5, 0.5, 0.5)
        bush1.position.set(0.8, 0.2, 2.2)
        bush1.rotation.x = - 0.75

        const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush2.scale.set(0.25, 0.25, 0.25)
        bush2.position.set(1.4, 0.1, 2.1)
        bush2.rotation.x = - 0.75

        const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush3.scale.set(0.4, 0.4, 0.4)
        bush3.position.set(- 0.8, 0.1, 2.2)
        bush3.rotation.x = - 0.75

        const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush4.scale.set(0.15, 0.15, 0.15)
        bush4.position.set(- 1, 0.05, 2.6)
        bush4.rotation.x = - 0.75

        house.add(bush1, bush2, bush3, bush4)

        // Graves
        const graveGeometry = new THREE.BoxGeometry(0.6, 0.9, 0.2)
        const graveMaterial = new THREE.MeshStandardMaterial({
            map: graveColorTexture,
            aoMap: graveARMTexture,
            roughnessMap: graveARMTexture,
            metalnessMap: graveARMTexture,
            normalMap: graveNormalTexture
        })

        const graves = new THREE.Group()
        scene.add(graves)

        for (let i = 0; i < 30; i++) {
            // Mesh
            const grave = new THREE.Mesh(graveGeometry, graveMaterial)
            // Coordinates
            const angle = Math.random() * Math.PI * 2
            const radius = 5 + Math.random() * 4
            const x = Math.sin(angle) * radius
            const z = Math.cos(angle) * radius

            grave.position.x = x
            grave.position.y = Math.random() * 0.3
            grave.position.z = z

            grave.rotation.x = Math.random() - 0.5 * 0.1
            grave.rotation.y = Math.random() - 0.5 * 0.4
            grave.rotation.z = Math.random() - 0.5 * 0.1

            // Add to the graves group
            graves.add(grave)
        }

        /**
         * Lights
         */
        // Ambient light
        const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
        scene.add(ambientLight)

        // Directional light
        const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
        directionalLight.position.set(3, 2, -8)
        scene.add(directionalLight)

        // Door light
        const doorLight = new THREE.PointLight('#ff7d46', 5)
        doorLight.position.set(0, 2.2, 2.5)
        house.add(doorLight)

        /**
         * Ghosts
         */
        const ghost1 = new THREE.PointLight('#8800ff', 6)
        const ghost2 = new THREE.PointLight('#ff0088', 6)
        const ghost3 = new THREE.PointLight('#ff0000', 6)
        scene.add(ghost1, ghost2, ghost3)

        /**
         * Shadows
         */
        // Renderer
        renderer.shadowMap.enabled = true
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap

        // Cast and receive
        directionalLight.castShadow = true
        ghost1.castShadow = true
        ghost2.castShadow = true
        ghost3.castShadow = true

        walls.castShadow = true
        walls.receiveShadow = true
        roof.castShadow = true
        floor.receiveShadow = true

        for (const grave of graves.children) {
            grave.castShadow = true
            grave.receiveShadow = true
        }

        // Mappings
        directionalLight.shadow.mapSize.width = 256
        directionalLight.shadow.mapSize.height = 256
        directionalLight.shadow.camera.top = 8
        directionalLight.shadow.camera.right = 8
        directionalLight.shadow.camera.bottom = - 8
        directionalLight.shadow.camera.left = - 8
        directionalLight.shadow.camera.near = 1
        directionalLight.shadow.camera.far = 20

        ghost1.shadow.mapSize.width = 256
        ghost1.shadow.mapSize.height = 256
        ghost1.shadow.camera.far = 10

        ghost2.shadow.mapSize.width = 256
        ghost2.shadow.mapSize.height = 256
        ghost2.shadow.camera.far = 10

        ghost3.shadow.mapSize.width = 256
        ghost3.shadow.mapSize.height = 256
        ghost3.shadow.camera.far = 10

        /**
         * Sky
         */
        const sky = new Sky()
        sky.material.uniforms['turbidity'].value = 10
        sky.material.uniforms['rayleigh'].value = 3
        sky.material.uniforms['mieCoefficient'].value = 0.1
        sky.material.uniforms['mieDirectionalG'].value = 0.95
        sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

        sky.scale.set(100, 100, 100)

        scene.add(sky)

        /**
         * Fog
         */
        scene.fog = new THREE.FogExp2('#04343f', 0.1)
        
        /**
         * Sizes
         */
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        window.addEventListener('resize', () => {
            // Update sizes
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight

            // Update camera
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()

            // Update renderer
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })

        /**
         * Camera
         */
        // Base camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        camera.position.x = 4
        camera.position.y = 2
        camera.position.z = 5
        scene.add(camera)

        // Controls
        const controls = new OrbitControls(camera, canvas)
        controls.enableDamping = true

        /**
         * Renderer
         */
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        /**
         * Animate
         */
        const timer = new Timer()

        const tick = () => {
            // Timer
            timer.update()
            const elapsedTime = timer.getElapsed()

            // Ghosts
            const ghost1Angle = elapsedTime * 0.8
            ghost1.position.x = Math.cos(ghost1Angle) * 4
            ghost1.position.z = Math.sin(ghost1Angle) * 4

            const ghost2Angle = - elapsedTime * 0.5
            ghost2.position.x = Math.cos(ghost2Angle) * 5
            ghost2.position.z = Math.sin(ghost2Angle) * 5

            const ghost3Angle = elapsedTime * 0.38
            ghost3.position.x = Math.cos(ghost3Angle) * 6
            ghost3.position.z = Math.sin(ghost3Angle) * 6
            // Update controls
            controls.update()

            // Render
            renderer.render(scene, camera)

            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }

        tick()

        // Cleanup
        return () => {
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default HauntedHouse;