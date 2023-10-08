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
  drawOnFrame?: () => void
  drawOnInit?: () => void
  preloads?: Promise<unknown>[]
  preloaded?: (...args: any[]) => void
  resizes?: (() => void)[]
}

export type SketchFn<C extends SketchCanvas = SketchCanvas, S extends Sketch = Sketch> = (skCanvas: C) => S
