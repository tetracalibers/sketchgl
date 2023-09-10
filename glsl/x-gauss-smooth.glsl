#pragma glslify: gauss = require("./gauss.glsl")

// Gaussianフィルタによる平滑化（横方向）
vec3 xGaussSmooth(sampler2D tex, vec2 uv, vec2 texelSize, float filterSize, float sigma) {
  float weights = 0.0;
  vec3 grad = vec3(0.0);

  float h = (filterSize - 1.0) / 2.0;

  for (float i = -h; i <= h; ++i) {
    float weight = gauss(i, sigma);
    vec2 offset = vec2(i * texelSize.x, 0.0);
    vec3 color = texture(tex, uv + offset).rgb;
    weights += weight;
    grad += color * weight;
  }

  return grad / weights;
}

#pragma glslify: export(xGaussSmooth)
