// fork from https://www.shadertoy.com/view/MsS3Wc
vec3 hsv2rgb(vec3 color) {
  // Hueを[0, 1]から[0, 6]へスケール
  float hue = color.x * 6.0;

  vec3 m = mod(hue + vec3(0.0, 4.0, 2.0), 6.0);
  vec3 a = abs(m - 3.0);
  vec3 rgb = clamp(a - 1.0, 0.0, 1.0);

  // 白とrgbを彩度（動径）に沿って補間したものに明度をかける
  return color.z * mix(vec3(1.0), rgb, color.y);
}

#pragma glslify: export(hsv2rgb)
