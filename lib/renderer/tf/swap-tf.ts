import { Program } from "../../program"

interface AttribLocation {
  location: number
  components: number
  type?: number
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

export class SwapTFRenderer<V extends string> {
  private _gl: WebGL2RenderingContext
  private _programsFor: {
    update: Program
    render: Program
  }
  private _attribsFor: {
    update: Map<V, AttribLocation>
    render: AttribLocation[]
  } = {
    update: new Map(),
    render: []
  }
  private _varyings: V[] = []
  private _buffers: (WebGLBuffer | null)[]
  private _vaos: (WebGLVertexArrayObject | null)[]

  private _read = 0
  private _write = 1

  private _totalComponents = 0

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

  registUpdateAttrib(varyingName: V, { location, components, type }: AttribLocation) {
    const gl = this._gl
    this._totalComponents += components
    this._attribsFor.update.set(varyingName, { location, components, type: type ?? gl.FLOAT })
  }

  registRenderAttrib({ location, components, type }: AttribLocation) {
    const gl = this._gl
    this._attribsFor.render.push({ location, components, type: type ?? gl.FLOAT })
  }

  setup(interleavedArray: Float32Array) {
    this.bindBuffer(interleavedArray)
    this.bindAllAttribs()
  }

  attachUpdateProgram(vert: string, frag: string) {
    this._programsFor.update.attach(vert, frag, this._varyings)
  }

  attachRenderProgram(vert: string, frag: string) {
    this._programsFor.render.attach(vert, frag)
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

  private swap() {
    ;[this._read, this._write] = [this._write, this._read]
  }

  private bindBuffer(data: Float32Array) {
    const gl = this._gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers[0])
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STREAM_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers[1])
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STREAM_DRAW)
  }

  private bindAllAttribs() {
    const vaos = this._vaos
    const buffers = this._buffers
    const attribs = this._attribsFor
    const totalComponents = this._totalComponents

    const updateAttribs = this._varyings
      .map((key) => this._attribsFor.update.get(key))
      .filter((a): a is AttribLocation => a !== undefined)

    const table = [
      {
        vao: vaos[0],
        buffers: [
          {
            buffer: buffers[0],
            stride: 4 * totalComponents,
            attribs: updateAttribs
          }
        ]
      },
      {
        vao: vaos[1],
        buffers: [
          {
            buffer: buffers[1],
            stride: 4 * totalComponents,
            attribs: updateAttribs
          }
        ]
      },
      {
        vao: vaos[2],
        buffers: [
          {
            buffer: buffers[0],
            stride: 4 * totalComponents,
            attribs: attribs.render
          }
        ]
      },
      {
        vao: vaos[3],
        buffers: [
          {
            buffer: buffers[1],
            stride: 4 * totalComponents,
            attribs: attribs.render
          }
        ]
      }
    ]

    table.map((obj) => this.bindAttribs(obj))
  }

  private bindAttribs({ vao, buffers }: VAOSource) {
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
      }
    }

    gl.bindVertexArray(null)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  get glProgramForUpdate() {
    return this._programsFor.update.glProgram
  }

  get glProgramForRender() {
    return this._programsFor.render.glProgram
  }
}
