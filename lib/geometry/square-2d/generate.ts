export const generateSquareData = (size: number) => {
  const half = size * 0.5
  const vertices = [-half, half, half, -half, -half, -half, -half, half, half, -half, half, half]
  const uv = [0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]
  return { vertices, uv }
}
