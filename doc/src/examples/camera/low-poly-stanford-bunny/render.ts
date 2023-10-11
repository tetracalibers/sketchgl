import { SketchGL, type SketchFn, type SketchConfig } from "sketchgl"
import { Matrix4 } from "sketchgl/math"
import { Program, Uniforms } from "sketchgl/program"
import { Geometry } from "sketchgl/geometry"
import { OrbitCamera } from "sketchgl/camera"

import vert from "./index.vert?raw"
import frag from "./index.frag?raw"

// https://www.thingiverse.com/thing:466857
import rabbitModel from "./Bunny-LowPoly.json" assert { type: "json" }

const sketch: SketchFn = (skCanvas) => {
  const { gl, canvas } = skCanvas

  const uniforms = new Uniforms(gl, [
    "uMatView",
    "uMatModel",
    "uMatProj",
    "uMatNormal",
    "uLightDir",
    "uAmbient",
    "uMaterialColor"
  ])

  const program = new Program(gl)
  program.attach(vert, frag)
  program.activate()

  const rabbit = new Geometry(gl)
  rabbit.registAttrib("vertice", {
    location: 0,
    components: 3,
    buffer: new Float32Array(rabbitModel.vertices.map(Number))
  })
  rabbit.registAttrib("normal", {
    location: 1,
    components: 3,
    buffer: new Float32Array(rabbitModel.normals.map(Number))
  })
  rabbit.registIndices(new Uint16Array(rabbitModel.indices))
  rabbit.setup()

  const camera = new OrbitCamera()
  camera.goHome([30, 30, 300])
  camera.azimuth = 0
  camera.elevation = 60
  camera.focus = [0, 0, 0]
  camera.update()
  camera.watchUserControl(canvas)

  const matP = Matrix4.perspective(camera.fov, canvas.width / canvas.height, camera.near, camera.far)
  const matM = Matrix4.identity()

  uniforms.init(program.glProgram)
  uniforms.fmatrix4("uMatModel", matM.values)
  uniforms.fmatrix4("uMatProj", matP.values)
  uniforms.fmatrix4("uMatNormal", matM.inverse().values)
  uniforms.fvector3("uLightDir", [-0.5, 0.5, 200])
  uniforms.fvector3("uMaterialColor", [0.855, 0.792, 0.969])
  uniforms.fvector4("uAmbient", [0.2, 0.1, 0.2, 1.0])

  gl.clearColor(1.0, 1.0, 1.0, 1.0)
  gl.clearDepth(1.0)

  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)

  gl.enable(gl.CULL_FACE)

  return {
    drawOnFrame() {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      const matV = camera.View
      uniforms.fmatrix4("uMatView", matV.values)

      rabbit.bind()
      rabbit.draw()
    }
  }
}

const config: SketchConfig = {
  canvas: {
    el: "gl-canvas",
    fit: "square",
    autoResize: true
  }
}

const sketcher = new SketchGL(sketch)

window.onload = () => {
  sketcher.bindCanvas(config)
  sketcher.start()
}
