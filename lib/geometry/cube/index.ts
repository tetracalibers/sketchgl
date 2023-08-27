import { ShapeGeometry } from "../shape"
import { generateCubeData } from "./generate"

interface CubeConfig {
  size: number
}

export class Cube extends ShapeGeometry {
  constructor(gl: WebGL2RenderingContext, { size }: CubeConfig) {
    const model = generateCubeData(size)
    super(gl, model)
  }
}
