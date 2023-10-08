---
editUrl: false
next: false
prev: false
title: "SketchImage"
---

## Extends

- `SketchProxyBase`\<`SketchImageCore`, [`SketchImageCanvas`](/api/interfaces/sketchimagecanvas/), [`SketchImageConfig`](/api/interfaces/sketchimageconfig/)\>

## Constructors

### new SketchImage(sketch)

> **new SketchImage**(`sketch`): [`SketchImage`](/api/classes/sketchimage/)

#### Parameters

▪ **sketch**: [`SketchFn`](/api/type-aliases/sketchfn/)\<[`SketchImageCanvas`](/api/interfaces/sketchimagecanvas/), `Sketch`\>

#### Inherited from

SketchProxyBase\<SketchImageCore, SketchImageCanvas, SketchImageConfig\>.constructor

#### Source

[core/sketch/proxy.ts:14](https://github.com/tetracalibers/sketchgl/blob/efe48d3/lib/core/sketch/proxy.ts#L14)

## Methods

### bindCanvas()

> **bindCanvas**(`config`): `void`

#### Parameters

▪ **config**: [`SketchImageConfig`](/api/interfaces/sketchimageconfig/)

#### Inherited from

SketchProxyBase.bindCanvas

#### Source

[core/sketch/proxy.ts:18](https://github.com/tetracalibers/sketchgl/blob/efe48d3/lib/core/sketch/proxy.ts#L18)

***

### changeImage()

> **changeImage**(`file`): `void`

#### Parameters

▪ **file**: `File`

#### Source

[core/sketch-image/index.ts:62](https://github.com/tetracalibers/sketchgl/blob/efe48d3/lib/core/sketch-image/index.ts#L62)

***

### screenshot()

> **screenshot**(): `void`

#### Inherited from

SketchProxyBase.screenshot

#### Source

[core/sketch/proxy.ts:24](https://github.com/tetracalibers/sketchgl/blob/efe48d3/lib/core/sketch/proxy.ts#L24)

***

### start()

> **start**(`img`): `Promise`\<`void`\>

#### Parameters

▪ **img**: `string`

#### Overrides

SketchProxyBase.start

#### Source

[core/sketch-image/index.ts:57](https://github.com/tetracalibers/sketchgl/blob/efe48d3/lib/core/sketch-image/index.ts#L57)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
