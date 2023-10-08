---
editUrl: false
next: false
prev: false
title: "SketchFrag"
---

## Extends

- `SketchProxyBase`\<`SketchFragCore`, [`SketchFragCanvas`](/api/interfaces/sketchfragcanvas/), [`SketchFragConfig`](/api/interfaces/sketchfragconfig/)\>

## Constructors

### new SketchFrag(sketch)

> **new SketchFrag**(`sketch`): [`SketchFrag`](/api/classes/sketchfrag/)

#### Parameters

▪ **sketch**: [`SketchFn`](/api/type-aliases/sketchfn/)\<[`SketchFragCanvas`](/api/interfaces/sketchfragcanvas/), `Sketch`\>

#### Inherited from

SketchProxyBase\<SketchFragCore, SketchFragCanvas, SketchFragConfig\>.constructor

#### Source

[core/sketch/proxy.ts:14](https://github.com/tetracalibers/sketchgl/blob/8077943/lib/core/sketch/proxy.ts#L14)

## Methods

### bindCanvas()

> **bindCanvas**(`config`): `void`

#### Parameters

▪ **config**: [`SketchFragConfig`](/api/interfaces/sketchfragconfig/)

#### Inherited from

SketchProxyBase.bindCanvas

#### Source

[core/sketch/proxy.ts:18](https://github.com/tetracalibers/sketchgl/blob/8077943/lib/core/sketch/proxy.ts#L18)

***

### screenshot()

> **screenshot**(): `void`

#### Inherited from

SketchProxyBase.screenshot

#### Source

[core/sketch/proxy.ts:24](https://github.com/tetracalibers/sketchgl/blob/8077943/lib/core/sketch/proxy.ts#L24)

***

### start()

> **start**(): `Promise`\<`void`\>

#### Overrides

SketchProxyBase.start

#### Source

[core/sketch-frag/index.ts:61](https://github.com/tetracalibers/sketchgl/blob/8077943/lib/core/sketch-frag/index.ts#L61)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
