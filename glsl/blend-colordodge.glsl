vec3 blend_colordodge(vec3 b, vec3 f) {
  return b / (1.0 - f);
}

#pragma glslify: export(blend_colordodge)
