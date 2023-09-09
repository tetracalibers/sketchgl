vec3 blend_screen(vec3 b, vec3 f) {
  return 1.0 - (1.0 - b) * (1.0 - f);
}

#pragma glslify: export(blend_screen)
