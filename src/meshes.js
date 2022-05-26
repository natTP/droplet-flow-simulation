import {
    PlaneGeometry,
    MeshPhongMaterial,
    DoubleSide,
    Mesh,
    BufferGeometry,
    Float32BufferAttribute,
    BoxGeometry,
    InstancedBufferGeometry,
    InstancedBufferAttribute,
    ShaderMaterial,
} from 'three'
import Droplet from './droplet'
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
    const material = new MeshPhongMaterial({ color: 0x34cceb })
    const rampMesh = new Mesh(geometry, material)
    rampMesh.rotation.x = Math.PI * -0.5 + angle
    rampMesh.name = 'ramp'
    scene.add(rampMesh)
}

/* Create instances of droplets which are controlled by instance-atrributes.
A mesh will keep the instance-attributes, and we will render droplets based on 
the values found in these buffers. */
// TODO : Custom shader, change attribute name from position to ioffset -> without shader this won't work
function addDroplets(scene, numInstances, density, droplets) {
    const iOffsets = new Float32Array(numInstances * 3)
    const iScales = new Float32Array(numInstances * 1).fill(1)

    const geometry = new InstancedBufferGeometry().copy(Droplet.getGeometry())
    geometry.instanceCount = Infinity
    geometry.setAttribute('iScale', new InstancedBufferAttribute(iScales, 1))

    const material = Droplet.getMaterial()

    for (let idx = 0; idx < numInstances; idx++) {
        droplets.push(
            new Droplet(idx, density, {
                iOffset: iOffsets,
                iScale: iScales,
            })
        )
    }

    const dropletsMesh = new Mesh(geometry, material)
    dropletsMesh.name = 'droplets'
    scene.add(dropletsMesh)
}

export { addPlaneMesh, addRampMesh, addDroplets }
