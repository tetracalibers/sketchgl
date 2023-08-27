import { AttribLocations, ShapeGeometry } from "../shape"
import model from "./model.json"

export class HalfCanvasCoverPolygon extends ShapeGeometry {
  constructor(gl: WebGL2RenderingContext) {
    super(gl, model)
  }

  create(locations: Omit<AttribLocations, "normals">) {
    super.create(locations)
  }
}
