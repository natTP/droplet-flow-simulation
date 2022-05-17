import { Vector3, Color } from 'three'

// TODO
export default class Droplet {
    constructor(index, buffers, density) {
        this.index = index
        this.buffers = buffers
        this.density = density

        this.mass = 0
        this.position = new Vector3()
        this.velocity = new Vector3()
        this.acceleration = new Vector3()
        this.color = new Color()

        this.init()
        this.update()
    }

    init() {
        // init color
        // random scale, mass is directly mapped to scale (e.g. 1 = 5g)
        // random initial position on ramp -> model with plane
        // initial velocity is 0
    }

    update() {
        // based on basic F = ma, with g and friction considered
        // constrain position to only be on this plane
    }
}
