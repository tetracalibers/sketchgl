import { Program } from "../program"

export interface Options {
  texUnitStart?: number
}

export abstract class FrameBufferRendererBase {
  protected _gl: WebGL2RenderingContext
  protected _canvas: HTMLCanvasElement
  protected _renderBuffer: WebGLRenderbuffer | null = null
  protected _frameBuffer: WebGLFramebuffer | null = null
  protected _program: Program
  protected _texUnitStart: number

  constructor(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, vert: string, frag: string, options: Options) {
    this._gl = gl
    this._canvas = canvas
    this._texUnitStart = options.texUnitStart ?? 0

    this._program = new Program(gl)
    this._program.attach(vert, frag)
  }

  protected abstract resizeColorTexture(width: number, height: number): void

  resize = () => {
    const gl = this._gl
    const { width, height } = this._canvas

    // 1. Resize Color Texture
    this.resizeColorTexture(width, height)

    // 2. Resize Render Buffer
    gl.bindRenderbuffer(gl.RENDERBUFFER, this._renderBuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)

    // 3. Clean up
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
  }

  protected getInitialColorTexture() {
    const gl = this._gl
    const { width, height } = this._canvas

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)

    return texture
  }

  protected getInitialRenderBuffer() {
    const gl = this._gl
    const { width, height } = this._canvas

    const renderBuffer = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)

    return renderBuffer
  }

  protected getInitialFramebuffer() {
    const gl = this._gl

    const frameBuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)

    return frameBuffer
  }

  protected abstract init(): void

  protected abstract bindColorTexture(): void

  switchToOffcanvas() {
    const gl = this._gl
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer)
    this._program.activate()
  }

  switchToCanvas(program: Program) {
    const gl = this._gl
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    program.activate()
  }

  get glProgramForOffscreen() {
    return this._program.glProgram
  }
}
