import GUI from 'lil-gui'
import { MathUtils } from 'three'
import { addDroplets, addRampMesh } from './meshes'

function addGUI(scene, config, refractionCamera) {
    const gui = new GUI()
    const light = scene.getObjectByName('light')

    const updateLight = () => {
        light.target.updateMatrixWorld()
        scene.getObjectByName('lightHelper').update()
    }

    const resetDroplets = () => {
        const droplets = scene.getObjectByName('droplets')
        scene.remove(droplets)
        addDroplets(scene, config, refractionCamera)
    }

    const param = {
        reset: resetDroplets,
        numInstances: config.numInstances,
        gravity: config.gravity,
        rampHeight: config.rampHeight,
        rampAngle: MathUtils.radToDeg(config.rampAngle),
        rampColor: 0x2e3047,
        staticFriction: config.staticFriction,
        dynamicFriction: config.dynamicFriction,
    }

    gui.add(param, 'reset').name('Restart Simulation')

    gui.add(param, 'numInstances')
        .name('Number of droplets')
        .onChange(() => {
            config.numInstances = param.numInstances
            resetDroplets()
        })

    gui.add(param, 'gravity', 1, 50)
        .name('Gravity (m/s2)')
        .onChange(() => {
            config.gravity = param.gravity
            resetDroplets()
        })

    const rampFolder = gui.addFolder('Ramp configuration')
    rampFolder
        .add(param, 'rampHeight', 5, 50)
        .name('Height')
        .onChange(() => {
            config.rampHeight = param.rampHeight
            const ramp = scene.getObjectByName('ramp')
            scene.remove(ramp)
            addRampMesh(
                scene,
                config.rampWidth,
                config.rampHeight * 2,
                config.rampAngle
            )
            resetDroplets()
        })
    rampFolder
        .add(param, 'rampAngle', 0.1, 90)
        .name('Angle (deg)')
        .onChange(() => {
            config.rampAngle = MathUtils.degToRad(param.rampAngle)

            const ramp = scene.getObjectByName('ramp')
            ramp.rotation.x = Math.PI * -0.5 + config.rampAngle

            resetDroplets()
        })
    rampFolder
        .addColor(param, 'rampColor')
        .name('Color')
        .onChange(() => {
            const ramp = scene.getObjectByName('ramp')
            ramp.material.color.set(param.rampColor)
        })
    rampFolder
        .add(param, 'staticFriction')
        .name('Static friction coefficient')
        .onChange(() => {
            config.staticFriction = param.staticFriction
            resetDroplets()
        })
    rampFolder
        .add(param, 'dynamicFriction')
        .name('Dynamic friction coefficient')
        .onChange(() => {
            config.dynamicFriction = param.dynamicFriction
            resetDroplets()
        })

    const lightFolder = gui.addFolder('Light source position')
    lightFolder.add(light.position, 'x', -10, 10).onChange(updateLight)
    lightFolder.add(light.position, 'y', 0, 10).onChange(updateLight)
    lightFolder.add(light.position, 'z', -10, 10).onChange(updateLight)
}

export { addGUI }
