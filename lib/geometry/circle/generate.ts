export const generateCircleData = (radius: number, vertexCount: number) => {
  const vertices = []
  const angleIncrement = (2 * Math.PI) / vertexCount

  for (let i = 0; i <= vertexCount; i++) {
    const angle = i * angleIncrement
    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)

    vertices.push(x, y)
  }

  return {
    vertices
  }
}
