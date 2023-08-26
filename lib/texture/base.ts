type MIN_FILTER =
  | "NEAREST"
  | "LINEAR"
  | "NEAREST_MIPMAP_NEAREST"
  | "NEAREST_MIPMAP_LINEAR"
  | "LINEAR_MIPMAP_NEAREST"
  | "LINEAR_MIPMAP_LINEAR"
type MAG_FILTER = "NEAREST" | "LINEAR"
type WRAP = "REPEAT" | "CLAMP_TO_EDGE" | "MIRRORED_REPEAT"

export abstract class TextureBase {
  protected _gl: WebGL2RenderingContext
  protected _params: {
    TEXTURE_MAG_FILTER?: MAG_FILTER
    TEXTURE_MIN_FILTER?: MIN_FILTER
    TEXTURE_WRAP_S?: WRAP
    TEXTURE_WRAP_T?: WRAP
  } = {}

  constructor(gl: WebGL2RenderingContext) {
    this._gl = gl
  }

  abstract load(): Promise<WebGLTexture | null>

  abstract activate(program: WebGLProgram | null, name: string, unit?: number): void

  set MAG_FILTER(value: MAG_FILTER) {
    this._params.TEXTURE_MAG_FILTER = value
  }

  set MIN_FILTER(value: MIN_FILTER) {
    this._params.TEXTURE_MIN_FILTER = value
  }

  set WRAP_S(value: WRAP) {
    this._params.TEXTURE_WRAP_S = value
  }

  set WRAP_T(value: WRAP) {
    this._params.TEXTURE_WRAP_T = value
  }
}
