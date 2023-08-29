import { keys } from "../utility/object"
import { TextureBase } from "./base"

export class ImageTexture extends TextureBase {
  private _image: HTMLImageElement
  private _texture: WebGLTexture | null = null

  constructor(gl: WebGL2RenderingContext, src: string) {
    super(gl)
    this._image = new Image()
    this._image.src = src
  }

  private makeTexture() {
    const gl = this._gl
    this._texture = gl.createTexture()
    // テクスチャをバインドする
    gl.bindTexture(gl.TEXTURE_2D, this._texture)
    // テクスチャ転送時のY座標設定を反転しておく
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    // テクスチャへイメージを適用
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image)
    // ミップマップを生成
    gl.generateMipmap(gl.TEXTURE_2D)
    // テクスチャパラメータの設定
    keys(this._params).forEach((key) => {
      const value = this._params[key]
      value && gl.texParameteri(gl.TEXTURE_2D, gl[key], gl[value])
    })
    // テクスチャのバインドを無効化
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  load() {
    return new Promise<WebGLTexture | null>((resolve, reject) => {
      this._image.onload = () => {
        this.makeTexture()
        resolve(this._texture)
      }
      this._image.onerror = () => {
        reject()
      }
    })
  }

  activate(program: WebGLProgram, name: string, unit = 0) {
    const gl = this._gl
    const location = gl.getUniformLocation(program, name)
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, this._texture)
    gl.uniform1i(location, unit)
  }

  get img() {
    return this._image
  }
}
