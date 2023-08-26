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
  preload?: Promise<unknown>[]
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

    const sketch = sketchFn(context)

    const { drawOnFrame, drawOnInit, control, preload } = sketch
    const drawOnResize = drawOnFrame || drawOnInit

    if (autoResize && drawOnResize) {
      context.addAfterResize(() => drawOnResize)
    }
    context.startResizeObserve()

    const start = () => {
      drawOnInit && drawOnInit()

      if (drawOnFrame) {
        this.loopClock = new Clock()
        this.loopClock.on("tick", drawOnFrame)
      }
    }

    if (preload) {
      Promise.all(preload).then(start)
    } else {
      start()
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
