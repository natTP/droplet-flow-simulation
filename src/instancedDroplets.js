import {
    Mesh,
    ShaderMaterial,
    InstancedBufferGeometry,
    InstancedBufferAttribute,
    SphereGeometry,
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
            mRefractionRatio: { type: 'f', value: 1.33 }, // material
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
    }

    init() {
        /* Create geometry */
        const geometry = new InstancedBufferGeometry().copy(
            this.getBaseGeometry()
        )
        const numInstances = this.config.numInstances
        geometry.instanceCount = numInstances

        /* Create buffers */
        const offsets = new Float32Array(numInstances * 3)
        const scales = new Float32Array(numInstances)
        geometry.setAttribute(
            'offset',
            new InstancedBufferAttribute(offsets, 3, false)
        )
        geometry.setAttribute(
            'scale',
            new InstancedBufferAttribute(scales, 1, false)
        )

        this.geometry = geometry

        /* Create droplet objects, write to buffers when each droplet is created */
        for (let i = 0; i < numInstances; i++) {
            this.droplets.push(
                new Droplet(i, this.config, {
                    position: offsets,
                    scale: scales,
                })
            )
        }
    }

    update(t) {
        for (let i = 0; i < this.config.numInstances; i++) {
            this.droplets[i].update(t)
        }
        this.geometry.attributes.offset.needsUpdate = true
    }

    getBaseGeometry() {
        const rampAngle = this.config.rampAngle
        return new SphereGeometry(0.2, 8, 6, 0, Math.PI, 0, Math.PI).rotateX(
            -Math.PI * 0.5 + rampAngle
        )
    }
}
