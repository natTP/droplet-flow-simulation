import {
    Clock,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    WebGLCubeRenderTarget,
    CubeCamera,
    CubeRefractionMapping,
} from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { addDroplets, addPlaneMesh, addRampMesh } from './meshes'
import { addAxesHelper } from './utils/addHelper'
import { addLights } from './lights'
import { addGUI } from './gui'
import { loadBackground } from './utils/loadTexture'

let renderer, camera, refractionCamera, scene, stats
const clock = new Clock()
let config = {
    planeSize: 40,
    rampWidth: 30,
    rampHeight: 10,
    rampAngle: Math.PI * 0.3, // rad
    numInstances: 100,
    gravity: 9.8, // m/s2
    staticFriction: 0.94,
    dynamicFriction: 0.4,
}

init()
animate()

function init() {
    /* Setup canvas, scene, camera */
    const canvas = document.querySelector('#c')
    scene = new Scene()
    scene.background = loadBackground()
    camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    )
    camera.position.set(20, 10, 5)
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

    /* Add lighting and helpers*/
    addLights(scene)
    addAxesHelper(scene, 30)

    /* Populate the scene with stuff */
    addPlaneMesh(scene, config.planeSize)
    addRampMesh(
        scene,
        config.rampWidth,
        config.rampHeight * 2,
        config.rampAngle
    )

    /* Setup a CubeCamera to use for environment mapping, then add droplets to scene */
    const cubeRenderTarget = new WebGLCubeRenderTarget(128)
    cubeRenderTarget.texture.mapping = CubeRefractionMapping
    refractionCamera = new CubeCamera(0.1, 1000, cubeRenderTarget)
    refractionCamera.position.set(0, 0, 1)
    scene.add(refractionCamera)
    addDroplets(scene, config, refractionCamera)

    /* Add GUI */
    addGUI(scene, config, refractionCamera)
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
    const time = clock.getElapsedTime() * 0.0001 // seconds

    const droplets = scene.getObjectByName('droplets')
    droplets.update(time)

    droplets.visible = false
    refractionCamera.update(renderer, scene)
    droplets.visible = true

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
