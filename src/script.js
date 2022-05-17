import {
    AmbientLight,
    Clock,
    Color,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { addParticles, addPlaneMesh } from './meshes'
import { addAxesHelper } from './utils/addHelper'

let renderer, camera, scene, stats
const clock = new Clock()

init()
animate()

function init() {
    /* Setup canvas, scene, camera */
    const canvas = document.querySelector('#c')
    scene = new Scene()
    scene.background = new Color(0x000104)
    camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    )
    camera.position.set(0, 10, 20)
    camera.lookAt(scene.position)

    /* Setup responsive renderer */
    renderer = new WebGLRenderer({ canvas })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    window.addEventListener('resize', onWindowResize)

    /* Setup OrbitControls which lets the user spin around a point */
    const controls = new OrbitControls(camera, canvas)
    controls.target.set(0, 5, 0)
    controls.update()

    /* Setup Stats panels next to each other */
    stats = new Stats()
    const panels = [0, 1, 2] // 0: fps, 1: ms, 2: mb
    Array.from(stats.domElement.children).forEach((child, index) => {
        child.style.display = panels.includes(index) ? 'inline-block' : 'none'
    })
    document.body.appendChild(stats.domElement)

    /* Add lighting */
    const light = new AmbientLight(0xffffff, 1)
    scene.add(light)

    /* Populate the scene with stuff */
    addPlaneMesh(scene, 40)
    addParticles(scene, 100)

    /* Add helpers */
    addAxesHelper(scene, 30)
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
    requestAnimationFrame(animate)
    render()
    stats.update()
}

function render() {
    const time = clock.getElapsedTime() * 0.05

    const particles = scene.getObjectByName('particles')
    const h = ((360 * (1.0 + time)) % 360) / 360
    particles.material.color.setHSL(h, 0.5, 0.5)
    particles.material.size = 0.3 * Math.sin(10 * time) + 0.5
    particles.rotation.y = time

    renderer.render(scene, camera)

    /* Setup devtools */
    if (typeof __THREE_DEVTOOLS__ !== 'undefined') {
        __THREE_DEVTOOLS__.dispatchEvent(
            new CustomEvent('observe', { detail: scene })
        )
        __THREE_DEVTOOLS__.dispatchEvent(
            new CustomEvent('observe', { detail: renderer })
        )
    }
}
