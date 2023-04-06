# unplugin-export-type
为了支持在vue3中setup语法不支持动态导入类型而写的plugin

## Resolve
想要复用类型会动态导入再传入，会发生这样的错误
![example](/assets/example.png)

## Install
![install](/assets/install.png)

## 🌈 Usage

<details>
<summary>Vite</summary>

```ts
// vite.config.ts
import { vitePluginPlugin } from 'unplugin-export-type'
export default defineConfig({
  plugins: [vitePluginPlugin(/* options */)],
})
```

</details>
<br>
<details>
<summary>Rollup</summary>

```ts
// rollup.config.js
import { resolve } from 'path'
import { rollupPlugin } from 'unplugin-export-type'
export default {
  plugins: [rollupPlugin(/* options */)],
}
```

</details>
<br>
<details>
<summary>Webpack</summary>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-export-type').webpackPlugin({
      /* options */
    }),
  ],
}
```

</details>
<br>
<details>
<summary>Vue CLI</summary>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-export-type').webpackPlugin({
        /* options */
      }),
    ],
  },
}
```

</details>
<br>
<details>
<summary>Esbuild</summary>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import { esbuildPlugin } from 'unplugin-export-type'

build({
  plugins: [esbuildPlugin(/* options */)],
})
```

</details>

[Example](./playground/src/components/Footer.vue)

## License
[MIT](./LICENSE) License © 2022 [Simon He](https://github.com/Simon-He95)

<a href="https://github.com/Simon-He95/sponsor" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>


<span><div align="center">![sponsors](https://www.hejian.club/images/sponsors.jpg)</div></span>
