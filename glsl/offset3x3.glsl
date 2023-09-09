vec2[9] offset3x3(vec2 texelSize) {
  vec2 offset[9];

  offset[0] = vec2(-texelSize.x, -texelSize.y);
  offset[1] = vec2(0.0, -texelSize.y);
  offset[2] = vec2(texelSize.x, -texelSize.y);
  offset[3] = vec2(-texelSize.x, 0.0);
  offset[4] = vec2(0.0, 0.0);
  offset[5] = vec2(texelSize.x, 0.0);
  offset[6] = vec2(-texelSize.x, texelSize.y);
  offset[7] = vec2(0.0, texelSize.y);
  offset[8] = vec2(texelSize.x, 1.0);

  return offset;
}

#pragma glslify: export(offset3x3)
