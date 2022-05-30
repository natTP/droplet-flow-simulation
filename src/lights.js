import { AmbientLight, DirectionalLight } from 'three'
import { addDirectionalLightHelper } from './utils/addHelper'

function addLights(scene) {
    const ambientLight = new AmbientLight(0xffffff, 0.5)

    const directionalLight = new DirectionalLight(0xffffff, 0.5)
    directionalLight.name = 'light'
    directionalLight.position.set(0, 10, 5)
    directionalLight.target.position.set(0, 0, 0)

    scene.add(ambientLight, directionalLight, directionalLight.target)
    addDirectionalLightHelper(scene, directionalLight)
}

export { addLights }
