import { Context } from "../context"
import { Sketch, SketchCanvas, SketchConfig, SketchGl } from "../sketch-gl"

export interface FilterSketchConfig extends SketchConfig {}

export interface FilterSketchCanvas extends SketchCanvas {
  fitImage: (img: HTMLImageElement) => void
}

export interface FilterSketch extends Sketch {}

export type FilterSketchFn = (skCanvas: FilterSketchCanvas) => Sketch

export class SketchFilter extends SketchGl {
  protected constructor(skCanvas: FilterSketchConfig, sketchFn: FilterSketchFn) {
    const { canvas: _canvas, gl: glOptions } = skCanvas
    const { el, ...canvasOptions } = _canvas

    const context = new Context(el, {
      canvas: canvasOptions,
      gl: glOptions
    })
    const { canvas, gl, setFitImage: fitImage } = context

    const sketch = sketchFn({ canvas, gl, fitImage })

    super(context, sketch, canvasOptions)
  }

  static init(skCanvas: FilterSketchConfig, sketchFn: FilterSketchFn) {
    new SketchFilter(skCanvas, sketchFn)
  }
}
