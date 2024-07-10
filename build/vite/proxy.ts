type ProxyItem = [string, string]

type ProxyList = ProxyItem[]

/**
 * Generate proxy
 * @param list
 */
// 返回适合于 Vite 服务器代理选项的代理配置对象
export function createProxy(list: ProxyList = []) {
    if (!Array.isArray(list)) {
        return
    }
    const ret = {}
    // 示例：去 /xxx 的url 都被 vite 发送到 http://target.com
    //  server: {
    //     proxy: createProxy([
    //         ['/xxx', 'http://target.com'],
    //         // 可以添加更多的代理配置
    //     ]),
    // }
    for (const [prefix, target] of list) {
        //list的每个元素都是一个[prefix, target]
        ret[prefix] = {//ret 身上有 prefix 到 配置 的 映射 👽
            //目标服务器的配置
            target: target, //目标 URL
            changeOrigin: true, //是否改变来源
            rewrite: (path) => path.replace(new RegExp(`^${prefix}`), '') //路径重写
        }
    }

    return ret
    // ret = {
    //     '/api1': {
    //         target: 'http://localhost:3001',
    //         changeOrigin: true,
    //         rewrite: (path) => path.replace(/^\/api1/, '')
    //     },
    //     '/api2': {
    //         target: 'http://localhost:3002',
    //         changeOrigin: true,
    //         rewrite: (path) => path.replace(/^\/api2/, '')
    //     },
    //     '/api3': {
    //         target: 'http://localhost:3003',
    //         changeOrigin: true,
    //         rewrite: (path) => path.replace(/^\/api3/, '')
    //     },
    // }
    // ------------提取🔰模板----------------
    //          -{-     
    //  (A,B) => 'prefix(变量A)': {
    //                             'target': 'http://target.com'(变量B),
    //                             'changeOrigin': true,
    //                             'rewrite': (path) => path.replace(new RegExp(`^prefix`), '') // 重写路径
    //                            }
    //          -}-
    // ------------提取🔰模板----------------
}
