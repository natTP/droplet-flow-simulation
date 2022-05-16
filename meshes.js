import { PlaneGeometry, MeshPhongMaterial, DoubleSide, Mesh } from 'three'
// import { loadPlaneTexture } from './utils/loadTexture'

function createPlaneMesh(planeSize) {
    const geometry = new PlaneGeometry(planeSize, planeSize)
    // const material = new MeshPhongMaterial({ color: 0x123456 })
    const material = new MeshPhongMaterial({
        map: loadPlaneTexture(planeSize),
        side: DoubleSide,
    })
    const planeMesh = new Mesh(geometry, material)
    planeMesh.rotation.x = Math.PI * -0.5

    return planeMesh
}

export { createPlaneMesh }
