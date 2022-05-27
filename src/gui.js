import GUI from 'lil-gui'
import { MathUtils } from 'three'
import { addDroplets } from './meshes'

function addGUI(scene, config, refractionCamera) {
    const gui = new GUI()

    const param = {
        rampAngle: 60,
    }

    gui.add(param, 'rampAngle', 0.1, 90).onChange(() => {
        config.rampAngle = MathUtils.degToRad(param.rampAngle)

        const ramp = scene.getObjectByName('ramp')
        ramp.rotation.x = Math.PI * -0.5 + config.rampAngle

        const droplets = scene.getObjectByName('droplets')
        scene.remove(droplets)
        addDroplets(scene, config, refractionCamera)
    })
}

export { addGUI }
