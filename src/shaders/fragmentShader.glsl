varying vec2 vUv;
uniform vec3 colors[4];

void main() {
  vec3 topLeft = mix(colors[0], colors[1], vUv.y);
  vec3 bottomRight = mix(colors[2], colors[3], vUv.y);
  vec3 color = mix(topLeft, bottomRight, vUv.x);

  gl_FragColor = vec4(color, 1.0);
}