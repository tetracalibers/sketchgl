float posterize(float value, int level, int maxValue) {
  float valueStep = 255.0 / float(level - 1);

  float unclamp = value * maxValue;
  float newValue = floor(unclamp / valueStep + 0.5) * valueStep;
  newValue /= maxValue;

  return newValue;
}

#pragma glslify: export(posterize)
