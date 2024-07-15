import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { toggleTheme } from '@zougt/vite-plugin-theme-preprocessor/dist/browser-utils'
import { Switch } from 'antd'

import { setTheme } from '/@/redux/modules/theme/action'
const Sun = () => <i className="iconfont icon-sun"></i>

const Moon = () => <i className="iconfont icon-moon"></i>

// React.FC（函数组件）是 React 提供的用于定义函数组件的类型。
// 在 TypeScript 中，它是一种类型声明，用于定义一个具有特定属性和返回值类型的函数组件。

// 为什么使用 React.FC
// 使用 React.FC 有几个好处：

// 类型推断：自动推断组件的 props 类型，提供更好的开发体验。
// 默认子元素类型：React.FC 会自动为组件添加 children prop 的类型，这样你不需要手动定义它。
// 一致性：确保组件的类型定义一致，有助于维护和阅读代码。
const Index: React.FC = ({ isDark, setTheme }: any) => {
    function changeTheme(checked: boolean) {
        const theme = checked ? 'theme-dark' : 'theme-default'
        toggleTheme({
            scopeName: theme
        })
        setTheme(checked)
    }
    useEffect(() => {
        const theme = isDark ? 'theme-dark' : 'theme-default'
        toggleTheme({
            scopeName: theme
        })
    }, [])
    return (
        <Switch
            className="login-theme"
            onChange={changeTheme}
            checkedChildren={<Sun />}
            unCheckedChildren={<Moon />}
            defaultChecked={isDark}
        />
    )
}

export default connect((state: any) => state.theme, {
    setTheme
})(Index)
