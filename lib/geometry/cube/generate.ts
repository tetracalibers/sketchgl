export const generateCubeData = (size: number) => {
  const half = size * 0.5
  const vertices = [
    -half,
    -half,
    half,
    half,
    -half,
    half,
    half,
    half,
    half,
    -half,
    half,
    half,
    -half,
    -half,
    -half,
    -half,
    half,
    -half,
    half,
    half,
    -half,
    half,
    -half,
    -half,
    -half,
    half,
    -half,
    -half,
    half,
    half,
    half,
    half,
    half,
    half,
    half,
    -half,
    -half,
    -half,
    -half,
    half,
    -half,
    -half,
    half,
    -half,
    half,
    -half,
    -half,
    half,
    half,
    -half,
    -half,
    half,
    half,
    -half,
    half,
    half,
    half,
    half,
    -half,
    half,
    -half,
    -half,
    -half,
    -half,
    -half,
    half,
    -half,
    half,
    half,
    -half,
    half,
    -half
  ]

  const normals = [
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0,
    1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0,
    1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
  ]

  const texCoords = [
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0,
    1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 1.0
  ]

  const indices = [
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22,
    20, 22, 23
  ]

  return { vertices, normals, texCoords, indices }
}
