import React from 'react'
import { Descriptions } from 'antd'

// 此TypeScript函数定义了一个名为`Index`的React函数组件， `Index`组件主要用于展示与项目相关的基本信息，包括GitHub仓库链接、作者名称、以及项目依赖的包和版本。

// 1. **组件渲染**: 组件渲染一个带有类名`card`的`<div>`元素，内部使用了Ant Design库中的Descriptions、Descriptions.Item组件来展示一系列描述性信息。

// 2. **标题设置**: `Descriptions`组件的`title`属性被设置为`@henriFox`，这会在组件顶部显示一个标题。

// 3. **边框样式**: 通过`bordered`属性设置，使得`Descriptions`组件的每个项目都有边框。


const Index: React.FC = () => (
    <div className="card">
        <Descriptions title="@henriFox" bordered>
            <Descriptions.Item label="GitHub" span={3}>
                <a
                    style={{ color: '#1890ff' }}
                    href="https://github.com/Henri-lab/smart-traffic-usermanageReact"
                    target="_blank"
                    rel="noreferrer"
                >
                    https://github.com/Henri-lab/smart-traffic-usermanageReact
                </a>
            </Descriptions.Item>
            <Descriptions.Item label="作者" span={3}>
                <a
                    style={{ color: '#1890ff' }}
                    href='https://github.com/haojiey'
                    target="_blank"
                    rel="noreferrer"
                >   
                    1.henriFox.W <br />
                    2.梁木由
                </a>
            </Descriptions.Item>
            <Descriptions.Item label="PackAge">
                react: ^18.2.0
                <br />
                react-router-dom: ^6.9.0
                <br />
                redux: ^4.2.1
                <br />
                typescript: ^4.9.3
                <br />
                antd: ^4.24.8
                <br />
                vite: ^4.2.0
            </Descriptions.Item>
        </Descriptions>
    </div>
)



export default Index
