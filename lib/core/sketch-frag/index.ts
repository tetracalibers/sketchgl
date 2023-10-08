import { Program } from "$/program"
import { Context } from "../context"
import { SketchBase } from "../sketch/core"
import { SketchProxyBase } from "../sketch/proxy"
import { SketchCanvas, SketchConfig, SketchFn } from "../sketch/type"

// @ts-ignore
import vert from "./full-canvas.vert?raw"

export interface SketchFragConfig extends SketchConfig {
  frag: string
}

export interface SketchFragCanvas extends SketchCanvas {
  program: WebGLProgram
  renderToCanvas: () => void
}

export type SketchFragFn = SketchFn<SketchFragCanvas>

class SketchFragCore extends SketchBase<SketchFragCanvas, SketchFragConfig> {
  private _program: Program

  constructor(config: SketchFragConfig, sketchFn: SketchFragFn) {
    super(config, sketchFn)

    const { frag } = config
    this._program = this._buildProgram(frag)
  }

  _pluckSketchFnArgs(context: Context) {
    const { canvas, gl } = context
    const renderToCanvas = () => {
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 3)
    }
    const program = this._program.glProgram

    if (!program) {
      throw new Error("[sketchgl] Failed to initialize program")
    }

    return { canvas, gl, program, renderToCanvas }
  }

  private _buildProgram(frag: string) {
    const { gl } = this._context

    const program = new Program(gl)
    program.attach(vert, frag)
    program.activate()

    if (!program.glProgram) {
      throw new Error("Program is not available")
    }

    return program
  }

  _setup() {}

  _beforeStart() {}
}

export class SketchFrag extends SketchProxyBase<SketchFragCore, SketchFragCanvas, SketchFragConfig> {
  /** @internal */
  _instantiation(config: SketchFragConfig) {
    return new SketchFragCore(config, this._sketch)
  }

  async start() {
    const real = this._realize()
    await real.start()
  }
}