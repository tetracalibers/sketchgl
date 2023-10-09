import { SketchImage, type SketchImageConfig, type SketchImageFn } from "sketchgl"
import { Program } from "sketchgl/program"
import { CanvasCoverPolygon } from "sketchgl/geometry"

import mainVertSrc from "./index.vert?raw"
import mainFragSrc from "./index.frag?raw"

import image from "@/assets/examples/original/pastel-tomixy.png"

const sketch: SketchImageFn = ({ gl }) => {
  const program = new Program(gl)
  program.attach(mainVertSrc, mainFragSrc)
  program.activate()

  const plane = new CanvasCoverPolygon(gl)
  plane.setLocations({ vertices: 0, uv: 1 })

  gl.clearColor(1.0, 0.0, 0.0, 1.0)
  gl.clearDepth(1.0)

  return {
    preloaded: (texture) => {
      texture.activate(program.glProgram, "uTexture0")
    },

    drawOnFrame() {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      plane.bind()
      plane.draw({ primitive: "TRIANGLES" })
    }
  }
}

const config: SketchImageConfig = {
  canvas: {
    el: "gl-canvas",
    autoResize: true
  }
}

const sketcher = new SketchImage(sketch)

window.onload = () => {
  sketcher.bindCanvas(config)
  sketcher.start(image.src)
}
