import { SketchBase } from "./core"
import { Sketch, SketchCanvas, SketchConfig, SketchFn } from "./type"

export abstract class SketchProxyBase<
  I extends SketchBase,
  C extends SketchCanvas = SketchCanvas,
  S extends Sketch = Sketch
> {
  protected _real: I | null = null
  protected _config: SketchConfig | null = null
  protected _sketch: SketchFn<C, S>

  constructor(sketch: SketchFn<C, S>) {
    this._sketch = sketch
  }

  bindCanvas(config: SketchConfig) {
    this._config = config
  }

  abstract start(...args: any): Promise<void>

  screenshot = () => {
    const real = this._realize()
    real.screenshot()
  }

  abstract _instantiation(config: SketchConfig): I

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
