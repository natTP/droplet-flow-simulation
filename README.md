# Simulation of liquid droplets on a smooth surface with Three.js

_2110514 Realtime Computer Graphics and Physics Simulation, Semester 2, Academic Year 2021 Chulalongkorn University_

This project attempts to simulate the appearance and motion of liquid droplets on a smooth ramped surface from scratch using Three.js. The scene consists of a plane, and a ramp on which droplets of random size are randomly spawned. Multiple parameters can be adjusted as follows:

- Number of droplets (default is 100)
- Gravity, in direction -y (default is 9.8 m/s2)
- Ramp height (default is 10 units)
- Ramp angle (default is 54 degrees)
- Ramp color
- The static friction coefficient μs and the dynamic friction coefficient μd of the ramp surface (defaults are 0.94 and 0.4 respectively)
- Position of the light source

The simulation is available at https://nattp.github.io/droplet-flow-simulation.

Build configurations courtesy of https://github.com/designcourse/threejs-webpack-starter.

## Implementation Overview

The droplets are created by instancing, with each instance having a varying position and scale. Each droplet’s geometry is modeled as a half sphere with a custom shader applied to the material to simulate reflection and refraction according to the Fresnel effect. The surrounding skybox environment and adjustable ramp color are added to make this refraction effect clearly visible.

Only gravity and friction are considered for the droplet physics. Due to this, acceleration is constant and depends on the friction coefficients and ramp angle. Velocity is updated in every frame by incrementing and position is updated from velocity. Droplets are constrained to appear and move only on the ramp plane.

## Droplet Instancing

