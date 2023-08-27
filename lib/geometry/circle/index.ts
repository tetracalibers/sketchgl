import { InstanceData, InstancedShapeGeometry, ShapeGeometry } from "../shape"
import { generateCircleData } from "./generate"

interface CircleConfig {
  radius: number
  segments: number
}

export class Circle extends ShapeGeometry {
  constructor(gl: WebGL2RenderingContext, { radius, segments }: CircleConfig) {
    const model = generateCircleData(radius, segments)
    super(gl, model, { for2d: true })
  }
}

type InstancedCircleConfig = CircleConfig & InstanceData

export class InstancedCircle extends InstancedShapeGeometry {
  constructor(gl: WebGL2RenderingContext, { radius, segments, ...instanceData }: InstancedCircleConfig) {
    const model = generateCircleData(radius, segments)
    super(gl, model, instanceData, { for2d: true })
  }
}
