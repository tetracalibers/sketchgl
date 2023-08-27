import { AttribLocations, ShapeGeometry } from "../shape"
import model from "./model.json"

export class Icosahedron extends ShapeGeometry {
  constructor(gl: WebGL2RenderingContext) {
    super(gl, model)
  }

  create(locations: Omit<AttribLocations, "uv">) {
    super.create(locations)
  }
}
