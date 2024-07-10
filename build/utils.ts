// 定义 Vite 环境变量的接口
export interface ViteEnv {
    VITE_PORT: number // 开发服务器端口
    VITE_USE_MOCK: boolean // 是否使用 Mock 数据
    VITE_USE_PWA: boolean // 是否启用 PWA
    VITE_PUBLIC_PATH: string // 公共路径
    VITE_PROXY: [string, string][] // 代理配置
    VITE_OPEN: boolean // 是否自动打开浏览器
    VITE_GLOB_APP_TITLE: string // 应用全局标题
    VITE_GLOB_APP_SHORT_NAME: string // 应用简短名称
    VITE_USE_CDN: boolean // 是否使用 CDN
    VITE_DROP_CONSOLE: boolean // 是否移除 console 语句
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none' // 构建压缩方式
    VITE_DYNAMIC_IMPORT: boolean // 是否启用动态导入
    VITE_LEGACY: boolean // 是否支持旧版浏览器
    VITE_USE_IMAGEMIN: boolean // 是否使用图片压缩
}

// 读取所有环境变量配置文件并处理为 process.env
export function wrapperEnv(envConf: any): ViteEnv {
    const ret: any = {}

    // 遍历环境变量配置
    for (const envName of Object.keys(envConf)) {
        // 获取实际值，并处理换行符
        let realName = envConf[envName].replace(/\\n/g, '\n')

        // 将字符串 'true' 和 'false' 转换为布尔值
        realName = realName === 'true' ? true : realName === 'false' ? false : realName

        // 将端口号转换为数字
        if (envName === 'VITE_PORT') {
            realName = Number(realName)
        }

        // 将代理配置从字符串转换为对象
        if (envName === 'VITE_PROXY') {
            try {
                realName = JSON.parse(realName)
            } catch (error) {
                throw error
            }
        }

        // 将处理后的值存入结果对象
        ret[envName] = realName
    }

    return ret as ViteEnv
    // 通过这种方式，可以确保环境变量在使用前被正确处理，并且符合 ViteEnv 接口的定义，提供类型安全的开发体验。
}
