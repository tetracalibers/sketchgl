import { AttribLocations, ShapeGeometry, ShapeGeometryOption, getRegistModelBufferFn } from "../base"
import model from "./model.json"

const registBuffer = getRegistModelBufferFn(model)

export class Icosahedron extends ShapeGeometry {
  constructor(gl: WebGL2RenderingContext, { instancing = false }: ShapeGeometryOption = {}) {
    super(gl, { instancing })
  }

  create(locations: Omit<AttribLocations, "uv">) {
    registBuffer(this._geometry, locations)
    this._geometry.setup()
  }
}
