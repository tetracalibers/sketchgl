import { keys } from "../utility/object"
import { TextureBase } from "./base"

type CubeSurface = "top" | "bottom" | "left" | "right" | "front" | "back"

type CubeSurfaceImages = Record<CubeSurface, HTMLImageElement>

export class ImagesCubeTexture extends TextureBase {
  private _images: CubeSurfaceImages
  private _texCubeMap: WebGLTexture | null = null

  constructor(gl: WebGL2RenderingContext, srcRecord: Record<CubeSurface, string>) {
    super(gl)

    this._params = {
      TEXTURE_MAG_FILTER: "LINEAR",
      TEXTURE_MIN_FILTER: "LINEAR",
      TEXTURE_WRAP_S: "CLAMP_TO_EDGE",
      TEXTURE_WRAP_T: "CLAMP_TO_EDGE"
    }

    this._images = keys(srcRecord).reduce<CubeSurfaceImages>(
      (acc, name) => {
        const img = new Image()
        img.src = srcRecord[name]
        return { ...acc, [name]: img }
      },
      <CubeSurfaceImages>{}
    )
  }

  async load() {
    const images = this._images

    const promises = keys(images).map((name) => {
      return new Promise((resolve) => {
        images[name].onload = () => {
          return resolve(this._texCubeMap)
        }
      })
    })

    return Promise.all(promises).then(() => {
      this.generateCubeMap()
      return this._texCubeMap
    })
  }

  private generateCubeMap() {
    const gl = this._gl

    // テクスチャオブジェクトの生成
    const texture = gl.createTexture()
    // テクスチャをキューブマップとしてバインドする
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture)

    // テクスチャへイメージを適用
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._images.right)
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._images.left)
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._images.top)
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._images.bottom)
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._images.front)
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._images.back)

    // ミップマップを生成
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP)

    // テクスチャパラメータの設定
    keys(this._params).forEach((key) => {
      const value = this._params[key]
      value && gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl[key], gl[value])
    })

    this._texCubeMap = texture

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
  }

  activate(program: WebGLProgram | null, name: string, unit = 0) {
    const gl = this._gl
    if (!program) return

    const location = gl.getUniformLocation(program, name)
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._texCubeMap)
    gl.uniform1i(location, unit)
  }
}
