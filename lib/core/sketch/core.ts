import { Clock } from "$/core/clock"
import { Context } from "$/core/context"
import { Sketch, SketchCanvas, SketchConfig, SketchFn } from "./type"

export abstract class SketchBase<
  CANVAS extends SketchCanvas = SketchCanvas,
  CONFIG extends SketchConfig = SketchConfig,
  SKETCH extends Sketch = Sketch
> {
  protected _loopClock?: Clock
  protected _context: Context
  protected _beforeCapture?: () => void
  protected _firstDraw: () => Promise<void>
  protected _preloaded: SKETCH["preloaded"]

  constructor(config: CONFIG, sketchFn: SketchFn<CANVAS, SKETCH>) {
    const { canvas: _canvas, gl: glOptions } = config
    const { el, ...canvasOptions } = _canvas

    const context = new Context(el, {
      canvas: canvasOptions,
      gl: glOptions
    })
    this._context = context

    const sketch = sketchFn(this._pluckSketchFnArgs(context, config))

    if (canvasOptions.autoResize) {
      this._setupResize(sketch)
    }

    this._firstDraw = this._buildFirstDrawFn(sketch)
    this._beforeCapture = sketch.drawOnFrame
    this._preloaded = sketch.preloaded
  }

  abstract _pluckSketchFnArgs(context: Context, config: CONFIG): CANVAS

  protected _setupResize({ drawOnFrame, drawOnInit, resizes }: Sketch) {
    const context = this._context
    const { gl, canvas } = context

    const drawOnResize = () => {
      if (drawOnFrame) {
        const { width, height } = canvas
        gl.viewport(0, 0, width, height)
      } else {
        drawOnInit && drawOnInit()
      }
    }

    if (drawOnResize) {
      resizes && context.addAfterResize(...resizes)
      context.addAfterResize(() => drawOnResize())
    }
  }

  protected _buildFirstDrawFn({ drawOnInit, drawOnFrame, preloads, preloaded }: Sketch) {
    const firstDrawFn = () => {
      preloaded && preloaded()
      drawOnInit && drawOnInit()

      if (drawOnFrame) {
        this._loopClock = new Clock()
        this._loopClock.on("tick", drawOnFrame)
      }
    }

    return async () => {
      if (preloads) {
        await Promise.all(preloads).then(firstDrawFn)
      } else {
        firstDrawFn()
      }
    }
  }

  start = async () => {
    await this._firstDraw()
  }

  screenshot = (filename?: string) => {
    const { canvas } = this._context

    const saveBlob = (() => {
      const $a = document.createElement("a")
      document.body.appendChild($a)
      $a.style.display = "none"
      return function saveData(blob: Blob, fileName: string) {
        const url = URL.createObjectURL(blob)
        $a.href = url
        $a.download = fileName
        $a.click()
        URL.revokeObjectURL(url)
      }
    })()

    this._beforeCapture && this._beforeCapture()

    canvas.toBlob((blob) => {
      if (!blob) return
      const name = filename || new Date().toISOString() + ".png"
      saveBlob(blob, name)
    })
  }
}
