import { AxesHelper, DirectionalLightHelper } from 'three'

function addAxesHelper(scene, axesSize) {
    const axesHelper = new AxesHelper(axesSize)
    scene.add(axesHelper)
}

function addDirectionalLightHelper(scene, light) {
    const helper = new DirectionalLightHelper(light)
    scene.add(helper)
}

export { addAxesHelper, addDirectionalLightHelper }
