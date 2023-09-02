import { keys } from "../object"

type DataInfo = {
  initial: number[]
}

type GenerateArgs = {
  count: number
}

type Generator<K extends string> = () => Record<K, number[] | number>

export class InterleavedInitialData<K extends string> {
  private _dataMap: Map<K, DataInfo | null>
  private _initFn: Generator<K>

  constructor(initFn: Generator<K>) {
    this._dataMap = new Map()
    this._initFn = initFn
  }

  generate({ count }: GenerateArgs) {
    const array: number[] = []

    for (let i = 0; i < count; ++i) {
      const data = this._initFn()
      keys(data).forEach((key) => {
        const _value: number | number[] = data[key]
        const value = Array.isArray(_value) ? _value : [_value]
        this._dataMap.set(key, { initial: value })
        array.push(...value)
      })
    }

    return array
  }

  get keys() {
    return [...this._dataMap.keys()]
  }
}
