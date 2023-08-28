import { Context } from "../context"
import { Sketch, SketchCanvas, SketchConfig, SketchGl } from "../sketch-gl"
import { Program } from "../../program"

// @ts-ignore
import vert from "./full-canvas.vert?raw"

export interface FragmentSketchConfig extends SketchConfig {
  frag: string
}

export interface FragmentSketchCanvas extends SketchCanvas {
  program: WebGLProgram
  renderToCanvas: () => void
}

export interface FragmentSketch extends Sketch {}

export type FragmentSketchFn = (skCanvas: FragmentSketchCanvas) => Sketch

export class SketchFrg extends SketchGl {
  protected constructor(skCanvas: FragmentSketchConfig, sketchFn: FragmentSketchFn) {
    const { canvas: _canvas, gl: glOptions, frag } = skCanvas
    const { el, ...canvasOptions } = _canvas

    const context = new Context(el, {
      canvas: canvasOptions,
      gl: glOptions
    })
    const { canvas, gl } = context

    const _program = new Program(gl)
    _program.attach(vert, frag)
    _program.activate()

    const program = _program.get()
    if (!program) throw new Error("Program is not available")

    const renderToCanvas = () => gl.drawArrays(gl.TRIANGLE_FAN, 0, 3)

    const sketch = sketchFn({ canvas, gl, program, renderToCanvas })

    super(context, sketch, canvasOptions)
  }

  static init(skCanvas: FragmentSketchConfig, sketchFn: FragmentSketchFn) {
    new SketchFrg(skCanvas, sketchFn)
  }
}
