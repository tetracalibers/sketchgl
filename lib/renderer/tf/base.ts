export interface Attribute {
  buffer: WebGLBuffer | null
  location: number
  components: number
  stride: number
  type?: number
  divisor?: number
}

export abstract class TFRendererBase {
  protected _gl: WebGL2RenderingContext

  constructor(gl: WebGL2RenderingContext) {
    this._gl = gl

    const tf = gl.createTransformFeedback()
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf)
  }

  protected createVBO(data: Float32Array) {
    const gl = this._gl
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    return vbo
  }

  protected setAttributes(list: Attribute[]) {
    const gl = this._gl
    list.forEach(({ buffer, location, stride }) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.enableVertexAttribArray(location)
      gl.vertexAttribPointer(location, stride, gl.FLOAT, false, 0, 0)
    })
  }

  protected setAttributesBase(list: Attribute[]) {
    const gl = this._gl
    list.forEach(({ buffer, location }) => {
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, location, buffer)
    })
  }

  protected clearAttributesBase(list: Attribute[]) {
    const gl = this._gl
    list.forEach(({ location }) => {
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, location, null)
    })
  }
}
