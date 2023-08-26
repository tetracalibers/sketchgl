import { AttribLocations, ShapeGeometry, getRegistModelBufferFn } from "../base"
import { generateCubeData } from "./generate"

interface CubeConfig {
  size: number
}

export class Cube extends ShapeGeometry {
  private registBuffer: ReturnType<typeof getRegistModelBufferFn>

  constructor(gl: WebGL2RenderingContext, { size }: CubeConfig) {
    super(gl)
    const model = generateCubeData(size)
    this.registBuffer = getRegistModelBufferFn(model)
  }

  create(locations: AttribLocations) {
    this.registBuffer(this._geometry, locations)
    this._geometry.setup()
  }
}
