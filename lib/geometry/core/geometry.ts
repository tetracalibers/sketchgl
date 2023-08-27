import { DrawPrimitive, GeometryBuffer } from "./base"

export interface DrawConfig {
  primitive?: DrawPrimitive
  count?: number
  offset?: number
}

export class Geometry extends GeometryBuffer {
  private _ibo: WebGLBuffer | null
  private _indicesCount: number = 0

  constructor(gl: WebGL2RenderingContext) {
    super(gl)
    this._ibo = gl.createBuffer()
  }

  registIndices(indices: Uint16Array) {
    const gl = this._gl
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ibo)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
    this._indicesCount = indices.length
  }

  setup() {
    const gl = this._gl
    this.setupAttribs()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
  }

  bind() {
    const gl = this._gl
    gl.bindVertexArray(this._vao)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ibo)
  }

  draw({ primitive = "TRIANGLES", count = this._indicesCount, offset = 0 }: DrawConfig = {}) {
    const gl = this._gl
    gl.drawElements(gl[primitive], count, gl.UNSIGNED_SHORT, offset)
  }
}
