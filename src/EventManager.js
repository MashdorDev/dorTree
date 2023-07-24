import * as THREE from "three";

class EventManager {
  constructor(renderer, camera, modelManager) {
    this.renderer = renderer;
    this.camera = camera;
    this.modelManager = modelManager;
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.renderer.domElement.addEventListener(
      "click",
      this.onModelClick.bind(this)
    );
    this.renderer.domElement.addEventListener(
      "touchend",
      this.onModelClick.bind(this)
    );
  }

  onModelClick(event) {
    event.preventDefault();

    if (event.type === "touchend") {
      const touch = event.changedTouches[0];
      this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    } else {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.modelManager.loadedModels,
      true
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

    if (clickableIntersects.length > 0) {
      const clickedObject = clickableIntersects[0].object;
      let parentModel;
      let currentObject = clickedObject;
      while (currentObject) {
        if (currentObject.userData.text) {
          parentModel = currentObject;
          break;
        }
        currentObject = currentObject.parent;
      }
      for (const model of Object.values(this.modelManager.models)) {
        if (parentModel.name === model.scene.name) {
          this.handleModelClick(model);
          break;
        }
      }
    }
  }

  handleModelClick(model) {
    function isMobileDevice() {
      return (
        typeof window.orientation !== "undefined" ||
        navigator.userAgent.indexOf("IEMobile") !== -1
      );
    }

    const urlMap = {
      LinkedIn: isMobileDevice()
        ? {
            appUrl: "linkedin://in/dorz",
            webUrl: "https://www.linkedin.com/in/dorz",
          }
        : "https://www.linkedin.com/in/dorz",
      Github: isMobileDevice()
        ? {
            appUrl: "github://profile/MashdorDev",
            webUrl: "https://www.github.com/MashdorDev",
          }
        : "https://github.com/MashdorDev",
      Resume: "assets/resume/Dor Zairi - Resume.pdf",
    };

    const url = urlMap[model.text];

    if (typeof url === "string") {
      window.open(url, "_blank").focus();
    } else {
      this.openUrl(url.appUrl, url.webUrl);
    }
  }

  openUrl(appUrl, webUrl) {
    const startTime = Date.now();
    const timeout = 500;

    window.location = appUrl;

    setTimeout(function () {
      if (Date.now() - startTime < timeout + 100) {
        window.open(webUrl, "_blank").focus();
      }
    }, timeout);
  }
}

export default EventManager;
