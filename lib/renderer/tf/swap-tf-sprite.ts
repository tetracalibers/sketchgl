import { AttribLocation, SwapTFBase, isEveryValidLocation } from "./base"

export class SwapSpriteTFRenderer<V extends string> extends SwapTFBase<V> {
  private _attribsFor: {
    update: Map<V, AttribLocation | null>
    render: Map<string, AttribLocation>
    sprite: Map<string, AttribLocation>
  }
  private _sptiteBuffer: WebGLBuffer | null
  private _totalSpriteComponents = 0

  constructor(gl: WebGL2RenderingContext, varyings: V[]) {
    super(gl, varyings)

    this._sptiteBuffer = gl.createBuffer()

    this._attribsFor = {
      update: new Map(varyings.map((key) => [key, null])),
      render: new Map(),
      sprite: new Map()
    }
  }

  registUpdateAttrib(varyingName: V, { location, components, type, divisor }: AttribLocation) {
    const gl = this._gl
    this._totalComponents += components
    this._attribsFor.update.set(varyingName, { location, components, type: type ?? gl.FLOAT, divisor })
  }

  registRenderAttrib(attrName: string, { location, components, type, divisor }: AttribLocation) {
    const gl = this._gl
    this._attribsFor.render.set(attrName, { location, components, type: type ?? gl.FLOAT, divisor })
  }

  registSpriteAttrib(attrName: string, { location, components, type }: Omit<AttribLocation, "divisor">) {
    this._totalSpriteComponents += components
    this._attribsFor.sprite.set(attrName, { location, components, type: type ?? this._gl.FLOAT })
  }

  private bindSpriteBuffer(data: Float32Array) {
    const gl = this._gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this._sptiteBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  }

  private bindAllAttribs() {
    const vaos = this._vaos
    const buffers = this._buffers
    const attribs = this._attribsFor
    const totalComponents = this._totalComponents

    const updateAttribs = [...attribs.update.values()]
    const renderAttribs = [...attribs.render.values()]
    const spriteAttribs = [...attribs.sprite.values()]

    if (!isEveryValidLocation(updateAttribs)) {
      throw new Error("update attribs are not set")
    }

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
            attribs: renderAttribs
          },
          {
            buffer: this._sptiteBuffer,
            stride: 4 * this._totalSpriteComponents,
            attribs: spriteAttribs
          }
        ]
      },
      {
        vao: vaos[3],
        buffers: [
          {
            buffer: buffers[1],
            stride: 4 * totalComponents,
            attribs: renderAttribs
          },
          {
            buffer: this._sptiteBuffer,
            stride: 4 * this._totalSpriteComponents,
            attribs: spriteAttribs
          }
        ]
      }
    ]

    table.map((obj) => this.bindAttribs(obj))
  }

  setup(interleavedInitialArray: Float32Array, interleavedSpriteArray: Float32Array) {
    this.bindBuffer(interleavedInitialArray)
    this.bindSpriteBuffer(interleavedSpriteArray)
    this.bindAllAttribs()
  }
}
