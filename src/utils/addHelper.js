import { AxesHelper } from 'three'

function addAxesHelper(scene, axesSize) {
    const axesHelper = new AxesHelper(axesSize)
    scene.add(axesHelper)
}

export { addAxesHelper }
