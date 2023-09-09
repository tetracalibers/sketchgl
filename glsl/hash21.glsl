#pragma glslify: import("./XORSHIFT.glsl")

#pragma glslify: hash22 = require("./hash22.glsl")

// 浮動小数点数の2d => 1dハッシュ関数
float hash21(vec2 b) {
  // ビット列を符号なし整数に変換
  uvec2 n = floatBitsToUint(b);
  // 値の正規化
  return float(uhash22(n).x) / float(UINT_MAX);
}

#pragma glslify: export(hash21)
