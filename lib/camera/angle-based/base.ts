import { Matrix4 } from "$/math/matrix"
import { toRad } from "$/math/radian"
import { RawVector3, Vector3 } from "$/math/vector"
import { AngleCameraController } from "./controller"

export abstract class AngleCamera {
  protected _position: Vector3 = new Vector3(0, 0, 0)
  protected _focusTo: Vector3 = new Vector3(0, 0, 0)
  protected _home: Vector3 = new Vector3(0, 0, 0)

  protected _up: Vector3 = new Vector3(0, 0, 0)
  protected _right: Vector3 = new Vector3(0, 0, 0)
  protected _normal: Vector3 = new Vector3(0, 0, 0)

  protected _matrix: Matrix4 = Matrix4.identity()

  protected _steps: number = 0
  protected _azimuth: number = 0
  protected _elevation: number = 0
  protected _fov: number = 45
  protected _near: number = 0.1
  protected _far: number = 10000

  goHome(home?: RawVector3) {
    if (home) this._home = new Vector3(...home)
    this.positionV = this._home
    this.azimuth = 0
    this.elevation = 0
    this.update()
  }

  abstract dolly(stepIncrement: number): void

  abstract update(): void

  watchUserControl(canvas: HTMLCanvasElement) {
    new AngleCameraController(canvas, this)
  }

  get position() {
    return this._position.rawValues
  }

  get fov() {
    return toRad(this._fov)
  }

  get near() {
    return this._near
  }

  get far() {
    return this._far
  }

  get viewTransform() {
    return this._matrix.inverse()
  }

  get View() {
    return this._matrix.inverse()
  }

  set home([x, y, z]: RawVector3) {
    this._home = new Vector3(x, y, z)
  }

  set homeV(vec: Vector3) {
    this._home = vec
  }

  set position([x, y, z]: RawVector3) {
    this._position = new Vector3(x, y, z)
  }

  set positionV(vec: Vector3) {
    this._position = vec
  }

  set focus([x, y, z]: RawVector3) {
    this._focusTo = new Vector3(x, y, z)
  }

  set focusV(vec: Vector3) {
    this._focusTo = vec
  }

  set azimuth(azimuth: number) {
    this.addAzimuth(azimuth - this._azimuth)
  }

  set elevation(elevation: number) {
    this.addElevation(elevation - this._elevation)
  }

  set fov(angle: number) {
    this._fov = angle
  }

  set near(val: number) {
    this._near = val
  }

  set far(val: number) {
    this._far = val
  }

  addAzimuth(azimuth: number) {
    this._azimuth += azimuth

    if (this._azimuth > 360 || this._azimuth < -360) {
      this._azimuth = this._azimuth % 360
    }
  }

  addElevation(elevation: number) {
    this._elevation += elevation

    if (this._elevation > 360 || this._elevation < -360) {
      this._elevation = this._elevation % 360
    }
  }

  protected updateOrientation() {
    this._right = new Vector3(1, 0, 0).translateByMat4(this._matrix)
    this._up = new Vector3(0, 1, 0).translateByMat4(this._matrix)
    this._normal = new Vector3(0, 0, 1).translateByMat4(this._matrix)
  }
}
