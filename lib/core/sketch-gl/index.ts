import { Context } from "../context"
import { SketchBase } from "../sketch/core"
import { SketchProxyBase } from "../sketch/proxy"
import { SketchConfig } from "../sketch/type"

class SketchGLCore extends SketchBase {
  _pluckSketchFnArgs(context: Context) {
    return context
  }

  _setup() {}
  _beforeStart() {}
}

export class SketchGL extends SketchProxyBase<SketchGLCore> {
  /** @internal */
  _instantiation(config: SketchConfig) {
    return new SketchGLCore(config, this._sketch)
  }

  async start() {
    const real = this._realize()
    await real.start()
  }
}
