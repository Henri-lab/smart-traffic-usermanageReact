import { connect } from 'http2'
import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

const ParticleBackground = () => {
    const sceneRef = useRef(null) //用于在函数组件中保存 Three.js 场景的 DOM 元素引用

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
        sceneRef.current.appendChild(renderer.domElement)

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

    return <div ref={sceneRef} />
}

export default connect((state, {}))(ParticleBackground)
