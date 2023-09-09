vec3 blend_overlay(vec3 b, vec3 f) {
  float brightness = max(b.r, max(b.g, b.b));
  return mix(2.0 * b * f, 1.0 - 2.0 * (1.0 - b) * (1.0 - f), step(0.5, brightness));
}

#pragma glslify: export(blend_overlay)
