import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";

let loadingManager,
  loadingScene,
  mainScene,
  camera,
  renderer,
  model,
  loadingTexture,
  loadingMesh,
  currentScene = loadingScene;

function initLoadingScene() {
  loadingScene = new THREE.Scene();
  mainScene = new THREE.Scene();
  currentScene = loadingScene;

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000);
  document.getElementById("loadingScreen").appendChild(renderer.domElement);

  loadingManager = new THREE.LoadingManager();

  // Loading texture
  const textureLoader = new TextureLoader(loadingManager);
  textureLoader.load("assets/textures/loading-circle.png", (texture) => {
    loadingTexture = texture;

    // Loading mesh
    const loadingGeometry = new THREE.PlaneGeometry(2, 2);
    const loadingMaterial = new THREE.MeshBasicMaterial({
      map: loadingTexture,
      transparent: true,
    });
    loadingMesh = new THREE.Mesh(loadingGeometry, loadingMaterial);
    loadingScene.add(loadingMesh);

    camera.position.z = 5;

    animateLoadingScene();
  });

  loadMainSceneAssets();
  createSkybox();

  // Set loadingManager.onLoad after calling loadMainSceneAssets
  loadingManager.onLoad = switchToMainScene;
}

function animateLoadingScene() {
  requestAnimationFrame(animateLoadingScene);
  loadingMesh.rotation.z -= 0.02;
  renderer.render(loadingScene, camera);
}

function loadMainSceneAssets() {
  const gltfLoader = new GLTFLoader(loadingManager);
  gltfLoader.load("assets/resume.glb", (gltf) => {
    model = gltf.scene;
    mainScene.add(model);
  });
}

function switchToMainScene() {
  if (currentScene !== loadingScene) return;
  document.getElementById("loadingScreen").style.display = "none";
  currentScene = mainScene;
  animateMainScene();
  showMainScreen();
}

function showMainScreen() {
  let MainScene = document.getElementById("bg");
  MainScene.style.cssText =
    "display: block; width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: -1;";
}

function animateMainScene() {
  requestAnimationFrame(animateMainScene);
  renderer.render(mainScene, camera);
}

function createSkybox() {
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

  const colors = [
    new THREE.Color(0x0000ff),
    new THREE.Color(0x00ffff),
    new THREE.Color(0xff00ff),
    new THREE.Color(0xff0000),
  ];

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

  // Skybox
  const skyboxGeometry = new THREE.PlaneGeometry(2, 2);
  const skybox = new THREE.Mesh(skyboxGeometry, material);
  skybox.scale.set(1000, 1000, 1000);
  loadingScene.add(skybox);
}

// Adjust the renderer size and camera aspect ratio on window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

initLoadingScene();
