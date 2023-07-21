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