vec3 blend_lighten(vec3 b, vec3 f) {
  return max(b, f);
}

#pragma glslify: export(blend_lighten)
