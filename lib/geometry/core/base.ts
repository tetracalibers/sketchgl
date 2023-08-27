export type DrawPrimitive =
  | "TRIANGLES"
  | "TRIANGLE_STRIP"
  | "TRIANGLE_FAN"
  | "LINES"
  | "LINE_STRIP"
  | "LINE_LOOP"
  | "POINTS"

export type AttributeName = "vertice" | "normal" | "uv" | "color"

export interface AttributeArg {
  buffer: Float32Array
  location: number
  components: number
  type?: number
  divisor?: number
}

export interface Attribute {
  buffer: WebGLBuffer | null
  location: number
  components: number
  length: number
  type?: number
  divisor?: number
}

export type AttributeMap = Map<AttributeName, Attribute>

export abstract class GeometryBuffer {
  protected _gl: WebGL2RenderingContext
  protected _vao: WebGLVertexArrayObject | null
  protected _attributes: AttributeMap = new Map()

  constructor(gl: WebGL2RenderingContext) {
    this._gl = gl
    this._vao = gl.createVertexArray()
  }

  registAttrib(name: AttributeName, attr: AttributeArg) {
    const gl = this._gl
    const buffer = this._gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, attr.buffer, gl.STATIC_DRAW)
    const length = attr.buffer.length
    this._attributes.set(name, { ...attr, buffer, length })
  }

  protected setupAttribs() {
    const gl = this._gl
    const attributes = this._attributes
    const vao = this._vao

    gl.bindVertexArray(vao)

    attributes.forEach((attribute) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer)

      gl.enableVertexAttribArray(attribute.location)
      gl.vertexAttribPointer(attribute.location, attribute.components, attribute.type ?? gl.FLOAT, false, 0, 0)

      if (attribute.divisor !== undefined) {
        gl.vertexAttribDivisor(attribute.location, attribute.divisor)
      }
    })

    gl.bindVertexArray(null)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  abstract setup(): void

  abstract bind(): void

  abstract draw(args: any): void
}
