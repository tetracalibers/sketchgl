import { ImageCanvas } from "../../texture/image-canvas"

type Dimension = 2 | 3 | 4

type GeneratorOption = {
  position: {
    x: number
    y: number
  }
  color: {
    r: number
    g: number
    b: number
    a: number
  }
}

type Generator = (args: GeneratorOption) => number[]

type GeneratorMap<K extends string> = Map<
  K,
  {
    dimension: Dimension
    generator: Generator
  } | null
>

export class ImageInterleavedData<K extends string> {
  private _imgCvs: ImageCanvas
  private _generators: GeneratorMap<K>
  // 画像データの色は必ず持たせるので、最低でも4
  private _totalDimensions = 0

  constructor(imgCvs: ImageCanvas, keys: K[]) {
    this._imgCvs = imgCvs
    this._generators = new Map(keys.map((key) => [key, null]))
  }

  useImageColorAs(name: K) {
    this.add(name, 4, ({ color }) => [color.r, color.g, color.b, color.a])
  }

  add(name: K, dimension: Dimension, generator: Generator) {
    this._totalDimensions += dimension
    this._generators.set(name, { dimension, generator })
  }

  generate() {
    const { width, height, data } = this._imgCvs
    if (!data) return []

    const array: number[] = []

    for (let i = 0; i < height; ++i) {
      const y = (i / height) * 2.0 - 1.0
      for (let j = 0; j < width; ++j) {
        const x = (j / width) * 2.0 - 1.0

        const rowLength = i * width + j
        const thisRow = rowLength * this._totalDimensions
        const thisImageRow = rowLength * 4

        const r = data[thisImageRow + 0] / 255
        const g = data[thisImageRow + 1] / 255
        const b = data[thisImageRow + 2] / 255
        const a = data[thisImageRow + 3] / 255

        const args = {
          position: { x, y },
          color: { r, g, b, a }
        }

        let index = 0
        this._generators.forEach((value) => {
          if (!value) return
          const { dimension, generator } = value
          const offset = index + 4
          const result = generator(args)
          for (let k = 0; k < dimension; ++k) {
            array[thisRow + offset + k] = result[k]
          }
          index++
        })
      }
    }

    return array
  }

  get keys() {
    return [...this._generators.keys()]
  }
}
