import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

export const RenderComponent = ({ stlFilePath="./Eolo de Polvo 1_.stl" }) => {
  const mountRef = useRef(null); // Referencia al DOM donde se montará el canvas 3D

  useEffect(() => {
    // Configuración de la escena 3D
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement); // Agregar el canvas al DOM

    
    // Set the background color of the scene to white
    renderer.setClearColor(0xffffff, 1); // 0xffffff is the hex color for white

    
    // Luz para la escena
    const light = new THREE.AmbientLight(0x404040); // Luz ambiental suave
    scene.add(light);
    
    // Luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Cargar el archivo STL
    const loader = new STLLoader();
    loader.load(
      stlFilePath,
      (geometry) => {
        const material = new THREE.MeshStandardMaterial({ color: 0x0055ff, flatShading: true });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        mesh.rotation.x = Math.PI / 2; // Ajustar la orientación
        mesh.scale.set(0.1, 0.1, 0.1); // Escalar el modelo si es necesario
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    // Configurar la cámara
    camera.position.z = 5;

    // Función de animación
    const animate = () => {
      requestAnimationFrame(animate);
      scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.rotation.x += 0.01;  // Animación de rotación
          child.rotation.y += 0.01;
        }
      });
      renderer.render(scene, camera);
    };

    animate();

    // Limpiar en caso de desmontar el componente
    // return () => {
    //   mountRef.current.removeChild(renderer.domElement);
    // };
  }, [stlFilePath]);

  return <div ref={mountRef}></div>;
};
