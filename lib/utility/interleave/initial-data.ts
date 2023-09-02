type DataInfo = {
  initial: ((i: number) => number[]) | number[]
}

type GenerateArgs = {
  count: number
}

export class InterleavedInitialData<K extends string> {
  private _dataMap: Map<K, DataInfo | null>

  constructor(keys: K[]) {
    this._dataMap = new Map(keys.map((key) => [key, null]))
  }

  add(name: K, { initial }: DataInfo) {
    this._dataMap.set(name, { initial })
  }

  generate({ count }: GenerateArgs) {
    const array: number[] = []

    for (let i = 0; i < count; ++i) {
      this._dataMap.forEach((value) => {
        if (!value) return
        const { initial } = value

        if (typeof initial === "function") {
          array.push(...initial(i))
        } else {
          array.push(...initial)
        }
      })
    }

    return array
  }

  get keys() {
    return [...this._dataMap.keys()]
  }
}
