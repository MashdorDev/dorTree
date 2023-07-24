import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class ModelManager {
  constructor(scene) {
    this.scene = scene;
    this.models = {
          linkedin: {
            url: "assets/linkedin.glb",
            position: { x: -10, y: 8, z: -5 },
            scale: { x: 8, y: 8, z: 8 },
            rotation: { x: -0.2, y: -0.3, z: -0.05 },
            text: "LinkedIn",
          },
          github: {
            url: "assets/github.glb",
            position: { x: 10, y: 8, z: -5 },
            scale: { x: 9, y: 9, z: 9 },
            rotation: { x: -0.1, y: -0.4, z: 0 },
            text: "Github",
          },
          resume: {
            url: "assets/resume.glb",
            position: { x: 0, y: 0, z: -5 },
            scale: { x: 3, y: 3, z: 3 },
            rotation: { x: 0, y: 0, z: 0 },
            text: "Resume",
          },
        };
    this.progress = {
      linkedin: 0,
      github: 0,
      resume: 0,
    };
    this.loadedModels = [];
    this.loadAllModels();
  }

  setScale(object, scale) {
    object.scale.set(scale.x, scale.y, scale.z);
  }

  setPosition(object, position) {
    object.position.set(position.x, position.y, position.z);
  }

  setRotation(object, rotation) {
    object.rotation.set(rotation.x, rotation.y, rotation.z);
  }

  loadGLTFModel(modelKey) {
    const model = this.models[modelKey];
    console.log("Loading model:", model);
    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
      loader.load(
        model.url,
        (gltf) => {
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          this.setScale(gltf.scene, model.scale);
          this.setPosition(gltf.scene, model.position);
          this.setRotation(gltf.scene, model.rotation);
          gltf.scene.userData.text = model.text;
          gltf.scene.name = model.text;

          this.scene.add(gltf.scene);

          model.scene = gltf.scene;
          this.loadedModels.push(model.scene);
          console.log("Model loaded:", model);
          console.log("Loaded models:", this.loadedModels);
          resolve(gltf);
        },
        (xhr) => {
          // Update progress for the current model
          this.progress[modelKey] = Math.round((xhr.loaded / xhr.total) * 100);

          // Calculate total progress
          const totalProgress = Object.values(this.progress).reduce(
            (sum, currProgress) => sum + currProgress,
            0
          );
        },
        (error) => {
          console.error("An error occurred while loading the model:", error);
          reject(error);
        }
      );
    });
  }

  loadAllModels() {
    return Promise.all([
      this.loadGLTFModel("linkedin"),
      this.loadGLTFModel("github"),
      this.loadGLTFModel("resume"),
    ])
      .then(() => {
        console.log("All models loaded");
      })
      .catch((error) => {
        console.error("Error loading models:", error);
      });
  }

  floatModels(elapsedTime) {
    this.scene.children.forEach((child) => {
      if (child.userData.text == "LinkedIn" || child.userData.text == "Github") {
        child.position.y =
          this.models.linkedin.position.y + Math.sin(elapsedTime * 0.7);
      }
    });
  }
}

export default ModelManager;
