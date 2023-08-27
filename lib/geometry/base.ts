import { GeometryBuffer } from "./core/base"
import { Geometry, DrawConfig } from "./core/geometry"
import { InstancedDrawConfig, InstancedGeometry } from "./core/instanced-geometry"

export interface AttribLocations {
  vertices: number
  normals?: number
  uv?: number
}

type stringlike = string | number

export interface Model {
  vertices: stringlike[]
  normals?: stringlike[]
  uv?: stringlike[]
  indices: stringlike[]
}

export interface ShapeGeometryOption {
  instancing?: boolean
}

export const getRegistModelBufferFn =
  (model: Model) =>
  <G extends Geometry | InstancedGeometry>(geometry: G, locations: AttribLocations) => {
    geometry.registAttrib("vertice", {
      location: locations.vertices,
      components: 3,
      buffer: new Float32Array(model.vertices.map(Number))
    })

    if (locations.normals && model.normals) {
      geometry.registAttrib("normal", {
        location: locations.normals,
        components: 3,
        buffer: new Float32Array(model.normals.map(Number))
      })
    }

    if (locations.uv && model.uv) {
      geometry.registAttrib("uv", {
        location: locations.uv,
        components: 2,
        buffer: new Float32Array(model.uv.map(Number))
      })
    }

    if ("registIndices" in geometry) {
      geometry.registIndices(new Uint16Array(model.indices.map(Number)))
    }
  }

export abstract class ShapeGeometry {
  protected _geometry: InstancedGeometry | Geometry

  constructor(gl: WebGL2RenderingContext, { instancing = false }: ShapeGeometryOption) {
    this._geometry = instancing ? new InstancedGeometry(gl) : new Geometry(gl)
  }

  abstract create(locations: AttribLocations): void

  bind() {
    this._geometry.bind()
  }

  get draw() {
    return this._geometry.draw
  }
}
