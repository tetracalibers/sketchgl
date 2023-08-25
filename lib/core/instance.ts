import { CanvasOptions, Context } from "./context"
import { Clock } from "./clock"
import { ControlUi } from "../gui/control-ui"

export interface SketchConfig {
  canvas: CanvasOptions & {
    el: string | HTMLCanvasElement
  }
  gl?: WebGLContextAttributes
}

export interface SketchCanvas {
  canvas: HTMLCanvasElement
  gl: WebGL2RenderingContext
}

export interface Sketch {
  drawOnFrame?: () => void
  drawOnInit?: () => void
  control?: (ui: ControlUi) => void
}

export type SketchFn = (skCanvas: SketchCanvas) => Sketch

export class SketchGl {
  private loopClock?: Clock

  constructor(skCanvas: SketchConfig, sketchFn: SketchFn) {
    const { canvas: _canvas, gl: glOptions } = skCanvas
    const { el, ...canvasOptions } = _canvas
    const { autoResize } = canvasOptions

    const context = new Context(el, {
      canvas: canvasOptions,
      gl: glOptions
    })

    const { drawOnFrame, drawOnInit, control } = sketchFn(context)
    const drawOnResize = drawOnFrame || drawOnInit

    if (autoResize && drawOnResize) {
      context.addAfterResize(drawOnResize)
    }
    context.startResizeObserve()

    drawOnInit && drawOnInit()

    if (drawOnFrame) {
      this.loopClock = new Clock()
      this.loopClock.on("tick", drawOnFrame)
    }

    if (control) {
      const ui = new ControlUi()
      control(ui)
    }
  }

  static init(skCanvas: SketchConfig, sketchFn: SketchFn) {
    new SketchGl(skCanvas, sketchFn)
  }
}