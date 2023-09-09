vec3 offsetLookup(sampler2D tex, vec2 center, vec2 offset) {
  return texture(tex, center + offset).rgb;
}

#pragma glslify: export(offsetLookup)
