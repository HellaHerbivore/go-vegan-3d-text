import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/Addons.js';
import { TextGeometry } from 'three/examples/jsm/Addons.js';


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Axes Helper
// const axesHelper = new THREE.AxesHelper(5);
// axesHelper
// scene.add(axesHelper);


/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight();
// ambientLight.color = new THREE.Color("#ffffe2");
// ambientLight.intensity = 1.9;
// scene.add(ambientLight);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const _textTextureMatCap = textureLoader.load("/textures/matcaps/7.png");
_textTextureMatCap.colorSpace = THREE.SRGBColorSpace;

const _donutTextureMatCap = textureLoader.load("/textures/matcaps/9.png");
_donutTextureMatCap.colorSpace = THREE.SRGBColorSpace;


/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load
(
    "/fonts/Parkinsans Light_Regular.json",
    (font) =>
    {
        const textGeometry = new TextGeometry(
            "Go Vegan",
            {
                font: font,
                size: 0.5,
                depth: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4 
            }
        )
        textGeometry.center();

        const textMaterial = new THREE.MeshMatcapMaterial();
        textMaterial.matcap = _textTextureMatCap;
        textMaterial.wireframe = false;
        const text = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(text);
    }
)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Objects
 */


const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 12, 48);
const donutMaterial = new THREE.MeshMatcapMaterial({matcap: _donutTextureMatCap});


for(let i = 0; i < 1000; i++)
{
    const donutMesh = new THREE.Mesh(donutGeometry, donutMaterial);

    donutMesh.position.x = (Math.random() - 0.5) * 20;
    donutMesh.position.y = (Math.random() - 0.5) * 20;
    donutMesh.position.z = (Math.random() - 0.5) * 20;

    donutMesh.rotation.x = Math.random() * Math.PI;
    donutMesh.rotation.y = Math.random() * Math.PI;

    const randomScale = Math.random();

    donutMesh.scale.set(randomScale, randomScale, randomScale)

    scene.add(donutMesh);
}




/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()