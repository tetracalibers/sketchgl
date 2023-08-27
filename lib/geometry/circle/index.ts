import { InstancedShapeGeometry, ShapeGeometry } from "../shape"
import { generateCircleData } from "./generate"

interface CircleConfig {
  radius: number
  segments: number
}

export class Circle extends ShapeGeometry {
  constructor(gl: WebGL2RenderingContext, { radius, segments }: CircleConfig) {
    const model = generateCircleData(radius, segments)
    super(gl, model)
  }
}

export class InstancedCircle extends InstancedShapeGeometry {
  constructor(gl: WebGL2RenderingContext, { radius, segments }: CircleConfig) {
    const model = generateCircleData(radius, segments)
    super(gl, model)
  }

  calcOffsets(instanceCount: number) {
    const data = []

    for (let i = 0; i < instanceCount; i++) {
      const theta = (Math.PI * 2 * i) / instanceCount
      data.push(Math.cos(theta), Math.sin(theta))
    }

    return data
  }
}
