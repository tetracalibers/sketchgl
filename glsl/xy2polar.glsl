#pragma glslify: atan2 = require("./atan2.glsl")

// 直交座標 (x, y) -> 極座標 (偏角s, 動径t)
vec2 xy2polar(vec2 xy) {
  return vec2(atan2(xy.y, xy.x), length(xy));
}

#pragma glslify: export(xy2polar)
