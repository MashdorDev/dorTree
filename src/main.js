// /*
//  * Imports
//  */
// import "./loader.js";
// import "./style.css";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
// import fragment from "./shaders/fragmentShader.glsl";
// import vertex from "./shaders/vertexShader.glsl";

// /*
//  * Init
//  */
// // Set up basic scene, renderer, and camera
// const canvas = document.getElementById("bg");
// const fontLoader = new FontLoader();
// const loadedModels = [];

// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };
// const renderer = new THREE.WebGLRenderer({
//   canvas: canvas,
//   antialias: true,
// });

// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   500
// );
// setCameraPosition();

// // Function to handle window resize and orientation change events
// function onWindowResize() {
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;

//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix();

//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// }

// // Update the camera position for better visibility on mobile devices
// if (window.innerWidth < 768) {
//   camera.position.x = 0;
//   camera.position.y = 10;
//   camera.position.z = 40;
// } else {
//   camera.position.x = 0;
//   camera.position.y = 20;
//   camera.position.z = 30;
// }

// // Event listeners
// window.addEventListener("orientationchange", onWindowResize, false);
// /*
//  * Models and loader
//  */

// const models = {
//   linkedin: {
//     url: "assets/linkedin.glb",
//     position: { x: -10, y: 8, z: -5 },
//     scale: { x: 8, y: 8, z: 8 },
//     rotation: { x: -0.2, y: -0.3, z: -0.05 },
//     text: "LinkedIn",
//   },
//   github: {
//     url: "assets/github.glb",
//     position: { x: 10, y: 8, z: -5 },
//     scale: { x: 9, y: 9, z: 9 },
//     rotation: { x: -0.1, y: -0.4, z: 0 },
//     text: "Github",
//   },
//   resume: {
//     url: "assets/resume.glb",
//     position: { x: 0, y: 0, z: -5 },
//     scale: { x: 3, y: 3, z: 3},
//     rotation: { x: 0, y: 0, z: 0 },
//     text: "Resume",
//   },

// };

// const progress = {
//   linkedin: 0,
//   github: 0,
//   resume: 0,
// };


// function setScale(object, scale) {
//   object.scale.set(scale.x, scale.y, scale.z);
// }

// function setPosition(object, position) {
//   object.position.set(position.x, position.y, position.z);
// }

// function setRotation(object, rotation) {
//   object.rotation.set(rotation.x, rotation.y, rotation.z);
// }

// function loadGLTFModel(modelKey) {
//   const model = models[modelKey];
//   console.log("Loading model:", model);
//   const loader = new GLTFLoader();

//   return new Promise((resolve, reject) => {
//     loader.load(
//       model.url,
//       (gltf) => {
//         gltf.scene.traverse((child) => {
//           if (child.isMesh) {
//             child.castShadow = true;
//             child.receiveShadow = true;
//           }
//         });

//         setScale(gltf.scene, model.scale);
//         setPosition(gltf.scene, model.position);
//         setRotation(gltf.scene, model.rotation);
//         gltf.scene.userData.text = model.text;
//         gltf.scene.name = model.text;

//         scene.add(gltf.scene);

//         model.scene = gltf.scene;
//         loadedModels.push(model.scene);
//         console.log("Model loaded:", model);
//         console.log("Loaded models:", loadedModels);
//         resolve(gltf);
//       },
//       (xhr) => {
//         // Update progress for the current model
//         progress[modelKey] = Math.round((xhr.loaded / xhr.total) * 100);

//         // Calculate total progress
//         const totalProgress = Object.values(progress).reduce(
//           (sum, currProgress) => sum + currProgress,
//           0
//         );
//       },
//       (error) => {
//         console.error("An error occurred while loading the model:", error);
//         reject(error);
//       }
//     );
//   });
// }

// Promise.all([
//   loadGLTFModel("linkedin"),
//   loadGLTFModel("github"),
//   loadGLTFModel("resume"),
// ])
//   .then(() => {
//     console.log("All models loaded");
//   })
//   .catch((error) => {
//     console.error("Error loading models:", error);
//   });

