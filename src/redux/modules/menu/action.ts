import { Dispatch } from 'react'

import { getMenuList } from '/@/api/menu/index'
import { Menu, MenuProps } from '/@/interface'
import * as types from '/@/redux/constant'

export const updateCollapse = (isCollapse: boolean) => ({
    type: types.UPDATE_COLLAPSE,
    isCollapse
})

export const getMenuListAction = () => async (dispatch: Dispatch<MenuProps>) => {
    // 定义一个 action creator，返回一个异步函数的😽
    const data = await getMenuList()
    // Dispatch 是 Redux 中用于派发 action 的类型
    try {
        // 调用异步函数获取菜单列表数据
        const data = await getMenuList() //如果成功获取数据，将数据作为 menuList 字段传递给派发的 action。

        // react 提供派发到 Redux store的方法
        dispatch({
            type: types.SET_MENU_LIST,
            menuList: (data as Menu.MenuOptions[]) ?? [] // 将 data 转换为 Menu.MenuOptions[] 类型，若为 null 或 undefined，则使用空数组
        })
    } catch (error) {
        console.error('Error fetching menu list:', error)
        // 可以在这里添加错误处理逻辑，例如 dispatch 一个错误 action 或者弹出错误提示
    }
}

// 😽返回一个异步函数作为 action。
// 这样做的好处是可以在 action creator 即getMenuListAction 中执行异步操作，并在异步操作完成后再派发真正的 action 到 Redux store。
