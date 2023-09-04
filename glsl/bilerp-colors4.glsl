vec3 bilerp_colors4(vec3[4] colors4, vec2 pos) {
  vec3 bilerpColor = mix(mix(colors4[0], colors4[1], pos.x), mix(colors4[2], colors4[3], pos.x), pos.y);
  return bilerpColor;
}

#pragma glslify: export(bilerp_colors4)
