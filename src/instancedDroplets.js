import {
    Mesh,
    ShaderMaterial,
    InstancedBufferGeometry,
    InstancedBufferAttribute,
    SphereGeometry,
    MathUtils,
} from 'three'
import Droplet from './droplet'
import { vertexShader, fragmentShader } from './dropletShaders'

/* Create instances of droplets which are controlled by instance-atrributes.
This mesh will keep the instance-attributes, and we will render droplets based on 
the values found in these buffers. */
export default class InstancedDroplets extends Mesh {
    constructor(config, refractionCamera) {
        super()
        this.config = config
        this.droplets = []
        this.uniforms = {
            mRefractionRatio: { type: 'f', value: 1.02 }, // material
            mFresnelBias: { type: 'f', value: 0.1 },
            mFresnelPower: { type: 'f', value: 2.0 },
            mFresnelScale: { type: 'f', value: 1.0 },
            tCube: { type: 't', value: refractionCamera.renderTarget.texture }, // texture
        }
        this.material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: this.uniforms,
        })

        this.init()
        this.update()
    }

    init() {
        /* Create geometry */
        const geometry = new InstancedBufferGeometry().copy(
            this.getBaseGeometry()
        )
        const numInstances = this.config.numInstances
        geometry.instanceCount = numInstances

        const offsets = []
        const scales = []
        for (let i = 0; i < numInstances; i++) {
            const rampWidth = this.config.rampWidth,
                rampHeight = this.config.rampHeight,
                rampAngle = this.config.rampAngle
            const x = MathUtils.randFloat(-rampWidth / 2, rampWidth / 2)
            const y = MathUtils.randFloat(0, rampHeight * Math.sin(rampAngle))
            const z = -y / Math.tan(rampAngle)
            const scale = MathUtils.randFloat(0.1, 1)

            offsets.push(x, y, z)
            scales.push(scale)
        }

        geometry.setAttribute(
            'offset',
            new InstancedBufferAttribute(new Float32Array(offsets), 3, false)
        )
        geometry.setAttribute(
            'scale',
            new InstancedBufferAttribute(new Float32Array(scales), 1, false)
        )

        this.geometry = geometry

        /* Create droplet objects corresponding to the buffers */
        for (let i = 0; i < numInstances; i++) {
            this.droplets.push(
                new Droplet(i, this.config.liquidDensity, {
                    offset: offsets,
                    scale: scales,
                })
            )
        }
    }

    update() {
        for (let i = 0; i < this.config.numInstances; i++) {
            this.droplets[i].update()
        }
    }

    getBaseGeometry() {
        const rampAngle = this.config.rampAngle
        return new SphereGeometry(0.2, 8, 6, 0, Math.PI, 0, Math.PI).rotateX(
            -Math.PI * 0.5 + rampAngle
        )
    }
}
