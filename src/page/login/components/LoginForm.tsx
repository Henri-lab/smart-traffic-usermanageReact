import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'

import { login } from '/@/api/login'
import { MenuEnum } from '/@/enum/menu'
import { useMessage } from '/@/hooks/message'
import { LoginApiForm } from '/@/interface/index'
import { setName, setPermissions, setToken } from '/@/redux/modules/user/action'
import { clearInfo } from '/@/redux/modules/user/action'
const LoginForm: React.FC = (props: any) => {
    const { setToken, setName, clearInfo, setPermissions } = props// 组件内部可以通过 props 访问状态和方法
    const { uesErrorMsg, uesSuccessMsg } = useMessage()
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    const onFinish = async (values: LoginApiForm.ReqForm) => {
        try {
            clearInfo()
            setLoading(true)
            const { token, permissions } = await login(values)
            setToken(token)
            setPermissions(permissions)
            setName(values.username)
            uesSuccessMsg('登陆成功')
            navigate(MenuEnum.BASE_HOME)
        } catch (error: any) {
            uesErrorMsg(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form
            name="basic"
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"// 自动填充
            size="large"
            className="login-forms"
        >
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                <Input placeholder="username：admin" prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password
                    autoComplete="new-password"
                    placeholder="password：123456"
                    prefix={<LockOutlined />}
                />
            </Form.Item>

            <Form.Item
                className="login-remeber"
                name="remember"
                valuePropName="checked"
                wrapperCol={{ offset: 0, span: 16 }}
            >
                <Checkbox>remember me</Checkbox>
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<UserOutlined />}
                    loading={loading}
                    className="login-btn"
                >
                    login in
                </Button>
                <br />
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<UserOutlined />}
                    loading={loading}
                    className="sign-btn"
                >
                    sign in
                </Button>
            </Form.Item>
        </Form>
    )
}

// 在 React 中，connect 是用于将 Redux 的状态和操作绑定到组件的高阶组件。
// 它通过将 Redux store 的状态和 action creators 映射到组件的 props，使得组件可以访问和操作全局状态。
export default connect((state: any) => state.user, {
    setToken,
    setName,
    setPermissions,
    clearInfo
})(LoginForm)
// ==对比==
// 状态的获取：
// -React：通过 connect 将状态映射到组件的 props 中。
// -Vue：通过 useUserStore 获取 store 实例，然后直接访问其状态。

// 方法的使用：
// -React：通过 connect 将 action creators 绑定到组件的 props 中，组件通过调用 props 上的方法来更新状态。
// -Vue：在组件中直接调用 store 上定义的 actions 来更新状态。

// 组织方式：
// -React：通常通过 mapStateToProps 和 mapDispatchToProps 组织状态和方法。
// -Vue：在 Pinia 中，状态和方法都定义在同一个 store 中，组件通过 useUserStore 访问。

// 在复杂应用中，两者的用法和组织方式可能会更加深入，但基本理念是相似的：都是通过状态管理库提供的工具，将全局状态和方法注入到组件中，从而使得组件可以与全局状态交互。

// connect 是 react-redux 库中的一个高阶组件，用于将 Redux store 中的状态和 action creators 注入到 React 组件的 props 中。它的底层原理包括以下几个关键步骤：

// 1. 创建高阶组件
// connect 函数是一个高阶函数，它返回一个高阶组件（HOC）。这个高阶组件包装了你传入的 React 组件，并通过 props 将 Redux store 的状态和 action creators 传递给这个组件。

// 2. 订阅 Redux store
// 在高阶组件内部，connect 会订阅 Redux store，当 store 的状态发生变化时，高阶组件会重新计算并更新传递给子组件的 props。这个订阅功能通过 store.subscribe 实现。

// 3. mapStateToProps 和 mapDispatchToProps
// connect 函数接受两个参数：mapStateToProps 和 mapDispatchToProps。

// mapStateToProps：这是一个函数，用于将 Redux store 中的状态映射到组件的 props。每当 store 的状态发生变化时，这个函数会被调用，并返回一个新的状态对象，这个对象会被合并到组件的 props 中。

// mapDispatchToProps：这是一个函数，用于将 action creators 映射到组件的 props。这个函数通常会返回一个包含 action creators 的对象，这些 action creators 会被注入到组件的 props 中，从而允许组件调用这些方法来分发 actions。

// 4. 合并 props
// connect 会将 mapStateToProps 和 mapDispatchToProps 返回的对象合并到组件的 props 中，同时保留组件原本的 props。最终的 props 对象会传递给被包装的组件。

// 5. 渲染组件
// 高阶组件在合并 props 后，会将这些 props 传递给被包装的组件并进行渲染。这使得被包装的组件可以直接通过 props 访问 Redux store 中的状态和方法。

// import React, { Component, createContext, useContext } from 'react';
// import { createStore } from 'redux';

// // 创建 Redux store
// const store = createStore((state = { count: 0 }, action) => {
//   switch (action.type) {
//     case 'INCREMENT':
//       return { ...state, count: state.count + 1 };
//     default:
//       return state;
//   }
// });

// // 创建一个 Context 来提供 Redux store
// const ReduxContext = createContext();

// const Provider = ({ store, children }) => (
//   <ReduxContext.Provider value={store}>{children}</ReduxContext.Provider>
// );

// const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
//   return class extends Component {
//     static contextType = ReduxContext;

//     constructor(props, context) {
//       super(props, context);
//       this.state = mapStateToProps(context.getState());

//       this.unsubscribe = context.subscribe(() => {
//         this.setState(mapStateToProps(context.getState()));
//       });
//     }

//     componentWillUnmount() {
//       this.unsubscribe();
//     }

//     render() {
//       const stateProps = mapStateToProps(this.context.getState());
//       const dispatchProps = mapDispatchToProps(this.context.dispatch);
//       return <WrappedComponent {...this.props} {...stateProps} {...dispatchProps} />;
//     }
//   };
// };

// const mapStateToProps = (state) => ({
//   count: state.count,
// });

// const mapDispatchToProps = (dispatch) => ({
//   increment: () => dispatch({ type: 'INCREMENT' }),
// });

// const Counter = ({ count, increment }) => (
//   <div>
//     <p>{count}</p>
//     <button onClick={increment}>Increment</button>
//   </div>
// );

// const ConnectedCounter = connect(mapStateToProps, mapDispatchToProps)(Counter);

// // 应用组件
// const App = () => (
//   <Provider store={store}>
//     <ConnectedCounter />
//   </Provider>
// );

// export default App;
