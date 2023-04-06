import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const models = {
  linkedin: {
    url: 'assets/3d/linkedin.glb',
    position: { x: -10, y: 0, z: -5 },
    scale: { x: 10, y: 10, z: 10 },
    rotation: { x: -0.2, y:-0.3, z:-0.05  },
  },
  github: {
    url: 'assets/3d/github.glb',
    position: { x: 10, y: 0, z: -5 },
    scale: { x: 10, y: 10, z: 10 },
    rotation: { x: -0.1, y: -0.4, z: 0 },

  },
  resume: {
    url: 'assets/3d/resume.glb',
    position: { x: 0, y: -5, z: -5 },
    scale: { x: 5, y: 5, z: 5 },
    rotation: { x: 0, y: 0, z: 0 },

  },
};

function loadGLTFModel(model) {
  const loader = new GLTFLoader();

  loader.load(
    model.url,
    (gltf) => {
      gltf.scene.position.set(model.position.x, model.position.y, model.position.z);
      gltf.scene.scale.set(model.scale.x, model.scale.y, model.scale.z);
      gltf.scene.rotation.set(model.rotation.x, model.rotation.y, model.rotation.z);
      scene.add(gltf.scene);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
      console.error('An error occurred while loading the model:', error);
    }
  );
}

loadGLTFModel(models.linkedin);
loadGLTFModel(models.github);
loadGLTFModel(models.resume); // Call the function to load and add the OBJ model to the scene

/*
 * Base
 */

const canvas = document.getElementById('bg');

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

// Gradient background setup
const colors = [
  new THREE.Color(0x0000ff),
  new THREE.Color(0x00ffff),
  new THREE.Color(0xff00ff),
  new THREE.Color(0xff0000),
];

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform vec3 color0;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

void main() {
  vec3 topLeft = mix(color0, color1, vUv.y);
  vec3 bottomRight = mix(color3, color2, vUv.y);
  vec3 color = mix(topLeft, bottomRight, vUv.x);

  gl_FragColor = vec4(color, 1.0);
}
`;

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    color0: { value: colors[0] },
    color1: { value: colors[1] },
    color2: { value: colors[2] },
    color3: { value: colors[3] },
  },
  depthTest: false,
});

function updateBackgroundColor(time) {
  const t = (Math.sin(time * 0.0005) * 0.5) + 0.5;
  const newColors = colors.map((color, index) => {
    const nextIndex = (index + 1) % colors.length;
    return color.clone().lerp(colors[nextIndex], t);
  });

  material.uniforms.color0.value = newColors[0];
  material.uniforms.color1.value = newColors[1];
  material.uniforms.color2.value = newColors[2];
  material.uniforms.color3.value = newColors[3];
}


// Create buttons
const createButton = (text, x) => {
  const buttonGeometry = new THREE.BoxGeometry(3, 1, 0.2);
  const buttonMaterial = new THREE.MeshNormalMaterial();
  const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
  button.position.set(x, 0, -6);
  button.userData = { text };
  return button;
};

const button1 = createButton("Button 1", -5);
const button2 = createButton("Button 2", 0);
const button3 = createButton("Button 3", 5);

scene.add(button1);
scene.add(button2);
scene.add(button3);


const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 2.5 );
scene.add( light );


camera.position.z = 30;

const controls = new OrbitControls(camera, renderer.domElement);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


// Background scene
const backgroundScene = new THREE.Scene();

// Skybox
const skyboxGeometry = new THREE.PlaneBufferGeometry(2, 2);
const skybox = new THREE.Mesh(skyboxGeometry, material);
skybox.scale.set(1000, 1000, 1000);
backgroundScene.add(skybox);

renderer.domElement.addEventListener("click", (event) => {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    if (clickedObject.userData.text == "Button 1") {
      window.open('https://www.linkedin.com/search/results/all/?keywords=dor%20zairi', '_blank').focus();
    }else if(clickedObject.userData.text == "Button 2"){
      window.open('https://www.bing.com', '_blank').focus();
    }else{
      window.open('https://twitter.com/search?q=mashdor', '_blank').focus();
    }
  }
});

function animate(time) {
  updateBackgroundColor(time);
  controls.update();
  renderer.autoClear = false; // Add this line
  renderer.clear(); // Add this line
  renderer.clearDepth(); // Add this line
  renderer.render(backgroundScene, camera); // Render background scene
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

window.addEventListener("resize", onWindowResize, false);

