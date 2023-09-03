import { Program } from "../../program"

export interface AttribLocation {
  location: number
  components: number
  type?: number
  divisor?: number
}

interface BufferSource {
  buffer: WebGLBuffer | null
  stride: number
  attribs: AttribLocation[]
}

interface VAOSource {
  vao: WebGLVertexArrayObject | null
  buffers: BufferSource[]
}

export abstract class SwapTFBase<V extends string> {
  protected _gl: WebGL2RenderingContext
  protected _programsFor: {
    update: Program
    render: Program
  }
  protected _varyings: V[]
  protected _buffers: (WebGLBuffer | null)[]
  protected _vaos: (WebGLVertexArrayObject | null)[]

  protected _read = 0
  protected _write = 1

  protected _totalComponents = 0

  constructor(gl: WebGL2RenderingContext, varyings: V[]) {
    this._gl = gl
    this._programsFor = {
      update: new Program(gl),
      render: new Program(gl)
    }
    this._varyings = varyings
    this._buffers = [gl.createBuffer(), gl.createBuffer()]
    this._vaos = [
      gl.createVertexArray() /* for updating buffer 1 */,
      gl.createVertexArray() /* for updating buffer 2 */,
      gl.createVertexArray() /* for rendering buffer 1 */,
      gl.createVertexArray() /* for rendering buffer 2 */
    ]
  }

  abstract registUpdateAttrib(varyingName: V, attrib: AttribLocation): void

  abstract registRenderAttrib(attrName: string, attrib: AttribLocation): void

  protected bindBuffer(data: Float32Array) {
    const gl = this._gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers[0])
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STREAM_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers[1])
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STREAM_DRAW)
  }

  protected bindAttribs({ vao, buffers }: VAOSource) {
    const gl = this._gl

    gl.bindVertexArray(vao)

    for (let i = 0; i < buffers.length; i++) {
      const buffer = buffers[i]
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer)

      let offset = 0
      for (const attrib of buffer.attribs) {
        const { location, components, type } = attrib
        const { stride } = buffer

        gl.enableVertexAttribArray(attrib.location)
        gl.vertexAttribPointer(location, components, type ?? gl.FLOAT, false, stride, offset)

        offset += attrib.components * 4

        if (attrib.divisor !== undefined) {
          gl.vertexAttribDivisor(attrib.location, attrib.divisor)
        }
      }
    }

    gl.bindVertexArray(null)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  abstract setup(...interleavedArray: Float32Array[]): void

  attachUpdateProgram(vert: string, frag: string) {
    this._programsFor.update.attach(vert, frag, this._varyings)
  }

  attachRenderProgram(vert: string, frag: string) {
    this._programsFor.render.attach(vert, frag)
  }

  protected swap() {
    ;[this._read, this._write] = [this._write, this._read]
  }

  startUpdate() {
    const gl = this._gl
    gl.useProgram(this._programsFor.update.glProgram)
    gl.bindVertexArray(this._vaos[this._read])
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this._buffers[this._write])
    gl.enable(gl.RASTERIZER_DISCARD)
    gl.beginTransformFeedback(gl.POINTS)
  }

  endUpdate() {
    const gl = this._gl
    gl.endTransformFeedback()
    gl.disable(gl.RASTERIZER_DISCARD)
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null)
  }

  startRender() {
    const gl = this._gl
    gl.useProgram(this._programsFor.render.glProgram)
    gl.bindVertexArray(this._vaos[this._read + 2])
  }

  endRender() {
    this.swap()
  }

  get glProgramForUpdate() {
    return this._programsFor.update.glProgram
  }

  get glProgramForRender() {
    return this._programsFor.render.glProgram
  }
}

export const isEveryValidLocation = (attribs: Array<AttribLocation | null>): attribs is AttribLocation[] => {
  return !attribs.includes(null)
}
