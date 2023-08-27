import { ShapeGeometry } from "../shape"
import { generateSphereData } from "./generate"

interface SphereConfig {
  radius: number
  segments: number
  rings: number
}

export class Sphere extends ShapeGeometry {
  constructor(gl: WebGL2RenderingContext, { radius, segments, rings }: SphereConfig) {
    const model = generateSphereData(radius, segments, rings)
    super(gl, model)
  }
}
