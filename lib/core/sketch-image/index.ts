import { ImageTexture } from "$/texture/image-texture"
import { Context } from "../context"
import { SketchBase } from "../sketch/core"
import { SketchProxyBase } from "../sketch/proxy"
import { Sketch, SketchCanvas, SketchConfig } from "../sketch/type"

export interface SketchImageConfig extends SketchConfig {}

export interface SketchImageCanvas extends SketchCanvas {
  fitImage: (img: HTMLImageElement) => void
}

class SketchImageCore extends SketchBase<SketchImageCanvas, SketchImageConfig> {
  private _preloaded?: (texture: ImageTexture) => void

  _pluckSketchFnArgs(context: Context) {
    const { canvas, gl, setFitImage: fitImage } = context
    return { canvas, gl, fitImage }
  }

  _setup(sketch: Sketch) {
    const { preloaded } = sketch
    this._preloaded = preloaded
  }

  private async _setNewImage(img: string) {
    const context = this._context
    const { gl } = context
    const texture = new ImageTexture(gl, img)
    // 画像サイズに関わらず、texelSizeを一定にしたい
    texture.MIN_FILTER = "LINEAR_MIPMAP_NEAREST"
    await texture.load()
    context.setFitImage(texture.img)

    return texture
  }

  async _beforeStart(img: string) {
    await this._setNewImage(img)
  }

  changeImage = async (img: File, cb?: (src: string) => void) => {
    const src = URL.createObjectURL(img)
    const texture = await this._setNewImage(src)
    this._preloaded && this._preloaded(texture)
    cb && cb(src)
    URL.revokeObjectURL(src)
  }
}

export class SketchImage extends SketchProxyBase<SketchImageCore, SketchImageCanvas, SketchImageConfig> {
  _instantiation(config: SketchConfig) {
    return new SketchImageCore(config, this._sketch)
  }

  async start(img: string) {
    const real = this._realize()
    await real.start(img)
  }

  changeImage = (file: File) => {
    const real = this._realize()
    real.changeImage(file)
  }
}
