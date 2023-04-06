import fsp from 'fs/promises'
import path from 'path'
import fs from 'fs'
import { parse } from 'vue/compiler-sfc'
import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import type { Options } from './types'
//  [@vue/compiler-sfc] type argument passed to defineProps() must be a literal type, or a reference to an interface or literal type
// 插件支持setup中动态导入类型
const unplugin = createUnplugin((options: Options = {}): any => {
  const filter = createFilter(options.include, options.exclude)
  const TYPEREG = /\w+\s*<(\w+)>\s*\(/gm
  const EXPORTINTERFACE = /export\s+interface\s+([\w]+)\s*({[\w\s:,;]+})/gm
  const EXPORTTYPE = /export\s+type\s+([\w]+)\s*=\s*({[\w\s:,;]+})/gm
  const EXPORTTYPEEQUAL = /export\s+type\s+([\w]+)\s*=\s*([\w]+)/gm
  // const SCRIPT = /<script[\s\w"'=]*>/
  return [
    {
      name: 'unplugin-export-type',
      enforce: 'pre',
      transformInclude(id: string) {
        return filter(id)
      },
      async transform(src: string, id: string) {
        if (!id.endsWith('.vue'))
          return
        const { descriptor } = parse(src)

        const script = descriptor.script || descriptor.scriptSetup
        if (!script)
          return
        const source = script.content
        const imports = getTypeImports(source)
        if (!Object.keys(imports).length)
          return
        let index = 0
        return await new Promise(resolve => source.replace(TYPEREG, (_: string, type: string) => {
          index++
          const source = imports[type]
          const removeImport = new RegExp(`import [\\w\\s]+{*\\s*${type}\\s*}*\\s+from\\s*['"]${source}['"]`)
          // source
          let url = path.resolve(path.dirname(id), `${source}.ts`)
          const isExists = fs.existsSync(url)
          // 处理文件夹路径
          if (!isExists)
            url = path.resolve(path.dirname(id), `${source}/index.ts`)
          let isFind = false

          fsp.readFile(url, 'utf-8').then((content) => {
            index--
            content.replace(EXPORTINTERFACE, (_: string, name: string, val: string) => {
              if (name !== type)
                return ''
              isFind = true
              src = src.replace(removeImport, `interface ${name} ${val}`)
              if (index === 0)
                resolve(src)
              return ''
            })

            if (isFind)
              return src
            content.replace(EXPORTTYPE, (_, name, val) => {
              if (name !== type)
                return ''
              isFind = true

              src = src.replace(removeImport, `type ${name}${val}`)
              if (index === 0)
                resolve(src)
              return ''
            })
            if (isFind)
              return src
            content.replace(EXPORTTYPEEQUAL, (_, name, val) => {
              const regType = new RegExp(`type\\s*(${val})\\s*=\\w+`, 'g')
              const regInterface = new RegExp(`interface\\s*(${val})\\s*{[\\w\\s"',;:]+}`, 'g')
              content.replace(regType, (_, v) => src = src.replace(removeImport, () => _.replace(v, name)))
              content.replace(regInterface, (_, v) => src = src.replace(removeImport, () => _.replace(v, name)))
              if (index === 0)
                resolve(src)
              return ''
            })
            if (index === 0)
              resolve(src)
          })
          return ''
        }))
      },
    },
  ]
})

function getTypeImports(s: string) {
  const TYPE = /import [\w\s]+{*\s*(\w+)\s*}*\s+from\s*['"](.*)['"]/g
  const result: Record<string, string> = {}
  s.replace(TYPE, (_, name, source) => result[name] = source)
  return result
}

export const vitePlugin = unplugin.vite
export const rollupPlugin = unplugin.rollup
export const webpackPlugin = unplugin.webpack
export const esbuildPlugin = unplugin.esbuild
