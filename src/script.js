import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'


THREE.ColorManagement.enabled = false

console.log("test vercel")
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper()
//scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')

/**
 * Fonts
 */
const fontLoader = new FontLoader()

var textGeometry = null


fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        textGeometry = new TextGeometry(
            'natepiano@youtube',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4,
            }
        )
        textGeometry.computeBoundingBox()
        textGeometry.center()
        const textMaterial = new THREE.MeshMatcapMaterial({
                matcap: matcapTexture,
                opacity: .95,
                transparent: true
            }
        )


        textMaterial.wireframe = false
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)

        gui
            .add(textMaterial, 'wireframe')

        console.time('donuts)')
        const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
        const donutMaterial = new THREE.MeshMatcapMaterial({
            matcap: matcapTexture,
            opacity: .4,
            transparent: true,
        })

        for (let i = 0; i < 15000; i++) {

            const donut = new THREE.Mesh(donutGeometry,donutMaterial)
            donut.position.x = (Math.random() - 0.5)  * 200
            donut.position.y = (Math.random() - 0.5) * 200
            donut.position.z = (Math.random() - 0.5) * 200

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random() * 2
            donut.scale.set(scale, scale, scale)
            scene.add(donut)

        }

        console.timeEnd('donuts)')
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    scene.traverse( ( node ) => {

        if ( node instanceof THREE.Mesh  ) {
            const geometry = node.geometry
            if (geometry instanceof THREE.TorusGeometry) {

                // insert your code here, for example:
                node.rotation.x += Math.random() * 0.01
                node.rotation.y += Math.random() * 0.02
                node.rotation.z += Math.random() * 0.03
            }

        }

    } );

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
