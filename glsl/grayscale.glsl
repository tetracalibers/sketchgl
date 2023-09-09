// NTSC系加重平均法と呼ばれるグレイスケール変換に使われる手法に則った係数
const float R_LUMINANCE = 0.298912;
const float G_LUMINANCE = 0.586611;
const float B_LUMINANCE = 0.114478;

vec3 toGrayscale(vec3 color) {
  return vec3(dot(color, vec3(R_LUMINANCE, G_LUMINANCE, B_LUMINANCE)));
}

#pragma glslify: export(toGrayscale)
