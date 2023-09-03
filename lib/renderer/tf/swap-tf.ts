import { AttribLocation, SwapTFBase, isEveryValidLocation } from "./base"

export class SwapTFRenderer<V extends string> extends SwapTFBase<V> {
  private _attribsFor: {
    update: Map<V, AttribLocation | null>
    render: Map<string, AttribLocation>
  }

  constructor(gl: WebGL2RenderingContext, varyings: V[]) {
    super(gl, varyings)
    this._attribsFor = {
      update: new Map(varyings.map((key) => [key, null])),
      render: new Map()
    }
  }

  registUpdateAttrib(varyingName: V, { location, components, type }: Omit<AttribLocation, "divisor">) {
    const gl = this._gl
    this._totalComponents += components
    this._attribsFor.update.set(varyingName, { location, components, type: type ?? gl.FLOAT })
  }

  registRenderAttrib(attrName: string, { location, components, type }: Omit<AttribLocation, "divisor">) {
    const gl = this._gl
    this._attribsFor.render.set(attrName, { location, components, type: type ?? gl.FLOAT })
  }

  setup(interleavedArray: Float32Array) {
    this.bindBuffer(interleavedArray)
    this.bindAllAttribs()
  }

  private bindAllAttribs() {
    const vaos = this._vaos
    const buffers = this._buffers
    const attribs = this._attribsFor
    const totalComponents = this._totalComponents

    const updateAttribs = [...attribs.update.values()]
    const renderAttribs = [...attribs.render.values()]

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
          }
        ]
      }
    ]

    table.map((obj) => this.bindAttribs(obj))
  }
}
