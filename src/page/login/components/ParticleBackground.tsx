import { connect } from 'http2'
import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { setParticles } from '../../../redux/modules/background/action'

type sceneRefType = HTMLDivElement | null;
const ParticleBackground = () => {
    const sceneRef = useRef<sceneRefType>(null) //用于在函数组件中保存 Three.js 场景的 DOM 元素引用

    // useEffect 是 React 中处理副作用操作的重要工具，它使得在函数式组件中可以方便地进行数据获取、订阅事件、
    // 手动操作 DOM 等操作，并且提供了灵活的控制机制，通过依赖项数组和清理函数来精确地管理副作用的执行时机和清理行为。
    useEffect(() => {
        // 初始化 Three.js 场景
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(window.innerWidth, window.innerHeight)
        sceneRef.current && sceneRef.current.appendChild(renderer.domElement)

        // 创建粒子系统
        const geometry = new THREE.Geometry()
        const material = new THREE.PointsMaterial({ size: 1, color: 0xffffff })

        for (let i = 0; i < 1000; i++) {
            const vertex = new THREE.Vector3()
            vertex.x = Math.random() * 2000 - 1000
            vertex.y = Math.random() * 2000 - 1000
            vertex.z = Math.random() * 2000 - 1000
            geometry.vertices.push(vertex)
        }

        const particles = new THREE.Points(geometry, material)
        scene.add(particles)

        // 设置相机位置
        camera.position.z = 1000

        // 动画循环
        const animate = () => {
            requestAnimationFrame(animate)

            particles.rotation.x += 0.005
            particles.rotation.y += 0.005

            renderer.render(scene, camera)
        }

        animate()

        // 清理函数
        // 在组件卸载时清理 Three.js 相关资源，包括取消动画循环、移除事件监听器以及释放材质和渲染器资源。
        return () => {
            scene.remove(particles)
            geometry.dispose()
            material.dispose()
            renderer.dispose()
        }
    }, [])

    return <div className="bg-particle" ref={sceneRef} />
}

export default connect((state) => state.background, { setParticles })(ParticleBackground) //使用 connect 函数将 ParticleBackground 组件与 Redux store 连接起来，最终生成一个新的组件，该组件可以访问 Redux store 中的状态和 actions。
// const mapStateToProps = (state /*connect传入 */) => ({
//     //state 是指整个 Redux store 的状态树
//     //将 Redux store 中的 particles 状态映射到组件的 props 中
//     particles: state.particles
// })

// const mapDispatchToProps = {
//     //将 setParticles action 映射到组件的 props 中，使得组件可以通过调用 setParticles 来派发该 action。
//     setParticles
// }
