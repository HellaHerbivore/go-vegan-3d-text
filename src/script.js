import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/Addons.js';
import { TextGeometry } from 'three/examples/jsm/Addons.js';


/**
 * Base
 */
// Debug
 const gui = new GUI({
    width: Math.min(window.innerWidth * 0.3, 300)
 });
 gui.hide();
 

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
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color("#ffffff");
ambientLight.intensity = 1.9;
scene.add(ambientLight);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const _textTextureMatCap = textureLoader.load("/textures/matcaps/11.png");
_textTextureMatCap.colorSpace = THREE.SRGBColorSpace;

const _textTextureGradient = textureLoader.load("/textures/gradients/3.jpg");
_textTextureGradient.minFilter = THREE.NearestFilter;
_textTextureGradient.magFilter = THREE.NearestFilter;
_textTextureGradient.generateMipmaps = false;

const texturePaths = [
    "textures/animals/ai-lobster.png",
    "textures/animals/ai-salmon.png",
    "textures/animals/ai-shrimp.png",
    "textures/animals/ai-tuna.png",
    "/textures/animals/bounding-beagle.jpg",
    "/textures/animals/content-pig.jpg",
    "/textures/animals/curious-lamb.jpg",
    "/textures/animals/curious-lamb-2.jpg",
    "/textures/animals/cute-kittens.jpg",
    "/textures/animals/friendly-elephants.jpg",
    "/textures/animals/goofy-fox.jpg",
    "/textures/animals/hen-sanctuary.jpg",
    "/textures/animals/horse.jpg",
    "/textures/animals/jolly-goose.jpg",
    "/textures/animals/pig-puppies.jpg",
    "/textures/animals/playful-cow.jpg",
    "/textures/animals/red-fox.jpg",
    "/textures/animals/relaxed-goat.jpg",
    "/textures/animals/silly-chimps.jpg",
    "/textures/animals/sprawling-tiger.jpg",
    "/textures/animals/two-calves.jpg"
];

const animalTextures = texturePaths.map(path => {
    const texture = textureLoader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
});

const animalMaterials = animalTextures.map(texture =>
    new THREE.MeshBasicMaterial({
        map: texture,
        // side: THREE.DoubleSide
    })
);

animalTextures.colorSpace = THREE.SRGBColorSpace;

// Background Gradient
const gradientParams = {
    topColor: "#d7ebfe",
    bottomColor: "#fffdc2"
};

const createGradientTexture = (topColor, bottomColor) =>
{
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 256;

    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);

    gradient.addColorStop(0, topColor);    // top color
    gradient.addColorStop(1, bottomColor); // bottom color

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2, 256);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}
scene.background = createGradientTexture(gradientParams.topColor, gradientParams.bottomColor);

// Add gradient to GUI
const backgroundFolder = gui.addFolder('Background Gradient');

backgroundFolder.addColor(gradientParams, 'topColor')
    .name('Top Color')
    .onChange(() => {
        scene.background = createGradientTexture(gradientParams.topColor, gradientParams.bottomColor);
    });

backgroundFolder.addColor(gradientParams, 'bottomColor')
    .name('Bottom Color')
    .onChange(() => {
        scene.background = createGradientTexture(gradientParams.topColor, gradientParams.bottomColor);
    });

backgroundFolder.open(); // Optional: start with folder open

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load
(
    "/fonts/helvetiker_regular.typeface.json",
    (font) =>
    {
        const textGeometry = new TextGeometry(
            "The impact of\nyour donation",
            {
                font: font,
                size: 1,
                depth: 0.12,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4 
            }
        )
        textGeometry.center();

        // Main text material
        const textMaterial = new THREE.MeshToonMaterial();
        textMaterial.gradientMap = _textTextureGradient;
        textMaterial.wireframe = false;
        textMaterial.depthTest = false;
        textMaterial.color = new THREE.Color("rgb(0, 255, 60)");
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.renderOrder = 2;

        // Outline text material
        const textOutlineMaterial = new THREE.MeshBasicMaterial({
            color: "#472b15",
            side: THREE.BackSide
        });
        textOutlineMaterial.depthTest = false;
        const textOutlineMesh = new THREE.Mesh(textGeometry, textOutlineMaterial);
        textOutlineMesh.scale.x = 1.002;
        textOutlineMesh.scale.y = 1.02;
        textOutlineMesh.scale.z = 1.05;
        textOutlineMesh.renderOrder = textMesh.renderOrder -1;

        scene.add(textMesh, textOutlineMesh);
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
camera.position.z = 8
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
controls.minAzimuthAngle = -Math.PI / 4;
controls.maxAzimuthAngle = Math.PI / 4;
controls.minPolarAngle = -Math.PI / 2;
controls.maxPolarAngle = Math.PI / 2;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Objects
 */


const planeGeometry = new THREE.PlaneGeometry(2, 2);
// const planeMaterial = new THREE.MeshBasicMaterial({
//     map: foxTexture,
//     side: THREE.DoubleSide
// });


for(let i = 0; i < 100; i++)
{
    // randomly select a material from the pool
    const selectedAnimalMaterial = animalMaterials[i % animalMaterials.length];
    const animalPlaneMesh = new THREE.Mesh(planeGeometry, selectedAnimalMaterial); 
    

    animalPlaneMesh.position.x = Math.floor(((Math.random() - 0.5) * 15), 5);
    animalPlaneMesh.position.y = Math.floor(((Math.random() - 0.5) * 15), 5);
    animalPlaneMesh.position.z = (Math.random() - 0.5) * 5;


    const randomScale = Math.random() + 0.1;
    animalPlaneMesh.scale.set(randomScale, randomScale, randomScale);

    // add border
    const edges = new THREE.EdgesGeometry(planeGeometry);
    const borderMaterial = new THREE.LineBasicMaterial({
        color: "#361c0e", 
        linewidth: 2
    });
    const border = new THREE.LineSegments(edges, borderMaterial);
    border.position.z = 0.01;

    // add border as child so transform is inherited
    animalPlaneMesh.add(border);

    scene.add(animalPlaneMesh);
}


/**
 * Debugger
 */
// gui.addColor(donutMaterial, "color");



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