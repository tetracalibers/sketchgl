import { DrawConfig, Geometry } from "./core/geometry"
import { InstancedDrawConfig, InstancedGeometry } from "./core/instanced-geometry"

export interface AttribLocations {
  vertices: number
  normals?: number
  uv?: number
  offset?: number
}

type stringlike = string | number

export interface Model {
  vertices: stringlike[]
  normals?: stringlike[]
  uv?: stringlike[]
  indices?: stringlike[]
}

const getRegist2dAttribFn =
  (model: Model) =>
  <G extends Geometry | InstancedGeometry>(geometry: G, locations: AttribLocations) => {
    geometry.registAttrib("vertice", {
      location: locations.vertices,
      components: 2,
      buffer: new Float32Array(model.vertices.map(Number))
    })

    if (locations.normals && model.normals) {
      geometry.registAttrib("normal", {
        location: locations.normals,
        components: 2,
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

  constructor(gl: WebGL2RenderingContext, model: Model, { for2d = false } = {}) {
    this._geometry = new Geometry(gl)
    this._attribRegister = for2d ? getRegist2dAttribFn(model) : getRegistAttribFn(model)
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

export abstract class InstancedShapeGeometry implements Shape<InstancedDrawConfig> {
  protected _geometry: InstancedGeometry
  protected _attribRegister: ReturnType<typeof getRegistAttribFn>
  protected _instanceCount: number

  constructor(gl: WebGL2RenderingContext, model: Model, instanceCount: number, { for2d = false } = {}) {
    this._geometry = new InstancedGeometry(gl)
    this._attribRegister = for2d ? getRegist2dAttribFn(model) : getRegistAttribFn(model)
    this._instanceCount = instanceCount
  }

  abstract _calcOffsets(instanceCount: number): { components: number; buffer: Float32Array; divisor: number }

  create(locations: AttribLocations) {
    this._attribRegister(this._geometry, locations)

    if (locations.offset) {
      const offset = this._calcOffsets(this._instanceCount)
      this._geometry.registAttrib("offset", {
        location: locations.offset,
        ...offset
      })
    }

    this._geometry.setup()
  }

  bind() {
    this._geometry.bind()
  }

  draw(args: Omit<InstancedDrawConfig, "instanceCount">) {
    this._geometry.draw({ ...args, instanceCount: this._instanceCount })
  }
}
