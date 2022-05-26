import { Vector3, SphereGeometry, BufferGeometry, ShaderMaterial } from 'three'

// TODO Physics
export default class Droplet {
    constructor(index, density, buffers) {
        this.index = index
        this.density = density
        this.buffers = buffers

        this.mass = 0
        this.position = new Vector3()
        this.velocity = new Vector3()
        this.acceleration = new Vector3()

        this.init()
        this.update()
    }

    init() {
        // random scale, mass is directly mapped to scale (e.g. 1 = 5g)
        // density = mass / volume (scale)
        // random initial position on ramp -> model with plane
        // initial velocity is 0
    }

    update() {
        // based on basic F = ma, with g and friction considered
        // constrain position to only be on this plane
    }

    // TODO : Get geometry & material
    static getGeometry() {
        return new SphereGeometry(1)
    }

    static getMaterial() {
        const fragmentShader = `
        void main(){
            gl_FragColor = vec4(1.);
        }
        `

        const vertexShader = `
        #define PI 3.14159265359
        attribute float iScale;
        void main(){
            vec3 transformed = position.xyz;
            transformed *= iScale;
            gl_Position = projectionMatrix* modelViewMatrix * vec4(transformed, 1.);
        }
        `
        return new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {},
        })
    }
}
