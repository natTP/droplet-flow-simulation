/*
Shader from https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/js/shaders/FresnelShader.js

Note, these uniforms and attributes are supplied by default in Threejs:

  // = object.matrixWorld 
  // Converts a position vec4 from local obj space -> world space
  // by applying transformations to the object
  uniform mat4 modelMatrix;

  // = camera.matrixWorldInverse
  // Converts a position vec4 from wrold space -> camera/eye space
  // by applying the camera transformations
  uniform mat4 viewMatrix;

  // = camera.projectionMatrix
  // Converts a position vec4 from camera/eye space -> projection space
  // by applying perspective transformations
  uniform mat4 projectionMatrix;

  // = camera.matrixWorldInverse * object.matrixWorld
  uniform mat4 modelViewMatrix;

  // = inverse transpose of modelViewMatrix
  uniform mat3 normalMatrix;

  // = camera position in world space
  uniform vec3 cameraPosition;
  
  // default vertex attributes provided by Geometry and BufferGeometry
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;

  src : https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
  */

const vertexShader = /* glsl */ `
  uniform float mRefractionRatio;
  uniform float mFresnelBias;
  uniform float mFresnelPower;
  uniform float mFresnelScale;

  varying vec3 vReflect;
  varying vec3 vRefract[3];
  varying float vReflectionFactor;

  attribute vec3 offset;
  attribute float scale;

  void main(){
    vec3 transformed = (position + offset) * scale;

    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
    vec3 I = worldPosition.xyz - cameraPosition;

    vReflect = reflect(I, worldNormal);
		vRefract[0] = refract(normalize(I), worldNormal, mRefractionRatio);
	  vRefract[1] = refract(normalize(I), worldNormal, mRefractionRatio * 0.99);
		vRefract[2] = refract(normalize(I), worldNormal, mRefractionRatio * 0.98);
		vReflectionFactor = mFresnelBias + mFresnelScale * pow(1.0 + dot(normalize(I), worldNormal), mFresnelPower);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform samplerCube tCube;

  varying vec3 vReflect;
  varying vec3 vRefract[3];
  varying float vReflectionFactor;

  void main(){
    vec4 reflectedColor = textureCube(tCube, vec3(-vReflect.x, vReflect.yz));
	
    vec4 refractedColor = vec4(1.0);
		refractedColor.r = textureCube(tCube, vec3(-vRefract[0].x, vRefract[0].yz)).r;
	  refractedColor.g = textureCube(tCube, vec3(-vRefract[1].x, vRefract[1].yz)).g;
		refractedColor.b = textureCube(tCube, vec3(-vRefract[2].x, vRefract[2].yz)).b;

		gl_FragColor = mix(refractedColor, reflectedColor, clamp(vReflectionFactor, 0.0, 1.0));
  }
`

export { vertexShader, fragmentShader }
