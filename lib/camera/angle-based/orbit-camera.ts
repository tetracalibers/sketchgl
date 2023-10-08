import { Matrix4 } from "$/math/matrix"
import { toRad } from "$/math/radian"
import { AngleCamera } from "./base"

export class OrbitCamera extends AngleCamera {
  dolly(stepIncrement: number) {
    const step = stepIncrement - this._steps

    const x = this._position.x
    const y = this._position.y
    const z = this._position.z - step
    this.position = [x, y, z]

    this._steps = stepIncrement
    this.update()
  }

  update() {
    this._matrix = Matrix4.identity()
      .rotateY(toRad(this._azimuth))
      .rotateX(toRad(this._elevation))
      .translate(...this._position.rawValues)

    this.updateOrientation()
  }
}
