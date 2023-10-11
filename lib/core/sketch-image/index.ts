import { ImageTexture } from "$/texture/image-texture"
import { Context } from "../context"
import { SketchBase } from "../sketch/core"
import { SketchProxyBase } from "../sketch/proxy"
import { Sketch, SketchCanvas, SketchConfig, SketchFn } from "../sketch/type"

export interface SketchImageConfig extends SketchConfig {
  images: string[]
}

export interface SketchImageCanvas extends SketchCanvas {
  fitImage: (img: HTMLImageElement) => void
  textures: ImageTexture[]
}

export type SketchImageFn = SketchFn<SketchImageCanvas, Sketch>

const buildTexture = (gl: WebGL2RenderingContext, img: string) => {
  const texture = new ImageTexture(gl, img)
  // 画像サイズに関わらず、texelSizeを一定にしたい
  texture.MIN_FILTER = "LINEAR_MIPMAP_NEAREST"
  return texture
}

class SketchImageCore extends SketchBase<SketchImageCanvas, SketchImageConfig> {
  constructor(config: SketchImageConfig, sketchFn: SketchImageFn) {
    const reSketchFn = (skCanvas: SketchImageCanvas) => {
      const { textures } = skCanvas

      const sketch = sketchFn(skCanvas)
      const { preloads = [] } = sketch

      return {
        ...sketch,
        preloads: [...textures.map((tex) => tex.load()), ...preloads]
      }
    }

    super(config, reSketchFn)
  }

  _pluckSketchFnArgs(context: Context, config: SketchImageConfig) {
    const { canvas, gl } = context

    const fitImage = context.setFitImage

    const { images } = config
    const textures = images.map((img) => buildTexture(gl, img))

    return { canvas, gl, fitImage, textures }
  }

  private _setNewImage = async (img: string) => {
    const context = this._context
    const { gl } = context
    const texture = buildTexture(gl, img)
    await texture.load()
    context.setFitImage(texture.img)

    return texture
  }

  changeImage = async (img: File, cb?: (src: string) => void) => {
    const src = URL.createObjectURL(img)
    const texture = await this._setNewImage(src)
    this._preloaded && this._preloaded()
    cb && cb(src)
    URL.revokeObjectURL(src)
  }
}

export class SketchImage extends SketchProxyBase<SketchImageCore, SketchImageCanvas, SketchImageConfig> {
  /** @internal */
  _instantiation(config: SketchImageConfig) {
    return new SketchImageCore(config, this._sketch)
  }

  start = async () => {
    const real = this._realize()
    await real.start()
  }

  /** @alpha */
  changeImage = (file: File) => {
    const real = this._realize()
    real.changeImage(file)
  }
}
