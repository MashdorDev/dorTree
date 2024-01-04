import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
// import fragment from '../shaders/fragmentShader.glsl';
// import vertex from '../shaders/vertexShader.glsl';

const ThreeScene = () => {
    const canvasContainerRef = useRef();

    useEffect(() => {
        // Scene, Camera, and Renderer Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainerRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.rotateX(0.5);

        const light = new THREE.AmbientLight(0x404040); // soft white light
        scene.add(light);

        camera.position.z = 5;

        // Event Listener for Window Resize
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", onWindowResize, false);

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            // Add animation logic here
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener("resize", onWindowResize, false);
            canvasContainerRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={canvasContainerRef} />;
};

export default ThreeScene;
