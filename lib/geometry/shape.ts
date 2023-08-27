import { DrawConfig, Geometry } from "./core/geometry"
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
  indices?: stringlike[]
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

    if ("registIndices" in geometry && model.indices) {
      geometry.registIndices(new Uint16Array(model.indices.map(Number)))
    }
  }

interface Shape<A> {
  create(locations: AttribLocations): void
  bind(): void
  draw(args: A): void
}

export class ShapeGeometry implements Shape<DrawConfig> {
  protected _geometry: Geometry
  protected _register: ReturnType<typeof getRegistModelBufferFn>

  constructor(gl: WebGL2RenderingContext, model: Model) {
    this._geometry = new Geometry(gl)
    this._register = getRegistModelBufferFn(model)
  }

  create(locations: AttribLocations) {
    this._register(this._geometry, locations)
    this._geometry.setup()
  }

  bind() {
    this._geometry.bind()
  }

  draw(args: DrawConfig) {
    this._geometry.draw(args)
  }
}

export class InstancedShapeGeometry implements Shape<InstancedDrawConfig> {
  protected _geometry: InstancedGeometry
  protected _register: ReturnType<typeof getRegistModelBufferFn>

  constructor(gl: WebGL2RenderingContext, model: Model) {
    this._geometry = new InstancedGeometry(gl)
    this._register = getRegistModelBufferFn(model)
  }

  create(locations: AttribLocations) {
    this._register(this._geometry, locations)
    this._geometry.setup()
  }

  bind() {
    this._geometry.bind()
  }

  draw(args: InstancedDrawConfig) {
    this._geometry.draw(args)
  }
}
