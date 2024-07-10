import react from '@vitejs/plugin-react'
import { themePreprocessorPlugin } from '@zougt/vite-plugin-theme-preprocessor'
import { resolve } from 'path'
import type { Plugin } from 'vite'
import vitePluginImp from 'vite-plugin-imp'
import { viteMockServe } from 'vite-plugin-mock'

// 创建和配置 Vite 插件
export function vitePlugins(VITE_USE_MOCK: boolean, isBuild: boolean) {
    const plugins: (Plugin | Plugin[])[] = []

    // 添加主题预处理器插件，用于动态主题切换
    plugins.push(
        themePreprocessorPlugin({
            less: {
                // 启用动态主题模式
                arbitraryMode: false,
                // 多个主题变量配置
                multipleScopeVars: [
                    {
                        scopeName: 'theme-default',
                        path: resolve('src/design/theme/default.less')
                    },
                    {
                        scopeName: 'theme-dark',
                        path: resolve('src/design/theme/dark.less')
                    }
                ],
                // 将非主题色变量生成的颜色包含在主题 CSS 中，提高权重
                includeStyleWithColors: [
                    {
                        // 将特定颜色包含在主题 CSS 中，可以确保这些颜色在样式层级上具有更高的优先级，防止它们被其他样式覆盖。
                        // 尤其是在使用多个样式文件或引入外部样式时，这一点尤为重要。
                        color: '#ffffff'
                        // 是否随着主题色梯度变化，默认false
                        // inGradient: true,
                    }
                ],
                // 在生产模式下抽取独立的主题 CSS 文件
                extract: true,
                // 独立主题 CSS 文件的输出路径，默认为 viteConfig.build.assetsDir 相对于 viteConfig.build.outDir
                outputDir: '',
                // 在 HTML 中添加 link 标签的 ID
                themeLinkTagId: 'theme-link-tag', //  <link id="theme-link-tag" rel="stylesheet" href="/path/to/theme.css">
                // link 标签插入位置
                themeLinkTagInjectTo: 'head',
                // 是否移除抽取的 CSS 文件中对应 scopeName 的权重类名
                removeCssScopeName: false,
                // .theme-default { 💨💨 button等选择器 的 ScopeName  💫适合需要在生成的 CSS 文件中保留主题类名，以确保样式规则的主题隔离性和可读性的情况。好处多多！
                //       .button {
                //     background-color: #ffffff;
                //     color: #000000;
                //       }
                // }
                // 自定义 CSS 文件名称的函数
                customThemeCssFileName: (scopeName) => scopeName
            }
        })
    )

    // 添加 vite-plugin-imp 插件，用于按需加载
    plugins.push(vitePluginImp({}))

    // 添加 React 插件
    plugins.push(react())

    // 如果 VITE_USE_MOCK 为 true，则添加 Mock 服务插件
    VITE_USE_MOCK &&
        plugins.push(
            viteMockServe({
                ignore: /^_/, // 忽略以 _ 开头的文件
                mockPath: 'src/mock', // Mock 数据文件的路径
                localEnabled: !isBuild, // 本地开发模式启用 Mock
                prodEnabled: isBuild, // 生产模式启用 Mock
                injectFile: 'src/main.tsx', // 注入 Mock 服务的文件
                injectCode: `
                    import { setupProdMockServer } from './mock/index';
                    setupProdMockServer();
                ` // 注入的代码，用于在生产模式下设置 Mock 服务
            })
        )

    return plugins
}

// themePreprocessorPlugin📍 用于动态主题切换，支持多个主题配置。
// --arbitraryMode📣: 是否启用动态主题模式。
// --multipleScopeVars📣: 配置多个主题变量，分别指定每个主题的名称和路径。
// --includeStyleWithColors📣: 包含非主题色变量生成的颜色到主题 CSS 中。
// --extract📣: 在生产模式下抽取独立的主题 CSS 文件。
// --outputDir📣: 独立主题 CSS 文件的输出路径。
// --themeLinkTagId📣: 在 HTML 中添加 link 标签的 ID。
// --themeLinkTagInjectTo📣: link 标签插入位置。
// --removeCssScopeName📣: 是否移除抽取的 CSS 文件中对应 scopeName 的权重类名。
// --customThemeCssFileName📣: 自定义 CSS 文件名称的函数。
// --vitePluginImp📣：用于按需加载组件库。

// react📍 用于支持 React 的 Vite 插件。

// viteMockServe📍：用于本地和生产模式下的 Mock 服务。
// --ignore💨: 忽略以 _ 开头的文件。
// --mockPath💨: Mock 数据文件的路径。
// --localEnabled💨: 本地开发模式是否启用 Mock。
// --prodEnabled💨: 生产模式是否启用 Mock。
// --injectFile💨: 注入 Mock 服务的文件。
// --injectCode💨: 注入的代码，用于在生产模式下设置 Mock 服务。
