#pragma glslify: toGrayscale = require("./grayscale.glsl")

// セピアは、RGBで表すと(107, 74, 43)
// 全てのフラグメントをグレイスケール化した後で、上記のRGBの比率に各フラグメントの値を調整
const float sepiaR = 1.07;
const float sepiaG = 0.74;
const float sepiaB = 0.43;
const vec3 sepiaScale = vec3(sepiaR, sepiaG, sepiaB);

vec3 toSepia(vec3 color) {
  return toGrayscale(color) * sepiaScale;
}

#pragma glslify: export(toSepia)
