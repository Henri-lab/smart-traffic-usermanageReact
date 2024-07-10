import type { InternalAxiosRequestConfig } from 'axios'

import { RequestConfig } from './types'

import { HttpEnum } from '/@/enum/http'
import { MenuEnum } from '/@/enum/menu'
import { useMessage } from '/@/hooks/message'
import { clearPersistor } from '/@/redux/index'
import { store } from '/@/redux/index'
import { isString } from '/@/utils/is'
const { uesErrorMsg } = useMessage()
// 优化请求参数
export function OptimizedData(config: RequestConfig) {
    let { data, method } = config

    if (method == 'get' || method == 'delete') {
        const t = {
            _t: new Date().getTime()
        }
        if (!isString(data)) {
            config.params = Object.assign(data || {}, t)
            config.data = undefined
        } else {
            config.url = config.url + data + `?_t=${t._t}`
            config.params = undefined
        }
    } else {
        const params = filterNullParams(data || [])
        if (!isString(params)) {
            config.data = params
            config.params = undefined
        } else {
            config.url = config.url + params
            config.params = undefined
        }
    }
    return config
}

export function RequestBefore(req: InternalAxiosRequestConfig) {
    const token = store.getState().user.token
    if (!token) {
        req.headers.token = token
    }
    return req
}

export function ResponseSuccess(res: any) {
    const { code, data } = res.data

    if (code === HttpEnum.SUCCESS) {
        return data
    }

    if (code === HttpEnum.OVERDUE) {
        uesErrorMsg('登陆超时,请重新登录!')
        clearPersistor()
        // 获取当前页面的哈希值📣
        window.location.hash = MenuEnum.BASE_LOGIN
        // 单页面应用路由：常用于记录当前页面的状态或路由路径。
        // 页面内导航：可以通过哈希值在页面内快速定位到特定部分。
        // 例如 window.location.hash = '#section2';
        // 这将使页面的 URL 变为 http://example.com/#section2，并且页面会自动滚动到具有 id="section2" 的元素所在位置（如果存在的话）。
        return data
    }

    if (code === HttpEnum.TIMEOUT) {
        uesErrorMsg('接口请求超时,请刷新页面重试!')
        return 'error'
    }

    return Promise.reject(res.data)
}

export function ResponseFailure(e: any) {
    const { code, message } = e || {}
    // TypeScript 提供的新特性，使得处理可能存在空值的情况更加安全和简洁。
    // 它表示如果 e 存在并且 toString 方法存在，则调用 toString 方法并返回其结果。如果 e 或者 toString 方法任何一个不存在，表达式返回 undefined。
    const err: string = e?.toString?.() ?? ''
    try {
        if (code === HttpEnum.TIMEOUT && message.indexOf('timeout') !== -1 /*exist😈 */) {
            uesErrorMsg('请求超时')
            throw new Error('请求超时')
        }
        if (err?.includes('Network Error')) {
            uesErrorMsg('网络异常')
        }
    } catch (error) {
        throw new Error(error)
    }
    return e
}

const filterNullParams = (params: any) => {
    Object.keys(params).filter(
        (key) =>
            (params[key] === '' || params[key] === undefined || params[key] === null) &&
            delete params[key]
    )

    return params
}
