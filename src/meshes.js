import {
    PlaneGeometry,
    MeshPhongMaterial,
    DoubleSide,
    Mesh,
    BoxGeometry,
} from 'three'
import InstancedDroplets from './instancedDroplets'
import { loadPlaneTexture } from './utils/loadTexture'

function addPlaneMesh(scene, planeSize) {
    const geometry = new PlaneGeometry(planeSize, planeSize)
    const material = new MeshPhongMaterial({
        map: loadPlaneTexture(planeSize),
        side: DoubleSide,
    })
    const planeMesh = new Mesh(geometry, material)
    planeMesh.name = 'plane'
    planeMesh.rotation.x = Math.PI * -0.5
    scene.add(planeMesh)
}

function addRampMesh(scene, width, length, angle) {
    const geometry = new BoxGeometry(width, length, 0.01)
    const material = new MeshPhongMaterial({ color: 0x2e3047 })
    const rampMesh = new Mesh(geometry, material)
    rampMesh.rotation.x = Math.PI * -0.5 + angle
    rampMesh.name = 'ramp'
    scene.add(rampMesh)
}

function addDroplets(scene, config, refractionCamera) {
    const dropletsMesh = new InstancedDroplets(config, refractionCamera)
    dropletsMesh.name = 'droplets'
    scene.add(dropletsMesh)
}

export { addPlaneMesh, addRampMesh, addDroplets }
