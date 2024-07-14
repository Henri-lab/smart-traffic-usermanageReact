import React from 'react'
import { connect } from 'react-redux'

type propsState = {
    authority?: string
    permissions?: string[]
    children: React.ReactNode[] | string | React.ReactElement
}

// ### 函数解析：`AuthPermissions`

// #### 功能概述
// 此 TypeScript 函数组件 `AuthPermissions` 用于基于用户权限动态控制子组件的显示与否。它基于传入的权限列表和特定权限标识来决定是否渲染其子组件。

// #### 参数说明
// - **`props`:** 类型为 `propsState` 的对象，包含以下属性：
//   - `permissions`: 权限列表，默认为一个空数组。该列表包含了所有允许访问的权限标识。
//   - `authority`: 特定的权限标识，默认为空字符串。用于与权限列表中的项进行对比。
//   - `children`: 需要被条件渲染的子组件。

// #### 内部逻辑
// 1. **解构赋值**: 函数首先解构 `props` 对象，获取 `permissions`, `authority`, 和 `children`。如果 `permissions` 或 `authority` 未提供，则使用默认值。
// 2. **权限验证**:
//    - 检查 `authority` 是否非空。若非空，则检查 `permissions` 数组中是否包含 `authority`。
//    - 若 `authority` 为空或 `permissions` 包含 `authority`，则将 `true` 赋值给 `auth`；否则，`auth` 为 `false`。
// 3. **条件渲染**:
//    - 使用逻辑与操作符 (`&&`) 和三元运算符的组合，当 `auth` 为 `true` 或 `authority` 空字符串时，`children` 子组件将被渲染。
//    - 如果 `auth` 为 `false` 或 `authority` 非空且不在 `permissions` 中，`children` 将不会渲染。

// #### 返回值
// - 返回 JSX 元素，仅当满足权限条件时，才渲染传入的 `children` 子组件。
const AuthPermissions = (props: propsState) => {
    const { permissions = [], authority = '', children } = props
    const auth = authority ? permissions.includes(authority) : authority
    return <>{(auth || authority == '') && children}</>
}
export default connect((state: any) => state.user)(AuthPermissions)
