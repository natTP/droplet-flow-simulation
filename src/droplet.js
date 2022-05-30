import { Vector3, MathUtils } from 'three'

export default class Droplet {
    constructor(index, config, buffers) {
        this.index = index
        this.config = config
        this.buffers = buffers

        /* Where data is located in buffers */
        this.offset = {
            position: index * 3,
            scale: index,
        }

        /* An arrow's properties, which directly correspond to the buffer values */
        this.scale = 0
        this.position = new Vector3()
        this.velocity = new Vector3() // m/s
        this.acceleration = new Vector3() // m/s2

        this.init()
    }

    init() {
        /* Random position -> write to buffer */
        const rampWidth = this.config.rampWidth,
            rampHeight = this.config.rampHeight,
            rampAngle = this.config.rampAngle,
            gravity = this.config.gravity
        const x = MathUtils.randFloat(-rampWidth / 2, rampWidth / 2)
        const y = MathUtils.randFloat(0, rampHeight * Math.sin(rampAngle))
        const z = -y / Math.tan(rampAngle)
        this.position.set(x, y, z)
        this.buffers.position.set([x, y, z], this.offset.position)

        /* Random scale -> write to buffer */
        const scale = MathUtils.randFloat(0.1, 1)
        this.scale = scale
        this.buffers.scale.set([scale], this.offset.scale)

        /* Initial velocity is in the ramp direction, acceleration is constant */
        this.velocity.set(0, -Math.sin(rampAngle), Math.cos(rampAngle))

        const friction = new Vector3(
            0,
            Math.sin(rampAngle),
            -Math.cos(rampAngle)
        ).multiplyScalar(
            this.config.dynamicFriction * gravity * Math.cos(rampAngle)
        )

        this.acceleration = new Vector3(0, -gravity, 0).sub(friction)
    }

    update(dt) {
        /* ฺBased on basic F = ma, with g and friction considered
        constrain position to only be on this plane */
        if (Math.tan(this.config.rampAngle) > this.config.staticFriction) {
            if (this.position.y > 0) {
                this.velocity.add(this.acceleration.clone().multiplyScalar(dt))
                this.position.add(this.velocity.clone().multiplyScalar(dt))
                this.position.setZ(
                    -this.position.y / Math.tan(this.config.rampAngle)
                )
            }
            if (this.position.y < 0) {
                this.position.setY(0)
                this.position.setZ(MathUtils.randFloat(0, 0.2))
            }

            this.position.toArray(this.buffers.position, this.offset.position)
        }
    }
}
