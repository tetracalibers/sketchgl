import { AttribLocations, ShapeGeometry, ShapeGeometryOption, getRegistModelBufferFn } from "../base"
import { generateCubeData } from "./generate"

interface CubeConfig extends ShapeGeometryOption {
  size: number
}

export class Cube extends ShapeGeometry {
  private registBuffer: ReturnType<typeof getRegistModelBufferFn>

  constructor(gl: WebGL2RenderingContext, { size, instancing = false }: CubeConfig) {
    super(gl, { instancing })
    const model = generateCubeData(size)
    this.registBuffer = getRegistModelBufferFn(model)
  }

  create(locations: AttribLocations) {
    this.registBuffer(this._geometry, locations)
    this._geometry.setup()
  }
}
