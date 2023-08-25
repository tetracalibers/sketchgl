export type ResizeCallback = () => void

export type CanvasOptions = {
  width?: number
  height?: number
  fitScreen?: boolean
  fitSquare?: boolean
  autoResize?: boolean
}

type ContextOptions = CanvasOptions

export class Context {
  private _canvas: HTMLCanvasElement
  private _gl: WebGL2RenderingContext
  private _resizeHandlers: ResizeCallback[] = []

  constructor(el: string | HTMLCanvasElement, options?: { canvas?: ContextOptions; gl?: WebGLContextAttributes }) {
    const canvas = typeof el === "string" ? <HTMLCanvasElement>document.getElementById(el) : el
    if (!canvas) throw new Error("Canvas not found")

    const gl = canvas.getContext("webgl2", options?.gl)
    if (!gl) throw new Error("WebGL2 is not available on your browser")

    this._canvas = canvas
    this._gl = gl

    options?.canvas && this.initCanvas(options.canvas)
  }

  private initCanvas(options: ContextOptions) {
    const { width, height, autoResize, fitScreen, fitSquare } = options
    if (width) this.canvas.width = width
    if (height) this.canvas.height = height

    if (fitSquare) {
      this.fitSquare()
      autoResize && this._resizeHandlers.push(this.fitSquare)
    }
    if (fitScreen) {
      this.fitScreen()
      autoResize && this._resizeHandlers.push(this.fitScreen)
    }
  }

  addAfterResize(...fn: ResizeCallback[]) {
    this._resizeHandlers.push(...fn)
  }

  addBeforeResize(...fn: ResizeCallback[]) {
    this._resizeHandlers.unshift(...fn)
  }

  setSize(width: number, height: number) {
    this._canvas.width = width
    this._canvas.height = height
  }

  setWidth(width: number) {
    this._canvas.width = width
  }

  setHeight(height: number) {
    this._canvas.height = height
  }

  fitSquare = () => {
    const size = Math.min(window.innerWidth, window.innerHeight)
    this.setSize(size, size)
  }

  fitScreen = () => {
    this.setSize(window.innerWidth, window.innerHeight)
  }

  startResizeObserve() {
    if (!this._resizeHandlers.length) return

    const resizeFn = this._resizeHandlers.reduce((prev, curr) => () => {
      prev()
      curr()
    })

    const obserber = new ResizeObserver(resizeFn)
    obserber.observe(document.body)
  }

  get canvas() {
    return this._canvas
  }

  get gl() {
    return this._gl
  }
}