// window.addEventListener("resize", () => {
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;

//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix();

//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//   setCameraPosition();
// });

// let loadedFont;
// fontLoader.load("assets/font/Montserrat_Medium_Regular.json", function (font) {
//   // Store the loaded font in the loadedFont variable
//   loadedFont = font;

//   // Dor Zairi Text
//   let color = new THREE.Color("white");

//   let matLite = new THREE.MeshToonMaterial({
//     color: color,
//     side: THREE.DoubleSide,
//   });

//   let message = "Dor Zairi";

//   let shapes = loadedFont.generateShapes(message, 5);

//   let geometry = new THREE.ShapeGeometry(shapes);

//   geometry.computeBoundingBox();

//   let xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

//   geometry.translate(xMid, 0, 0);

//   let text = new THREE.Mesh(geometry, matLite);
//   text.position.set(0, 14, -15);
//   scene.add(text);

//   // Resume Text
//   color = new THREE.Color("black");

//   matLite = new THREE.MeshToonMaterial({
//     color: color,
//     side: THREE.DoubleSide,
//   });

//   message = "resume";

//   shapes = loadedFont.generateShapes(message, 1);

//   geometry = new THREE.ShapeGeometry(shapes);

//   geometry.computeBoundingBox();

//   xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

//   geometry.translate(xMid, 0, 0);

//   text = new THREE.Mesh(geometry, matLite);
//   text.position.set(-0.5, -2, -4);
//   scene.add(text);
// });

// // Gradient background setup
// const colors = [
//   new THREE.Color(0x0000ff),
//   new THREE.Color(0x00ffff),
//   new THREE.Color(0xff00ff),
//   new THREE.Color(0xff0000),
// ];

// const vertexShader = vertex;

// const fragmentShader = fragment;

// const material = new THREE.ShaderMaterial({
//   vertexShader,
//   fragmentShader,
//   uniforms: {
//     colors: { value: colors },
//   },
//   depthTest: false,
// });

// function updateBackgroundColor(time) {
//   const t = Math.sin(time * 0.0005) * 0.5 + 0.5;
//   const newColors = colors.map((color, index) => {
//     const nextIndex = (index + 1) % colors.length;
//     return color.clone().lerp(colors[nextIndex], t);
//   });

//   material.uniforms.colors.value = newColors;
// }

// /*
//  * Lights
//  */

// const light = new THREE.HemisphereLight(0xffffff, 0x080820, 2);
// scene.add(light);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(
//   models.resume.position.x,
//   models.resume.position.y,
//   models.resume.position.z
// );
// controls.enableDamping = true;
// controls.dampingFactor = 0.01;
// controls.rotateSpeed = 0.9;

// const raycaster = new THREE.Raycaster();
// const mouse = new THREE.Vector2();

// // Background scene
// const backgroundScene = new THREE.Scene();

// // Skybox
// const skyboxGeometry = new THREE.PlaneGeometry(2, 2);
// const skybox = new THREE.Mesh(skyboxGeometry, material);
// skybox.scale.set(1000, 1000, 1000);
// backgroundScene.add(skybox);

// renderer.domElement.addEventListener("click", onModelClick);
// renderer.domElement.addEventListener("touchend", onModelClick);

// function onModelClick(event) {
//   event.preventDefault();

//   if (event.type === "touchend") {
//     // Update the mouse coordinates for touch events
//     const touch = event.changedTouches[0];
//     mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
//   } else {
//     // Update the mouse coordinates for click events
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   }

//   raycaster.setFromCamera(mouse, camera);
//   const validObjects = scene.children.filter(
//     (object) => !object.userData.ignoreRaycaster
//   );
//   const intersects = raycaster.intersectObjects(validObjects, true);
//   console.log("intersects: ", intersects);

//   console.log(
//     "intersects userData:",
//     intersects.map((intersect) => intersect.object.userData)
//   );

