import { DrawPrimitive, GeometryBuffer } from "./base"

export interface InstancedDrawConfig {
  primitive?: DrawPrimitive
  first?: number
  instanceCount: number
}

export class InstancedGeometry extends GeometryBuffer {
  constructor(gl: WebGL2RenderingContext) {
    super(gl)
  }

  setup() {
    this.setupAttribs()
  }

  bind() {
    const gl = this._gl
    gl.bindVertexArray(this._vao)
  }

  draw({ primitive = "TRIANGLES", first = 0, instanceCount }: InstancedDrawConfig) {
    const gl = this._gl

    const vertices = this._attributes.get("vertice")

    if (!vertices) {
      console.error("vertices not found")
      return
    }

    const count = vertices.length / vertices.components

    gl.drawArraysInstanced(gl[primitive], first, count, instanceCount)
  }
}
