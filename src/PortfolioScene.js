import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ModelManager from "./ModelManager";
import BackgroundManager from "./BackgroundManager";
import TextManager from "./TextManager";
import EventManager from "./EventManager";


class PortfolioScene {
  constructor() {
    this.canvas = document.getElementById("bg");
    this.loadedModels = [];
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );


    const light = new THREE.HemisphereLight(0xffffff, 0x080820, 2);
    this.scene.add(light);

    this.modelManager = new ModelManager(this.scene);
    this.backgroundManager = new BackgroundManager(this.scene);
    this.textManager = new TextManager(this.scene);
    this.eventManager = new EventManager(this.renderer, this.camera, this.modelManager);

    this.setCameraPosition();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Wait for the models to load, then set the target of the controls
        this.modelManager.loadAllModels().then(() => {
            const resumeModel = this.modelManager.models.resume;
            this.controls.target.set(
              resumeModel.position.x,
              resumeModel.position.y,
              resumeModel.position.z
            );
          });

        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.01;
        this.controls.rotateSpeed = 0.9;


    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    window.addEventListener("orientationchange", this.onWindowResize.bind(this), false);
  }

  onWindowResize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setCameraPosition() {
    if (window.innerWidth < 768) {
      this.camera.position.x = 0;
      this.camera.position.y = 10;
      this.camera.position.z = 40;
    } else {
      this.camera.position.x = 0;
      this.camera.position.y = 20;
      this.camera.position.z = 30;
    }
  }

  startAnimationLoop() {
    const clock = new THREE.Clock();
    const animate = (time) => {
      const elapsedTime = clock.getElapsedTime();

      this.modelManager.floatModels(elapsedTime);
      this.backgroundManager.updateBackgroundColor(time);
      this.controls.update();  // Add this line

      this.renderer.autoClear = false;
      this.renderer.clear();
      this.renderer.clearDepth();
      this.renderer.render(this.backgroundManager.backgroundScene, this.camera);
      this.renderer.render(this.scene, this.camera);

      requestAnimationFrame(animate);
    };

    animate();
  }
}

export default PortfolioScene;
