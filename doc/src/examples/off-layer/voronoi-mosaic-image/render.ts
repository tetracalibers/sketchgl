import { SketchImage, type SketchImageConfig, type SketchImageFn } from "sketchgl"
import { Program, Uniforms } from "sketchgl/program"
import { CanvasCoverPolygon, InstancedGeometry } from "sketchgl/geometry"
import { Vector2 } from "sketchgl/math"
import { UseOffLayer } from "sketchgl/renderer"

import mainVertSrc from "./index.vert?raw"
import mainFragSrc from "./index.frag?raw"

import voronoiVertSrc from "./voronoi.vert?raw"
import voronoiFragSrc from "./voronoi.frag?raw"

import image from "@/assets/examples/original/fantasy-unicorn.jpg"

const count = 2000
const resolution = 64

const generateConeVertex = (canvas: HTMLCanvasElement) => {
  const w = canvas.width
  const h = canvas.height
  const a = new Vector2(w, h).normalize()

  let cone = [0, 0, -0.95]

  for (let i = 0; i < resolution; i++) {
    const v = (i / (resolution - 1)) * Math.PI * 2
    cone.push(Math.cos(v) * a.y * 2)
    cone.push(Math.sin(v) * a.x * 2)
    cone.push(1.0)
  }

  return cone
}

const generatePoints = (count: number) => {
  const points = []

  for (let i = 0; i < count; i++) {
    points.push(Math.random(), Math.random())
  }

  return points
}

const rebuildVoronoi = (cone: InstancedGeometry, canvas: HTMLCanvasElement) => {
  cone.registAttrib("vertice", {
    location: 0,
    components: 3,
    buffer: new Float32Array(generateConeVertex(canvas)),
    divisor: 0
  })
  cone.registAttrib("offset", {
    location: 1,
    components: 2,
    buffer: new Float32Array(generatePoints(count)),
    divisor: 1
  })
  cone.setup()
}

const sketch: SketchImageFn = ({ gl, canvas, fitImage }) => {
  const uniforms = new Uniforms(gl, ["uMixingRatio"])
  let uMixingRatio = 0.9

  const cone = new InstancedGeometry(gl)
  const plane = new CanvasCoverPolygon(gl)
  plane.setLocations({ vertices: 0, uv: 1 })

  const layer = new UseOffLayer(gl, canvas, voronoiVertSrc, voronoiFragSrc, { texUnitStart: 1 })

  const program = new Program(gl)
  program.attach(mainVertSrc, mainFragSrc)

  uniforms.init(program.glProgram)

  gl.clearColor(1.0, 0.0, 0.0, 1.0)
  gl.clearDepth(1.0)

  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  return {
    resizes: [layer.resize, () => rebuildVoronoi(cone, canvas)],

    preloaded: ([texture]) => {
      fitImage(texture.img)
      rebuildVoronoi(cone, canvas)
    },

    drawOnFrame([texture]) {
      layer.switchToOffLayer()
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      cone.bind()
      cone.draw({ primitive: "TRIANGLE_FAN", instanceCount: count })

      layer.switchToCanvas(program)
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      plane.bind()
      uniforms.float("uMixingRatio", uMixingRatio)
      texture.activate(program.glProgram, "uOriginal")
      layer.useTexture(program, { name: "uVoronoi" })
      plane.draw({ primitive: "TRIANGLES" })
    },

    control(ui) {
      ui.number("ボロノイの透明度", uMixingRatio, 0.0, 1.0, 0.01, (v) => {
        uMixingRatio = v
      })
    }
  }
}

const config: SketchImageConfig = {
  canvas: {
    el: "gl-canvas",
    autoResize: true
  },
  images: [image.src]
}

const sketcher = new SketchImage(sketch)

window.onload = () => {
  sketcher.bindCanvas(config)
  sketcher.start()
}
