import {
    PlaneGeometry,
    MeshPhongMaterial,
    DoubleSide,
    Mesh,
    BufferGeometry,
    Float32BufferAttribute,
    PointsMaterial,
    Points,
} from 'three'
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

function addParticles(scene, particleCount) {
    const geometry = new BufferGeometry()
    const vertices = []
    for (let i = 0; i < particleCount; i++) {
        const x = 40 * Math.random() - 20
        const y = 20 * Math.random()
        const z = 40 * Math.random() - 20
        vertices.push(x, y, z)
    }
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))

    const material = new PointsMaterial({
        size: 1,
        sizeAttenuation: true,
        color: 0xff8cde,
    })

    const particles = new Points(geometry, material)
    particles.name = 'particles'

    scene.add(particles)
}

export { addPlaneMesh, addParticles }
