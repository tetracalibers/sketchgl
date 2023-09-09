vec3 blend_colorburn(vec3 b, vec3 f) {
  return 1.0 - (1.0 - b) / f;
}

#pragma glslify: export(blend_colorburn)
