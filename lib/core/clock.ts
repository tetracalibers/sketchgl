import { EventEmitter } from "./event-emitter"

export class Clock extends EventEmitter {
  private _isRunning: boolean
  private _renderedEvent: CustomEvent

  constructor() {
    super()
    this._isRunning = true

    this.tick = this.tick.bind(this)
    this.tick()

    this._renderedEvent = new CustomEvent("glcanvasrendered", { bubbles: false })

    window.onblur = () => {
      this.stop()
      console.log("Clock is stopped")
    }

    window.onfocus = () => {
      this.start()
      console.log("Clock is started")
    }
  }

  tick() {
    if (this._isRunning) this.emit("tick")
    requestAnimationFrame(() => {
      this.tick()
      window.dispatchEvent(this._renderedEvent)
    })
  }

  start() {
    this._isRunning = true
  }

  stop() {
    this._isRunning = false
  }
}
