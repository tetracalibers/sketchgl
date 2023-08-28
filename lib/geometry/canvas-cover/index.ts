import { AttribLocations, ShapeGeometry } from "../shape"
import model from "./model.json"

export class CanvasCoverPolygon extends ShapeGeometry {
  constructor(gl: WebGL2RenderingContext) {
    super(gl, model)
  }

  setLocations(locations: Omit<AttribLocations, "normals">) {
    super.setLocations(locations)
  }
}
