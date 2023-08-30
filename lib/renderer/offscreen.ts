import { FrameBufferRendererBase, Options } from "./base"

export class OffscreenRenderer extends FrameBufferRendererBase {
  private _texture: WebGLTexture | null = null

  constructor(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, vert: string, frag: string, options: Options) {
    super(gl, canvas, vert, frag, options)
    this.init()
    this.bindColorTexture()
  }

  protected resizeColorTexture(width: number, height: number): void {
    const gl = this._gl
    gl.bindTexture(gl.TEXTURE_2D, this._texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  }

  protected init() {
    const gl = this._gl

    this._frameBuffer = this.getInitialFramebuffer()

    this._texture = this.getInitialColorTexture()
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture, 0)

    this._renderBuffer = this.getInitialRenderBuffer()
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._renderBuffer)

    // Clean up
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  protected bindColorTexture() {
    const gl = this._gl
    // Bind the texture from the framebuffer
    gl.activeTexture(gl.TEXTURE0 + this._texUnitStart)
    gl.bindTexture(gl.TEXTURE_2D, this._texture)
  }

  useAsTexture(name: string, program: WebGLProgram | null) {
    if (!program) return

    const gl = this._gl
    const location = gl.getUniformLocation(program, name)

    gl.activeTexture(gl.TEXTURE0 + this._texUnitStart)
    gl.bindTexture(gl.TEXTURE_2D, this._texture)
    gl.uniform1i(location, this._texUnitStart)
  }
}
