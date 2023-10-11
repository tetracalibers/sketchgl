import { SketchBase } from "./core"
import { Sketch, SketchCanvas, SketchConfig, SketchFn } from "./type"

export abstract class SketchProxyBase<
  INSTANCE extends SketchBase,
  CANVAS extends SketchCanvas = SketchCanvas,
  CONFIG extends SketchConfig = SketchConfig,
  SKETCH extends Sketch = Sketch
> {
  protected _real: INSTANCE | null = null
  protected _config: CONFIG | null = null
  protected _sketch: SketchFn<CANVAS, SKETCH>

  constructor(sketch: SketchFn<CANVAS, SKETCH>) {
    this._sketch = sketch
  }

  bindCanvas(config: CONFIG) {
    this._config = config
  }

  abstract start(...args: any): Promise<void>

  screenshot = () => {
    const real = this._realize()
    real.screenshot()
  }

  abstract _instantiation(config: CONFIG): INSTANCE

  protected _realize() {
    if (!this._real) {
      if (!this._config) {
        throw new Error("[sketchgl] Canvas is not bound. Call bindCanvas() first.")
      }
      this._real = this._instantiation(this._config)
    }
    return this._real
  }
}