//   const clickableIntersects = intersects.filter((intersect) => {
//     let currentObject = intersect.object;
//     while (currentObject) {
//       if (currentObject.userData.text) {
//         intersect.userData = currentObject.userData;
//         return true;
//       }
//       currentObject = currentObject.parent;
//     }
//     return false;
//   });

//   console.log("clickableIntersects: ", clickableIntersects);
//   if (clickableIntersects.length > 0) {
//     const clickedObject = clickableIntersects[0].object;

//     // Traverse up the hierarchy to find the parent model
//     let parentModel;
//     let currentObject = clickedObject;
//     while (currentObject) {
//       if (currentObject.userData.text) {
//         parentModel = currentObject;
//         break;
//       }
//       currentObject = currentObject.parent;
//     }

//     for (const model of Object.values(models)) {
//       if (parentModel === model.scene) {
//         handleModelClick(model);
//         break;
//       }
//     }
//   }
// }

// function handleModelClick(model) {
//   function isMobileDevice() {
//     return (
//       typeof window.orientation !== "undefined" ||
//       navigator.userAgent.indexOf("IEMobile") !== -1
//     );
//   }

//   switch (model.text) {

//     case "LinkedIn":
//       if (isMobileDevice()) {
//         const linkedinWebUrl = "https://www.linkedin.com/in/dorz";
//         const linkedinAppUrl = "linkedin://in/dorz";
//         openUrl(linkedinAppUrl, linkedinWebUrl);
//       } else {
//         window.open("https://www.linkedin.com/in/dorz", "_blank").focus();
//       }
//       break;

//     case "Github":
//       if (isMobileDevice()) {
//         const githubWebUrl = "https://www.github.com/MashdorDev";
//         const githubAppUrl = "github://profile/MashdorDev";
//         openUrl(githubAppUrl, githubWebUrl);
//       } else {
//         window.open("https://github.com/MashdorDev", "_blank").focus();
//       }
//       break;
//     case "Resume":
//       fetch("assets/resume/Dor Zairi - Resume.pdf")
//         .then((response) => response.blob())
//         .then((blob) => {
//           const url = URL.createObjectURL(blob);
//           const a = document.createElement("a");
//           a.href = url;
//           a.download = "Dor Zairi - Resume.pdf";
//           document.body.appendChild(a);
//           a.click();
//           a.remove();
//           setTimeout(() => URL.revokeObjectURL(url), 100);
//         });
//       break;

//     default:
//       console.error("Unknown model:", model);
//   }
// }

// function float(elapsedTime) {
//   scene.children.forEach((child) => {
//     if (child.userData.text == "LinkedIn" || child.userData.text == "Github") {
//       child.position.y =
//         models.linkedin.position.y + Math.sin(elapsedTime * 0.7);
//     }
//   });
// }

// function openUrl(appUrl, webUrl) {
//   const startTime = Date.now();
//   const timeout = 500;

//   window.location = appUrl;

//   setTimeout(function () {
//     if (Date.now() - startTime < timeout + 100) {
//       window.open(webUrl, "_blank").focus();
//     }
//   }, timeout);
// }


// function setCameraPosition() {
//   // Update the camera position for better visibility on mobile devices
//   if (window.innerWidth < 768) {
//     camera.position.x = 0;
//     camera.position.y = 10;
//     camera.position.z = 40;
//   } else {
//     camera.position.x = 0;
//     camera.position.y = 20;
//     camera.position.z = 30;
//   }
// }




// const clock = new THREE.Clock();



// function animate(time) {
//   const elapsedTime = clock.getElapsedTime();
//   float(elapsedTime);

//   updateBackgroundColor(time);
//   controls.update();
//   renderer.autoClear = false;
//   renderer.clear();
//   renderer.clearDepth();
//   renderer.render(backgroundScene, camera);
//   renderer.render(scene, camera);
//   requestAnimationFrame(animate);
// }

// requestAnimationFrame(animate);
