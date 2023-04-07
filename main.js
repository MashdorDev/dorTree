import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const fontLoader = new FontLoader();


fontLoader.load('node_modules/three/examples/fonts/optimer_bold.typeface.json', function (font) {
  const geometry = new TextGeometry('Dor Zairi', {
    font: font,
    size: 1,
    height: 1,
    curveSegments: 1,
    bevelEnabled: true,
    bevelThickness: 0,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 0
  });

  const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `;

  const fragmentShader = `
  varying vec2 vUv;

  void main() {
    vec3 color = vec3(1.0, 0.5, 0.0) * sin(10.0 * vUv.y - 5.0 * vUv.x) * 0.5 + 0.5;
    gl_FragColor = vec4(color, 1.0);
  }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
  });

  const text = new THREE.Mesh(geometry, material);
  text.position.set(-2, 10, -5);
  scene.add(text);

  console.log(geometry);
});
/*
 * Base
 */

const canvas = document.getElementById("bg");

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
  100
);

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


const models = {
  linkedin: {
    url: "assets/3d/linkedin.glb",
    position: { x: -10, y: 0, z: -5 },
    scale: { x: 10, y: 10, z: 10 },
    rotation: { x: -0.2, y: -0.3, z: -0.05 },
    text: "LinkedIn",
  },
  github: {
    url: "assets/3d/github.glb",
    position: { x: 10, y: 0, z: -5 },
    scale: { x: 10, y: 10, z: 10 },
    rotation: { x: -0.1, y: -0.4, z: 0 },
    text: "Github",
  },
  resume: {
    url: "assets/3d/resume.glb",
    position: { x: 0, y: -5, z: -5 },
    scale: { x: 5, y: 5, z: 5 },
    rotation: { x: 0, y: 0, z: 0 },
    text: "Resume",
  },
};

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
loadGLTFModel(models.resume); // Call the function to load and add the OBJ model to the scene



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


// // Function to create 3D text
// function createText(text, position, font) {
//   const textGeometry = new THREE.TextGeometry(text, {
//     font: font,
//     size: 3, // Increase the size
//     height: 0.1,
//     curveSegments: 12,
//     bevelEnabled: true,
//     bevelThickness: 0.03,
//     bevelSize: 0.02,
//     bevelOffset: 0,
//     bevelSegments: 5,
//   });

//   const textMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Change the color
//   const textMesh = new THREE.Mesh(textGeometry, textMaterial);
//   textMesh.position.set(position.x, position.y, position.z);

//   return textMesh;
// }

// // Load the font and add 3D text to the scene
// const fontLoader = new FontLoader();
// fontLoader.load(FontLocation, (font) => {
//   const textMesh = createText("My 3D Text", { x: 0, y: 0, z: 0 }, font);
//   console.log(textMesh);
//   scene.add(textMesh);
// });

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


const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 2.5);
scene.add(light);


const controls = new OrbitControls(camera, renderer.domElement);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


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
  const validObjects = scene.children.filter((object) => !object.userData.ignoreRaycaster);
  const intersects = raycaster.intersectObjects(validObjects, true);
  console.log("intersects: ", intersects);



  console.log("intersects userData:", intersects.map(intersect => intersect.object.userData));

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
      // window.open("https://resume.example.com", "_blank").focus();
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
