import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import { generateTypeDoc } from "starlight-typedoc"
import { resolve } from "node:path"

const __dirname = new URL(".", import.meta.url).pathname

const typeDocSidebarGroup = await generateTypeDoc({
  entryPoints: [
    "../lib/index.ts",
    "../lib/interactive.ts",
    "../lib/program.ts",
    "../lib/renderer.ts",
    "../lib/utility.ts",
    "../lib/texture.ts",
    "../lib/geometry.ts",
    "../lib/math.ts",
    "../lib/camera.ts"
  ],
  tsconfig: "../tsconfig.json"
})

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        sketchgl: resolve(__dirname, "../lib"),
        $: resolve(__dirname, "../lib/")
      }
    }
  },
  integrations: [
    starlight({
      title: "My Docs",
      social: {
        github: "https://github.com/withastro/starlight"
      },
      customCss: ["./src/styles/prism-atom-dark.css"],
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", link: "/guides/example/" }
          ]
        },
        {
          label: "Examples",
          autogenerate: { directory: "examples", collapsed: true }
        },
        typeDocSidebarGroup
      ]
    })
  ]
})
