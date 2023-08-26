import { AttribLocations, ShapeGeometry, getRegistModelBufferFn } from "../base"
import { generateSphereData } from "./generate"

interface SphereConfig {
  radius: number
  segments: number
  rings: number
}

export class Sphere extends ShapeGeometry {
  private registBuffer: ReturnType<typeof getRegistModelBufferFn>

  constructor(gl: WebGL2RenderingContext, { radius, segments, rings }: SphereConfig) {
    super(gl)
    const model = generateSphereData(radius, segments, rings)
    this.registBuffer = getRegistModelBufferFn(model)
  }

  create(locations: AttribLocations) {
    this.registBuffer(this._geometry, locations)
    this._geometry.setup()
  }
}
