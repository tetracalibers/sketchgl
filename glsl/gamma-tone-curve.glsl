// ガンマ補正のトーンカーブ
vec3 gammaToneCurve(vec3 color, float gamma) {
  return pow(color, vec3(gamma));
}

#pragma glslify: export(gammaToneCurve)
