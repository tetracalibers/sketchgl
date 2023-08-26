import { Geometry, DrawArg } from "./geometry"

export interface AttribLocations {
  vertices: number
  normals?: number
}

type stringlike = string | number

export interface Model {
  vertices: stringlike[]
  normals?: stringlike[]
  indices: stringlike[]
}

export const getRegistModelBufferFn = (model: Model) => (geometry: Geometry, locations: AttribLocations) => {
  geometry.registAttrib({
    location: locations.vertices,
    components: 3,
    buffer: new Float32Array(model.vertices.map(Number))
  })

  if (locations.normals && model.normals) {
    geometry.registAttrib({
      location: locations.normals,
      components: 3,
      buffer: new Float32Array(model.normals.map(Number))
    })
  }

  geometry.registIndices(new Uint16Array(model.indices.map(Number)))
}

export abstract class ShapeGeometry {
  protected _geometry: Geometry

  constructor(gl: WebGL2RenderingContext) {
    this._geometry = new Geometry(gl)
  }

  abstract create(locations: AttribLocations): void

  bind() {
    this._geometry.bind()
  }

  draw(args: DrawArg) {
    this._geometry.draw(args)
  }
}
