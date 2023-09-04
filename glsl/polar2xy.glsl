// 極座標 (偏角s, 動径t) -> 直交座標 (x, y)
vec2 polar2xy(vec2 pol) {
  // 単位円（半径 = 1）の場合、(x, y) = (cos, sin)
  return pol.t * vec2(cos(pol.s), sin(pol.s));
}

#pragma glslify: export(polar2xy)
