import { Program } from "$/program/program"

interface Options {
  texUnitStart?: number
  depth?: boolean
}

export class UseOffLayer {
  private _gl: WebGL2RenderingContext
  private _canvas: HTMLCanvasElement
  private _enableDepth: boolean
  private _texUnitStart: number
  private _program: Program
  private _renderbuffer: WebGLRenderbuffer | null = null
  private _framebuffer: WebGLFramebuffer | null = null
  private _texture: WebGLTexture | null = null

  constructor(
    gl: WebGL2RenderingContext,
    canvas: HTMLCanvasElement,
    vert: string,
    frag: string,
    { depth = true, texUnitStart = 0 }: Options = {}
  ) {
    this._gl = gl
    this._canvas = canvas
    this._enableDepth = depth
    this._texUnitStart = texUnitStart

    this._program = new Program(gl)
    this._program.attach(vert, frag)

    this.init()
    this.bindColorTexture()
  }

  private init() {
    const gl = this._gl

    this._framebuffer = this.getInitialFramebuffer()

    this._texture = this.getInitialColorTexture()
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture, 0)
    gl.bindTexture(gl.TEXTURE_2D, null)

    if (this._enableDepth) {
      this._renderbuffer = this.getInitialRenderbuffer()
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._renderbuffer)
      gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  private bindColorTexture() {
    const gl = this._gl

    gl.activeTexture(gl.TEXTURE0 + this._texUnitStart)
    gl.bindTexture(gl.TEXTURE_2D, this._texture)
  }

  private getInitialFramebuffer() {
    const gl = this._gl

    const frameBuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)

    return frameBuffer
  }

  private getInitialRenderbuffer() {
    const gl = this._gl
    const { width, height } = this._canvas

    const renderBuffer = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)

    return renderBuffer
  }

  private getInitialColorTexture() {
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

  resize = (_width?: number, _height?: number) => {
    const width = _width ?? this._canvas.width
    const height = _height ?? this._canvas.height

    this.resizeColorTexture(width, height)
    if (this._enableDepth) {
      this.resizeRenderbuffer(width, height)
    }
  }

  private resizeColorTexture(width: number, height: number): void {
    const gl = this._gl

    gl.bindTexture(gl.TEXTURE_2D, this._texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)

    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  private resizeRenderbuffer(width: number, height: number) {
    const gl = this._gl

    gl.bindRenderbuffer(gl.RENDERBUFFER, this._renderbuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)

    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
  }

  useTexture(program: Program, { name }: { name: string }) {
    const { glProgram } = program
    if (!glProgram) throw new Error("glProgram is null")

    const gl = this._gl
    const location = gl.getUniformLocation(glProgram, name)

    gl.activeTexture(gl.TEXTURE0 + this._texUnitStart)
    gl.bindTexture(gl.TEXTURE_2D, this._texture)
    gl.uniform1i(location, this._texUnitStart)
  }

  switchToOffLayer() {
    const gl = this._gl
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer)
    this._program.activate()
  }

  switchToNextLayer(program: Program, out: WebGLFramebuffer | null) {
    const gl = this._gl
    gl.bindFramebuffer(gl.FRAMEBUFFER, out)
    program.activate()
  }

  switchToCanvas(program: Program) {
    const gl = this._gl
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    program.activate()
  }

  get framebuffer() {
    return this._framebuffer
  }

  get glProgramForOffLayer() {
    return this._program.glProgram
  }
}
