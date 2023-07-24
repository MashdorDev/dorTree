import * as THREE from 'three';
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

class TextManager {
  constructor(scene) {
    this.scene = scene;
    this.fontLoader = new FontLoader();
    this.loadedFont = null;
    this.loadTexts();
  }

  loadTexts() {
    this.fontLoader.load("assets/font/Montserrat_Medium_Regular.json", (font) => {
      this.loadedFont = font;
      this.addTextToScene("Dor Zairi", "white", 5, {x: 0, y: 14, z: -15});
      this.addTextToScene("resume", "black", 1, {x: -0.5, y: -2, z: -4});
    });
  }

  addTextToScene(message, colorName, size, position) {
    let color = new THREE.Color(colorName);
    let matLite = new THREE.MeshToonMaterial({
      color: color,
      side: THREE.DoubleSide,
    });
    let shapes = this.loadedFont.generateShapes(message, size);
    let geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    let xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);
    let text = new THREE.Mesh(geometry, matLite);
    text.position.set(position.x, position.y, position.z);
    this.scene.add(text);
  }
}

export default TextManager;