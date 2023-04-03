import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/*
 * Base
 */

const canvas = document.getElementById('webgl');

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
  1000
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

// Create a full-screen quad for the gradient background
const backgroundGeometry = new THREE.PlaneGeometry(2, 2);
const backgroundMesh = new THREE.Mesh(backgroundGeometry, material);
backgroundMesh.frustumCulled = false;

const backgroundScene = new THREE.Scene(); // New background scene
backgroundScene.add(backgroundMesh);

// Cube texture loader
// Create a skybox using a large cube
const skyboxVertexShader = `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const skyboxFragmentShader = `
  varying vec3 vWorldPosition;
  uniform vec3 color0;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;

  void main() {
    vec3 direction = normalize(vWorldPosition);
    float t = 0.5 * (1.0 + direction.y);
    vec3 topColors = mix(color0, color1, t);
    vec3 bottomColors = mix(color3, color2, t);
    vec3 color = mix(topColors, bottomColors, direction.x);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const skyboxMaterial = new THREE.ShaderMaterial({
  vertexShader: skyboxVertexShader,
  fragmentShader: skyboxFragmentShader,
  uniforms: {
    color0: { value: colors[0] },
    color1: { value: colors[1] },
    color2: { value: colors[2] },
    color3: { value: colors[3] },
  },
  side: THREE.BackSide,
});

// Create buttons
const createButton = (text, x) => {
  const buttonGeometry = new THREE.BoxGeometry(3, 1, 0.2);
  const buttonMaterial = new THREE.MeshNormalMaterial();
  const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
  button.position.set(x, 0, 0);
  button.userData = { text };
  return button;
};

const button1 = createButton("Button 1", -5);
const button2 = createButton("Button 2", 0);
const button3 = createButton("Button 3", 5);

scene.add(button1);
scene.add(button2);
scene.add(button3);

const light = new THREE.PointLight(0xffffff, 1, 0);
light.position.set(0, 0, 10);
scene.add(light);

camera.position.z = 30;

const controls = new OrbitControls(camera, renderer.domElement);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

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
  renderer.render(backgroundScene, camera); // Render background scene
  renderer.clearDepth(); // Add this line
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

window.addEventListener("resize", onWindowResize, false);

