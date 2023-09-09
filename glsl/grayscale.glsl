// NTSC系加重平均法と呼ばれるグレイスケール変換に使われる手法に則った係数
const float monoR = 0.298912;
const float monoG = 0.586611;
const float monoB = 0.114478;
const vec3 monoScale = vec3(monoR, monoG, monoB);

vec3 toGrayscale(vec3 color) {
  return vec3(dot(color, monoScale));
}

#pragma glslify: export(toGrayscale)
