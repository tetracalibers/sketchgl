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

type GeneratorInfo = {
  components: Dimension
  generate: Generator
}

type GeneratorMap<K extends string> = Map<K, GeneratorInfo | null>

export class ImageInterleavedData<K extends string> {
  private _imgCvs: ImageCanvas
  private _generators: GeneratorMap<K>
  private _totalDimensions = 0

  constructor(imgCvs: ImageCanvas, keys: K[]) {
    this._imgCvs = imgCvs
    this._generators = new Map(keys.map((key) => [key, null]))
  }

  useImageColorAs(name: K) {
    this.add(name, {
      components: 4,
      generate: ({ color }) => [color.r, color.g, color.b, color.a]
    })
  }

  add(name: K, { components, generate }: GeneratorInfo) {
    this._totalDimensions += components
    this._generators.set(name, { components, generate })
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
          const { components, generate } = value
          const result = generate(args)
          for (let k = 0; k < components; ++k) {
            array[thisRow + index + k] = result[k]
          }
          index += components
        })
      }
    }

    return array
  }

  get keys() {
    return [...this._generators.keys()]
  }
}
