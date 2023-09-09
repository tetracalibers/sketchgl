#pragma glslify: import("./XORSHIFT.glsl")

// 符号なし整数の2d => 2dハッシュ関数
uvec2 uhash22(uvec2 n) {
  n ^= n.yx << u.xy;
  n ^= n.yx >> u.xy;
  n *= k.xy;
  n ^= n.yx << u.xy;
  return n * k.xy;
}

// 浮動小数点数の2d => 2dハッシュ関数
vec2 hash22(vec2 b) {
  // ビット列を符号なし整数に変換
  uvec2 n = floatBitsToUint(b);
  // 値の正規化
  return vec2(uhash22(n)) / vec2(UINT_MAX);
}

#pragma glslify: export(hash22)
