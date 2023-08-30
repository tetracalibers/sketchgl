import { FrameBufferRendererBase, Options } from "./base"

interface MRTRendererOptions extends Options {
  texCount: number
}

export class MRTRenderer extends FrameBufferRendererBase {
  private _textures: (WebGLTexture | null)[] = []
  private _texCount: number

  constructor(
    gl: WebGL2RenderingContext,
    canvas: HTMLCanvasElement,
    vert: string,
    frag: string,
    options: MRTRendererOptions
  ) {
    super(gl, canvas, vert, frag, options)
    this._texCount = options.texCount
  }

  protected resizeColorTexture(width: number, height: number): void {
    const gl = this._gl
    for (let i = 0; i < this._texCount; i++) {
      gl.bindTexture(gl.TEXTURE_2D, this._textures[i])
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    }
  }

  protected init() {
    const gl = this._gl

    this._frameBuffer = this.getInitialFramebuffer()

    for (let i = 0; i < this._texCount; i++) {
      this._textures[i] = this.getInitialColorTexture()
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, this._textures[i], 0)
    }

    this._renderBuffer = this.getInitialRenderBuffer()
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._renderBuffer)

    const bufferList = this._textures.map((_, i) => gl.COLOR_ATTACHMENT0 + i)
    gl.drawBuffers(bufferList)

    // Clean up
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  protected bindColorTexture() {
    const gl = this._gl
    // Bind the texture from the framebuffer
    for (let i = 0; i < this._texCount; i++) {
      gl.activeTexture(gl.TEXTURE0 + this._texUnitStart + i)
      gl.bindTexture(gl.TEXTURE_2D, this._textures[i])
    }
  }

  useAsTexture(idx: number, name: string, program: WebGLProgram | null) {
    if (!program) return

    const gl = this._gl
    const location = gl.getUniformLocation(program, name)

    gl.activeTexture(gl.TEXTURE0 + this._texUnitStart + idx)
    gl.bindTexture(gl.TEXTURE_2D, this._textures[idx])
    gl.uniform1i(location, this._texUnitStart + idx)
  }
}