Instancing is a technique used to efficiently render multiple instances of the same geometry when each instance shares the same base geometry and material but differs in transformations. The data of all instances are kept in the same mesh and the data is sent to the GPU only once, allowing for less strain on performance [[1](https://velasquezdaniel.com/blog/rendering-100k-spheres-instantianing-and-draw-calls/)]. 

Here, our droplets are all in one single mesh we call an `InstancedDroplets` class. This mesh has a geometry of `THREE.InstancedBufferGeometry` which uses a half sphere shape as the base geometry. On initialization of the `InstancedDroplets` class, buffers are created to store the offset (position) and scale of each instance, then `offset` and `scale` are added as attributes to the geometry. To perform instancing, the GPU accesses these buffers to get the attributes of each instance and uses these values in the shader. 

The last step of initialization is to create the `Droplets`. The `Droplet` class is used to update the velocity and position of each droplet [[2](https://codepen.io/usefulthink/pen/YNrvpY?editors=0010)]. The buffers are not yet filled in until we initialize each `Droplet` object with a random position on the plane and a random scale between 0.1 and 1 and write these values to the buffers. See the source code for [instancedDroplets.js](https://github.com/natTP/droplet-flow-simulation/blob/main/src/instancedDroplets.js) and [droplet.js](https://github.com/natTP/droplet-flow-simulation/blob/main/src/droplet.js) for the implementation.

![Realtime CG Report - Page 1](https://user-images.githubusercontent.com/57129145/190899197-687b2e78-47ef-4309-a648-aba6500a91b4.png)

To constraint every droplet to the plane, we randomize x and y in the valid range, then calculate z from the plane equation:

$ycos\theta + zsin\theta = 0$
Thus $z = \frac{-y}{tan\theta}$.

## Fresnel Shader

The material used for `InstancedDroplets` is a `THREE.ShaderMaterial`, with custom GLSL vertex shaders and fragment shaders supplied. The shaders are adjusted from stemkoski's Three.js demo [[3](https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/js/shaders/FresnelShader.js)]. The intention is to use this shader to create a reflection and refraction effect resembling a transparent drop of water.

First, a cube map is created to be passed to the shader. This is done by using a `THREE.CubeCamera` positioned at (0,0,1). The cube camera renders images of the environment in 6 directions to a render target, which is set to the `CubeRefractionMapping` mode supplied by Three.js. The texture we get from the cube camera is passed to the shader as a uniform, along with other constants such as the refraction ratio (set to 1.33 for water) and constants for the approximated Fresnel equation.

In the vertex shader, the transformed position of each vertex is calculated by making use of the offset and scale supplied in the buffers. Reflection and refraction vectors, which are used to determine the position of the texture to sample from for that vertex, are also calculated in the vertex shader along with the reflection factor. An approximation of the Fresnel equation is used to find the reflection factor, which determines the fraction between reflection and refraction at each vertex [[4](https://developer.download.nvidia.com/CgTutorial/cg_tutorial_chapter07.html)]:

𝑟𝑒𝑓𝑙𝑒𝑐𝑡𝑖𝑜𝑛𝐹𝑎𝑐𝑡𝑜𝑟 = 𝑏𝑖𝑎𝑠 + 𝑠𝑐𝑎𝑙𝑒 ∗ (1.0 + 𝐼 ∙ 𝑁)𝑝𝑜𝑤𝑒𝑟

When I is the vector from camera to the position in world space, and N is the surface normal in world space.

The fragment shader calculates the color at each vertex by sampling our cube texture from previously. The reflected color and refracted color are sampled from the cube texture at the position of the reflection and refraction vectors respectively, and then the colors are interpolated according to the fraction given by the reflection factor. The implementation can be found at [dropletShaders.js](https://github.com/natTP/droplet-flow-simulation/blob/main/src/dropletShaders.js).

## Droplet Physics

Physics is implemented in the `Droplet` class. Each droplet has its own scale, position, velocity, and acceleration. Here we do not consider any collision yet, so scale is not used in the physical aspects of the simulation.

![Realtime CG Report - Page 2](https://user-images.githubusercontent.com/57129145/190899698-c2d019a8-526c-4a5e-b653-c1b367a19f10.png)

Velocity is initialized to 𝑣(0, −sin𝜃, 𝑐𝑜𝑠𝜃) when 𝜃 is the ramp angle, thus the velocity will be in the direction of the ramp surface. Meanwhile, acceleration is set to a constant value that also depends on the ramp angle by the following calculation.

![image](https://user-images.githubusercontent.com/57129145/190899751-9e63cc80-69a7-4576-95cd-ffbee1bef930.png)

Due to static friction, if the pull of gravity in the ramp surface direction 𝑚𝑔𝑠𝑖𝑛𝜃 does not exceed 𝜇𝑠𝑁 = 𝜇𝑠𝑚𝑔𝑐𝑜𝑠𝜃, the droplets will not move. We will only update the velocity and position if 𝑚𝑔𝑠𝑖𝑛𝜃 > 𝜇𝑠𝑚𝑔𝑐𝑜𝑠𝜃 , which is simplified to 𝑡𝑎𝑛𝜃 > 𝜇𝑠 . The velocity and position of each droplet are updated in every frame with the following equations.

$\vec{v}_{new} = \vec{v}_{old} + \vec{a}(dt)$

$\vec{x}_{new} = \vec{x}_{old} + \vec{v}_new(dt)$

The droplet is constrained to always be on the ramp by assigning z that corresponds to the calculated x and y according to the plane equation:

$ycos\theta + zsin\theta = 0$
Thus $z = \frac{-y}{tan\theta}$.

We also constrain y to not drop beyond 0. See the source code for [droplet.js](https://github.com/natTP/droplet-flow-simulation/blob/main/src/droplet.js) for the implementation.

## Resources
### Instancing
[1] https://velasquezdaniel.com/blog/rendering-100k-spheres-instantianing-and-draw-calls/

[2] https://codepen.io/usefulthink/pen/YNrvpY?editors=0010

### Fresnel Shader
[3] https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/js/shaders/FresnelShader.js

[4] https://developer.download.nvidia.com/CgTutorial/cg_tutorial_chapter07.html
