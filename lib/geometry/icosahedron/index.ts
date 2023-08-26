import { ShapeGeometry, getRegistModelBufferFn } from "../base"
import model from "./model.json"

const registBuffer = getRegistModelBufferFn(model)

interface AttribLocations {
  vertices: number
  normals?: number
}

export class Icosahedron extends ShapeGeometry {
  constructor(gl: WebGL2RenderingContext) {
    super(gl)
  }

  create(locations: AttribLocations) {
    registBuffer(this._geometry, locations)
    this._geometry.setup()
  }
}
