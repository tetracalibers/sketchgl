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

export const getRegistAttribFn =
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
  }

const getRegistIndicesFn = (model: Model) => (geometry: Geometry) => {
  if (model.indices) {
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
  protected _attribRegister: ReturnType<typeof getRegistAttribFn>
  protected _indicesRegister: ReturnType<typeof getRegistIndicesFn>

  constructor(gl: WebGL2RenderingContext, model: Model) {
    this._geometry = new Geometry(gl)
    this._attribRegister = getRegistAttribFn(model)
    this._indicesRegister = getRegistIndicesFn(model)
  }

  create(locations: AttribLocations) {
    this._attribRegister(this._geometry, locations)
    this._indicesRegister(this._geometry)
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
  protected _attribRegister: ReturnType<typeof getRegistAttribFn>

  constructor(gl: WebGL2RenderingContext, model: Model) {
    this._geometry = new InstancedGeometry(gl)
    this._attribRegister = getRegistAttribFn(model)
  }

  create(locations: AttribLocations) {
    this._attribRegister(this._geometry, locations)
    this._geometry.setup()
  }

  bind() {
    this._geometry.bind()
  }

  draw(args: InstancedDrawConfig) {
    this._geometry.draw(args)
  }
}
