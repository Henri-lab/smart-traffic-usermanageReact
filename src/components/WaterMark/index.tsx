import React, { memo, useMemo } from 'react'
import { renderToString } from 'react-dom/server'
import './index.less'

// 定义一个功能组件 Index，接收 text, fillColor, fillOpacity, 和 fontSize 作为 props
const Index = (
    props: React.PropsWithChildren<{
        text: string
        fillColor?: string
        fillOpacity?: number
        fontSize?: number
    }>
) => {
    // 使用 useMemo 来缓存计算后的 SVG URL，只有在依赖项（props）发生变化时才重新计算
    const svgUrl = useMemo(() => {
        // 定义一个 SVG 元素，使用传入的 props 设置 text, fillColor, fillOpacity, 和 fontSize
        const svgRes = (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="300px"
                height="180px"
                viewBox="0 0 300 180"
            >
                <text
                    x="-160"
                    y="-30"
                    fill={props.fillColor || '@text-color-secondary'}
                    transform="rotate(-35 220 -220)"
                    fillOpacity={props.fillOpacity || '0.1'}
                    fontSize={`${props.fontSize || '28'}px`}
                >
                    {' '}
                    {props.text}
                </text>
            </svg>
        )
        // 将 SVG 元素渲染为字符串，并创建一个包含该字符串的 Blob URL
        return URL.createObjectURL(
            new Blob([renderToString(svgRes)], {
                type: 'image/svg+xml'
            })
        )
    }, [props]) // 依赖项为所有的 props，当 props 变化时，重新生成 svgUrl

    // 返回一个 div，设置背景图为生成的 SVG URL，并渲染子组件内容
    return (
        <div className={'water-maker'} style={{ backgroundImage: `url(${svgUrl})` }}>
            {props.children}
        </div>
    )
}

// 使用 React.memo 来优化组件性能，只有在 props 变化时才重新渲染组件
export default memo(Index)

