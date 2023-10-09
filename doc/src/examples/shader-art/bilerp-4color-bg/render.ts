import { SketchFrag, type SketchFragConfig, type SketchFragFn } from "sketchgl"
import { Uniforms } from "sketchgl/program"

import frag from "./index.frag?raw"

const sketch: SketchFragFn = ({ gl, canvas, program, renderToCanvas }) => {
  const uniforms = new Uniforms(gl, ["uResolution"])
  uniforms.init(program)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clearDepth(1.0)

  return {
    drawOnFrame() {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      uniforms.fvector2("uResolution", [canvas.width, canvas.height])

      renderToCanvas()
    }
  }
}

const config: SketchFragConfig = {
  frag,
  canvas: {
    el: "gl-canvas",
    fit: "square",
    autoResize: true
  }
}

const sketcher = new SketchFrag(sketch)

window.onload = () => {
  sketcher.bindCanvas(config)
  sketcher.start()
}
