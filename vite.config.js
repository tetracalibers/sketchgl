import { resolve } from "path"
import { defineConfig } from "vite"

export default defineConfig({
  build: {
    lib: {
      // 複数のエントリーポイントのディクショナリや配列にもできます
      entry: ["lib/index.ts", "lib/math.ts", "lib/camera.ts", "lib/webgl.ts"].map((path) => resolve(__dirname, path)),
      name: "sketchgl"
    },
    rollupOptions: {
      // ライブラリにバンドルされるべきではない依存関係を
      // 外部化するようにします
      external: ["lil-gui"],
      output: {
        // 外部化された依存関係のために UMD のビルドで使用する
        // グローバル変数を提供します
        globals: {}
      }
    },
    sourcemap: true
  }
})
