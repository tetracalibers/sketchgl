import { ShaderCompiler } from "./shader-compiler"

export class Program {
  private _gl: WebGL2RenderingContext
  private _program: WebGLProgram | null = null

  constructor(gl: WebGL2RenderingContext) {
    this._gl = gl
  }

  attach(vsrc: string, fsrc: string, varyings?: string[]) {
    const gl = this._gl

    const glprogram = gl.createProgram()

    if (!glprogram) {
      console.error("Could not create program")
      return
    }

    const compiler = new ShaderCompiler(gl)
    const vs = compiler.compileVertexShader(vsrc)
    const fs = compiler.compileFragmentShader(fsrc)
    if (!vs || !fs) return null

    // プログラムオブジェクトにシェーダを割り当てる
    gl.attachShader(glprogram, vs)
    gl.attachShader(glprogram, fs)

    // リンクする前に実行
    if (varyings && varyings.length > 0) {
      // TransformFeedbackを使用すると、頂点シェーダーが出力する変数の値をキャプチャできる
      // ただし、プログラムをリンクする前に、キャプチャする変数を指定する必要がある
      gl.transformFeedbackVaryings(glprogram, varyings, gl.INTERLEAVED_ATTRIBS)
    }

    // シェーダをリンク
    gl.linkProgram(glprogram)

    // シェーダのリンクが正しく行なわれたかチェック
    if (!gl.getProgramParameter(glprogram, gl.LINK_STATUS)) {
      // 失敗していたら通知
      const error = gl.getProgramInfoLog(glprogram)
      console.error("Could not link program.", error)
      return null
    }

    this._program = glprogram
  }

  activate() {
    const gl = this._gl
    gl.useProgram(this._program)
  }

  get glProgram() {
    return this._program
  }
}
