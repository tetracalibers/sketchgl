import { AttribLocations, ShapeGeometry, getRegistModelBufferFn } from "../base"
import model from "./model.json"

const registBuffer = getRegistModelBufferFn(model)

export class HalfCanvasCoverPolygon extends ShapeGeometry {
  constructor(gl: WebGL2RenderingContext) {
    super(gl)
  }

  create(locations: Omit<AttribLocations, "normals">) {
    registBuffer(this._geometry, locations)
    this._geometry.setup()
  }
}
