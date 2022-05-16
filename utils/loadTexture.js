import { TextureLoader, RepeatWrapping, NearestFilter } from 'three'

function loadPlaneTexture(planeSize) {
    const texture = new TextureLoader().load('../assets/checker.png')
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.magFilter = NearestFilter
    texture.repeat.set(planeSize / 2, planeSize / 2)
    return texture
}

export { loadPlaneTexture }
