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
import { createPlaneMesh } from './meshes'

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

    /* Setup Stats which shows fps */
    stats = new Stats()
    canvas.appendChild(stats.dom)

    /* Create the floor */
    const planeMesh = createPlaneMesh(40)
    scene.add(planeMesh)

    /* Add lighting */
    const light = new AmbientLight(0xffffff, 1)
    scene.add(light)

    // TODO : Particles
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
    const time = clock.getDelta()
    // TODO: do something
    renderer.render(scene, camera)
}
