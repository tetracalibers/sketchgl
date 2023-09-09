float clampRange(float v, float minV, float maxV) {
  return (maxV - minV) * v + minV;
}

#pragma glslify: export(clampRange)
