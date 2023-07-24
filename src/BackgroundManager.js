import * as THREE from "three";
import fragment from "./shaders/fragmentShader.glsl";
import vertex from "./shaders/vertexShader.glsl";

class BackgroundManager {
  constructor(scene) {
    this.scene = scene;
    this.colors = [
      new THREE.Color(0x0000ff),
      new THREE.Color(0x00ffff),
      new THREE.Color(0xff00ff),
      new THREE.Color(0xff0000),
    ];

    this.vertexShader = vertex;
    this.fragmentShader = fragment;

    this.material = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: {
        colors: { value: this.colors },
      },
      depthTest: false,
    });

    this.backgroundScene = new THREE.Scene();
    const skyboxGeometry = new THREE.PlaneGeometry(2, 2);
    this.skybox = new THREE.Mesh(skyboxGeometry, this.material);
    this.skybox.scale.set(1000, 1000, 1000);
    this.backgroundScene.add(this.skybox);
  }

  updateBackgroundColor(time) {
    const t = Math.sin(time * 0.0005) * 0.5 + 0.5;
    const newColors = this.colors.map((color, index) => {
      const nextIndex = (index + 1) % this.colors.length;
      return color.clone().lerp(this.colors[nextIndex], t);
    });

    this.material.uniforms.colors.value = newColors;
  }
}

export default BackgroundManager;
