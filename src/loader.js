import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import fragment from "./shaders/fragmentShader.glsl";
import vertex from "./shaders/vertexShader.glsl";

let loadingManager,
  loadingScene,
  mainScene,
  camera,
  renderer,
  model,
  loadingTexture,
  loadingMesh,
  currentScene;

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

  const textureLoader = new TextureLoader(loadingManager);
  textureLoader.load("assets/textures/loading-circle.png", (texture) => {
    loadingTexture = texture;

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

  const loadingScreen = document.getElementById("loadingScreen");
  const canvasContainer = document.getElementById('canvas-container');

  loadingScreen.style.opacity = '0';

  setTimeout(() => {
    loadingScreen.style.display = "none";
    currentScene = mainScene;

    animateMainScene();
    showMainScreen();
    canvasContainer.style.opacity = '1';
  }, 2000);
}

function showMainScreen() {
  let MainScene = document.getElementById("bg");
  MainScene.style.cssText =
    "display: block; width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: -1;";

  const canvasContainer = document.getElementById('canvas-container');
  canvasContainer.style.opacity = '1';
}

function animateMainScene() {
  requestAnimationFrame(animateMainScene);
  renderer.render(mainScene, camera);
}

function createSkybox() {
  const vertexShader = vertex;

  const fragmentShader = fragment;

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
      colors: { value: colors },
    },
    depthTest: false,
  });

  const skyboxGeometry = new THREE.PlaneGeometry(2, 2);
  const skybox = new THREE.Mesh(skyboxGeometry, material);
  skybox.scale.set(1000, 1000, 1000);
  loadingScene.add(skybox);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

initLoadingScene();
