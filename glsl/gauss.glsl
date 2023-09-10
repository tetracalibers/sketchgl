// 正規分布（ガウス分布）
float gauss(float x, float sigma) {
  float s = sigma * sigma;
  return 1.0 / sqrt(2.0 * s) * exp(-x * x / (2.0 * s));
}

#pragma glslify: export(gauss)
