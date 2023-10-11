import { CanvasOptions } from "$/core/context"

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
  drawOnFrame?: (...args: any[]) => void
  drawOnInit?: (...args: any[]) => void
  preloads?: Promise<unknown>[]
  preloaded?: (...args: any[]) => void
  resizes?: (() => void)[]
}

export type SketchFn<CANVAS extends SketchCanvas = SketchCanvas, SKETCH extends Sketch = Sketch> = (
  skCanvas: CANVAS
) => SKETCH
