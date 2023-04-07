/*
* Imports
*/
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";


/*
 * Init
 */
// Set up basic scene, renderer, and camera
const canvas = document.getElementById("bg");
const fontLoader = new FontLoader();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
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
  500
);

// Function to handle window resize events
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/*
* Models and loader
*/

const models = {
  linkedin: {
    url: "assets/3d/linkedin.glb",
    position: { x: -10, y: 8, z: -5 },
    scale: { x: 8, y: 8, z: 8 },
    rotation: { x: -0.2, y: -0.3, z: -0.05 },
    text: "LinkedIn",
  },
  github: {
    url: "assets/3d/github.glb",
    position: { x: 10, y: 8, z: -5 },
    scale: { x: 9, y: 9, z: 9 },
    rotation: { x: -0.1, y: -0.4, z: 0 },
    text: "Github",
  },
  resume: {
    url: "assets/3d/resume.glb",
    position: { x: 0, y: 0, z: -5 },
    scale: { x: 6, y: 6, z: 6 },
    rotation: { x: 0, y: 0, z: 0 },
    text: "Resume",
  },
};

// Load model
function loadGLTFModel(model) {
  const loader = new GLTFLoader();

  loader.load(
    model.url,
    (gltf) => {
      gltf.scene.position.set(
        model.position.x,
        model.position.y,
        model.position.z
      );
      gltf.scene.scale.set(model.scale.x, model.scale.y, model.scale.z);
      gltf.scene.rotation.set(
        model.rotation.x,
        model.rotation.y,
        model.rotation.z
      );
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry.computeBoundingBox();
          child.geometry.computeBoundingSphere();

        }
      });

      gltf.scene.userData = { text: model.text };
      scene.add(gltf.scene);
      model.scene = gltf.scene;
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.error("An error occurred while loading the model:", error);
    }
  );
}

loadGLTFModel(models.linkedin);
loadGLTFModel(models.github);
loadGLTFModel(models.resume);

window.addEventListener("resize", () => {
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

fontLoader.load(
  "node_modules/three/examples/fonts/optimer_bold.typeface.json",
  function (font) {
    const color = new THREE.Color("white");

    const matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });

    const message = "Dor Zairi";

    const shapes = font.generateShapes(message, 5);

    const geometry = new THREE.ShapeGeometry(shapes);

    geometry.computeBoundingBox();

    const xMid =
      -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

    geometry.translate(xMid, 0, 0);

    const text = new THREE.Mesh(geometry, matLite);
    text.position.set(0, 14, -15);
    scene.add(text);
  }
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
  const t = Math.sin(time * 0.0005) * 0.5 + 0.5;
  const newColors = colors.map((color, index) => {
    const nextIndex = (index + 1) % colors.length;
    return color.clone().lerp(colors[nextIndex], t);
  });

  material.uniforms.color0.value = newColors[0];
  material.uniforms.color1.value = newColors[1];
  material.uniforms.color2.value = newColors[2];
  material.uniforms.color3.value = newColors[3];
}

/*
* Lights
*/

const light = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
scene.add(light);

// Directional Light
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(1, 2, 4);
dirLight.castShadow = true;
scene.add(dirLight);

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0, 5, 0);
pointLight.castShadow = true;
scene.add(pointLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(models.resume.position.x, models.resume.position.y, models.resume.position.z);
controls.enableDamping = true;
controls.dampingFactor = 0.01;
controls.rotateSpeed = 0.9;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

camera.position.x = 0;
camera.position.y = 20;
camera.position.z = 30;

// Background scene
const backgroundScene = new THREE.Scene();

// Skybox
const skyboxGeometry = new THREE.PlaneGeometry(2, 2);
const skybox = new THREE.Mesh(skyboxGeometry, material);
skybox.scale.set(1000, 1000, 1000);
backgroundScene.add(skybox);

renderer.domElement.addEventListener("click", onModelClick);
renderer.domElement.addEventListener("touchend", onModelClick);

function onModelClick(event) {
  event.preventDefault();

  if (event.type === "touchend") {
    // Update the mouse coordinates for touch events
    const touch = event.changedTouches[0];
    mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
  } else {
    // Update the mouse coordinates for click events
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  raycaster.setFromCamera(mouse, camera);
  const validObjects = scene.children.filter(
    (object) => !object.userData.ignoreRaycaster
  );
  const intersects = raycaster.intersectObjects(validObjects, true);
  console.log("intersects: ", intersects);

  console.log(
    "intersects userData:",
    intersects.map((intersect) => intersect.object.userData)
  );

  const clickableIntersects = intersects.filter((intersect) => {
    let currentObject = intersect.object;
    while (currentObject) {
      if (currentObject.userData.text) {
        intersect.userData = currentObject.userData;
        return true;
      }
      currentObject = currentObject.parent;
    }
    return false;
  });

  console.log("clickableIntersects: ", clickableIntersects);
  if (clickableIntersects.length > 0) {
    const clickedObject = clickableIntersects[0].object;

    // Traverse up the hierarchy to find the parent model
    let parentModel;
    let currentObject = clickedObject;
    while (currentObject) {
      if (currentObject.userData.text) {
        parentModel = currentObject;
        break;
      }
      currentObject = currentObject.parent;
    }

    for (const model of Object.values(models)) {
      if (parentModel === model.scene) {
        handleModelClick(model);
        break;
      }
    }
  }
}

function handleModelClick(model) {
  switch (model.text) {
    case "LinkedIn":
      window.open("https://www.linkedin.com/in/dorz", "_blank").focus();
      break;
    case "Github":
      window.open("https://github.com/MashdorDev", "_blank").focus();
      break;
    case "Resume":
      fetch("assets/resume/Dor Zairi-Resume.pdf")
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "resume.pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 100);
        });
      break;
    default:
      console.error("Unknown model:", model);
  }
}

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
