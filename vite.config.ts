import { resolve } from 'path'
import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'

import { CHUNK_SIZE_WARNING_LIMIT, OUT_DIR } from './build/constant'
import { wrapperEnv } from './build/utils'
import { vitePlugins } from './build/vite/plugin'
import { createProxy } from './build/vite/proxy'

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
    // 获取项目根目录路径
    const root = process.cwd()

    // 读取环境变量，loadEnv 函数返回的是所有环境变量的对象
    // 注意：loadEnv 函数读取的 boolean 类型是字符串，需要转换为 boolean 类型
    const env = loadEnv(mode, root)

    // 判断当前命令是否为 'build'
    const isBuild = command === 'build'

    // 使用 wrapperEnv 工具函数，将环境变量转换为正确的类型
    const { VITE_PORT, VITE_PROXY, VITE_USE_MOCK, VITE_OPEN } = wrapperEnv(env)

    return {
        // 配置开发服务器选项
        server: {
            // 设置开发服务器的端口
            port: VITE_PORT,
            // 设置主机地址为 '0.0.0.0'，以允许外部访问
            host: '0.0.0.0',
            // 如果 VITE_OPEN 为 true，启动时自动打开浏览器
            open: VITE_OPEN,
            // 从 .env 文件加载代理配置
            proxy: createProxy(VITE_PROXY),
            // 配置 HMR（热模块替换）
            hmr: {
                // 启用错误覆盖层，当编译错误时在浏览器中显示覆盖层
                overlay: true
            }
        },
        // 配置 CSS 预处理选项
        css: {
            // 启用 Less 的 JavaScript 支持
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true
                }
            }
        },
        // 加载插件，传递是否使用 Mock 和是否是构建模式
        plugins: vitePlugins(VITE_USE_MOCK, isBuild),
        // 配置构建选项
        build: {
            // 设置输出目录
            outDir: OUT_DIR,
            // 使用 Terser 进行代码压缩
            minify: 'terser',
            // 配置 Terser 压缩选项
            terserOptions: {
                // 配置压缩选项，移除 console 和 debugger 语句
                compress: {
                    drop_console: true,
                    drop_debugger: true
                }
            },
            // 将构建目标设置为 'es2020'，以支持现代特性如 import.meta
            target: 'es2020',
            // 设置 chunk 大小警告的限制
            chunkSizeWarningLimit: CHUNK_SIZE_WARNING_LIMIT
        },
        // 配置模块解析选项
        resolve: {
            // 设置路径别名
            alias: {
                // 将 '/@/' 别名映射到 'src' 目录
                '/@/': resolve(__dirname, 'src') + '/'
            }
        }
    }
}
