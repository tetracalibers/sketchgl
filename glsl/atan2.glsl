#pragma glslify: import("./consts.glsl")

// atan を x = 0 上でも定義した拡張版
// tan(y) = x となるy（偏角）を(-PI, PI]の範囲で返す
float atan2(float y, float x) {
  // x = 0 の場合、点 (x, y) はy軸上
  // => つまり、偏角は 90° か -90° で、yの符号によって決まる
  return x == 0.0
    ? sign(y) * PI / 2.0
    : atan(y, x);
}

#pragma glslify: export(atan2)
