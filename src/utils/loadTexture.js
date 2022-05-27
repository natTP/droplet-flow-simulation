import {
    TextureLoader,
    CubeTextureLoader,
    RepeatWrapping,
    NearestFilter,
} from 'three'

function loadPlaneTexture(planeSize) {
    const texture = new TextureLoader().load('./assets/checker.png')
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.magFilter = NearestFilter
    texture.repeat.set(planeSize / 2, planeSize / 2)
    return texture
}

function loadBackground() {
    const texture = new CubeTextureLoader().load([
        './assets/px.png',
        './assets/nx.png',
        './assets/py.png',
        './assets/ny.png',
        './assets/pz.png',
        './assets/nz.png',
    ])
    return texture
}

export { loadPlaneTexture, loadBackground }
