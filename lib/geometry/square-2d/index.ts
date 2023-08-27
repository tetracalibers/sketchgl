import { InstanceData, InstancedShapeGeometry, ShapeGeometry } from "../shape"
import { generateSquareData } from "./generate"

interface SquareConfig {
  size: number
}

export class Square2D extends ShapeGeometry {
  constructor(gl: WebGL2RenderingContext, { size }: SquareConfig) {
    const model = generateSquareData(size)
    super(gl, model, { for2d: true })
  }
}

type InstancedSquareConfig = SquareConfig & InstanceData

export class InstancedSquare2D extends InstancedShapeGeometry {
  constructor(gl: WebGL2RenderingContext, { size, ...instanceData }: InstancedSquareConfig) {
    const model = generateSquareData(size)
    super(gl, model, instanceData, { for2d: true })
  }
}
