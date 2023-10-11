import { Matrix4 } from "$/math/matrix"
import { toRad } from "$/math/radian"
import { Vector3 } from "$/math/vector"
import { AngleCamera } from "./base"

export class TrackCamera extends AngleCamera {
  dolly(stepIncrement: number) {
    const normal = this._normal.normalize()
    const step = stepIncrement - this._steps

    const x = this._position.x - step * normal.x
    const y = this._position.y - step * normal.y
    const z = this._position.z - step * normal.z
    this.position = [x, y, z]

    this._steps = stepIncrement
    this.update()
  }

  update() {
    this._matrix = Matrix4.identity()
      .translate(...this._position.rawValues)
      .rotateY(toRad(this._azimuth))
      .rotateX(toRad(this._elevation))

    this._position = new Vector3(0, 0, 0).translateByMat4(this._matrix, 1)

    this.updateOrientation()
  }
}
