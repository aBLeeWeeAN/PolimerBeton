/* eslint-disable no-console */
import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js'

class BallViewer {
    // AUTO_ROTATE_SPEED = 0.008
    AUTO_ROTATE_DEG_PER_SEC = 15.04
    SENSITIVITY = 0.005

    // Константы задержки и разгона (в секундах)
    START_DELAY = 1.0
    RAMP_UP_DURATION = 1.0

    // Счетчик времени после загрузки
    elapsedTimeAfterLoad!: number
    modelIsLoaded = false

    // Таймер
    clock!: THREE.Timer

    is_dragging = false

    container: HTMLElement
    modelUrl: string

    scene!: THREE.Scene
    camera!: THREE.PerspectiveCamera
    renderer!: THREE.WebGLRenderer
    ballMesh!: THREE.Mesh

    previousPointerPosition: { x: number; y: number } = { x: 0, y: 0 }

    yaw = 0

    pitch = 0
    initialPitch = 0

    initialRotationX = 0
    initialRotationZ = 0

    idleTimer: number | null = null
    shouldResetAxis = false

    constructor(container: HTMLElement) {
        this.container = container
        this.modelUrl = container.dataset.modelSrc as string

        this.init()
    }

    init() {
        this.scene = new THREE.Scene()

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // цветовое пространство и tone mapping
        this.renderer.outputColorSpace = THREE.SRGBColorSpace
        this.renderer.toneMapping = THREE.AgXToneMapping
        this.renderer.toneMappingExposure = 1.0

        // тени
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        this.container.appendChild(this.renderer.domElement)

        const loader = new GLTFLoader()
        loader.load(
            this.modelUrl,
            (gltf) => this.onModelLoaded(gltf),
            undefined,
            (error) => console.error(`Model loading error ${this.modelUrl}: `, error),
        )

        this.addEventListeners()
    }

    onModelLoaded(gltf: GLTF) {
        const loadedScene = gltf.scene
        this.scene.add(loadedScene)

        // 1. Инициализация камеры из GLTF файла
        if (gltf.cameras && gltf.cameras.length > 0) {
            this.camera = gltf.cameras[0] as THREE.PerspectiveCamera
        } else {
            loadedScene.traverse((child) => {
                if (child instanceof THREE.PerspectiveCamera) {
                    this.camera = child
                }
            })
        }

        // запасной вариант камеры если основная отсутствует
        if (!this.camera) {
            this.camera = new THREE.PerspectiveCamera(
                39.6,
                this.container.clientWidth / this.container.clientHeight,
                0.1,
                100,
            )
            this.camera.position.set(2.495, 0, 0)
            this.camera.rotation.set(0, 90, 0)
        }

        this.updateCameraAspect()

        // 2. Обход сцены: поиск и настройка источников света (key & fill) и меша
        loadedScene.traverse((child) => {
            // свет
            if (child instanceof THREE.DirectionalLight) {
                const KEY_LIGHT_INTENSITY = 5

                // key light
                if (child.name.toLowerCase().includes('key')) {
                    child.intensity = KEY_LIGHT_INTENSITY
                } else if (child.name.toLowerCase().includes('fill')) {
                    child.intensity = 0.15 * KEY_LIGHT_INTENSITY
                }
            }

            // меш
            if (child instanceof THREE.Mesh) {
                child.castShadow = false
                child.receiveShadow = false

                const materials = Array.isArray(child.material) ? child.material : [child.material]
                materials.forEach((material) => {
                    if (material instanceof THREE.MeshPhysicalMaterial) {
                        if (material.normalMap) {
                            // настройка мип-маппинга
                            material.normalMap.minFilter = THREE.LinearMipMapLinearFilter
                            material.normalMap.generateMipmaps = true

                            // сила нормалей
                            material.normalScale.set(2, -2)

                            // анизатропная фильтрация
                            material.normalMap.anisotropy =
                                this.renderer.capabilities.getMaxAnisotropy()

                            material.normalMap.needsUpdate = true
                        }

                        material.roughness = 0.5
                        material.needsUpdate = true
                    }
                })

                if (!this.ballMesh) {
                    this.ballMesh = child

                    // this.initialRotationX = child.rotation.x
                    // this.initialRotationZ = child.rotation.z

                    this.pitch = child.rotation.x
                    this.initialPitch = child.rotation.x

                    this.yaw = child.rotation.y
                }
            }
        })

        // 3. Перключение классов видимости
        const parentGroup = this.container.closest(
            '.my-balls-group__ball-wrapper',
        ) as HTMLElement | null
        if (parentGroup) {
            // parentGroup.classList.add('.my-balls-group--3d')
            parentGroup.dataset.variant = '3d'
        }

        // 4. Инициализация счётчика и таймера
        this.clock = new THREE.Timer()
        this.elapsedTimeAfterLoad = 0
        this.modelIsLoaded = true

        // 5. Запуск анимации вращения шара
        this.animate()
    }

    updateCameraAspect() {
        if (!this.camera) {
            return
        }

        const width = this.container.clientWidth
        const height = this.container.clientHeight

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(width, height)
    }

    addEventListeners() {
        const resizeObserver = new ResizeObserver(() => {
            this.updateCameraAspect()
        })
        resizeObserver.observe(this.container)

        const domEl = this.container

        domEl.addEventListener('pointerdown', (e) => {
            this.is_dragging = true
            this.previousPointerPosition = { x: e.clientX, y: e.clientY }

            if (this.idleTimer !== null) {
                clearTimeout(this.idleTimer)
                this.idleTimer = null
            }
            this.shouldResetAxis = false

            domEl.setPointerCapture(e.pointerId)
        })

        domEl.addEventListener('pointermove', (e) => {
            if (!this.is_dragging || !this.ballMesh) {
                return
            }

            const deltaX = e.clientX - this.previousPointerPosition.x
            const deltaY = e.clientY - this.previousPointerPosition.y

            this.yaw += deltaX * this.SENSITIVITY
            this.pitch += deltaY * this.SENSITIVITY

            const maxPitch = THREE.MathUtils.degToRad(85)
            this.pitch = THREE.MathUtils.clamp(this.pitch, -maxPitch, maxPitch)

            // this.ballMesh.rotation.y += deltaX * 0.008
            // this.ballMesh.rotation.x += deltaY * 0.008

            this.previousPointerPosition = { x: e.clientX, y: e.clientY }
        })

        const stopDragging = (e: PointerEvent) => {
            if (this.is_dragging) {
                this.is_dragging = false

                try {
                    domEl.releasePointerCapture(e.pointerId)
                } catch {
                    // empty
                }

                if (this.idleTimer !== null) {
                    clearTimeout(this.idleTimer)
                }
                this.idleTimer = window.setTimeout(() => {
                    this.shouldResetAxis = true
                }, 1000)
            }
        }

        domEl.addEventListener('pointerup', stopDragging)
        domEl.addEventListener('pointercancel', stopDragging)
    }

    animate = () => {
        requestAnimationFrame(this.animate)

        this.clock.update()
        const delta = this.clock.getDelta()

        if (this.ballMesh) {
            // Накапливаем общее время с момента запуска цикла
            if (this.modelIsLoaded) {
                this.elapsedTimeAfterLoad += delta
                console.info('elapsedTimeAfterLoad = ' + this.elapsedTimeAfterLoad)
            }

            if (!this.is_dragging) {
                let speedFactor = 0

                if (this.elapsedTimeAfterLoad > this.START_DELAY) {
                    const rampProgress = THREE.MathUtils.clamp(
                        (this.elapsedTimeAfterLoad - this.START_DELAY) / this.RAMP_UP_DURATION,
                        0,
                        1,
                    )

                    speedFactor = THREE.MathUtils.smoothstep(rampProgress, 0, 1)
                }

                const currentDegPerSec = this.AUTO_ROTATE_DEG_PER_SEC * speedFactor
                const autoRotateRadians = THREE.MathUtils.degToRad(currentDegPerSec)
                this.yaw += autoRotateRadians * delta
            }

            if (this.shouldResetAxis && !this.is_dragging) {
                this.pitch = THREE.MathUtils.lerp(
                    this.pitch,
                    this.initialPitch,
                    1 - Math.pow(0.001, delta),
                )

                if (Math.abs(this.pitch - this.initialPitch) < 0.001) {
                    this.pitch = this.initialPitch
                    this.shouldResetAxis = false
                }
            }

            this.ballMesh.rotation.set(this.pitch, this.yaw, 0, 'YXZ')

            // if (this.shouldResetAxis) {
            //     this.ballMesh.rotation.x = THREE.MathUtils.lerp(
            //         this.ballMesh.rotation.x,
            //         this.initialRotationX,
            //         0.05,
            //     )
            //     this.ballMesh.rotation.z = THREE.MathUtils.lerp(
            //         this.ballMesh.rotation.z,
            //         this.initialRotationZ,
            //         0.05,
            //     )
            // }

            // if (
            //     Math.abs(this.ballMesh.rotation.x - this.initialRotationX) < 0.001 &&
            //     Math.abs(this.ballMesh.rotation.z - this.initialRotationZ) < 0.001
            // ) {
            //     this.ballMesh.rotation.x = this.initialRotationX
            //     this.ballMesh.rotation.z = this.initialRotationZ

            //     this.shouldResetAxis = false
            // }
        }

        if (this.camera) {
            this.renderer.render(this.scene, this.camera)
        }
    }
}

export function init3DBalls() {
    // const ballContainers = document.querySelectorAll('.ball-3d-wrapper')
    const ballContainers = document.querySelectorAll('.my-balls-group__3d-model')

    ballContainers.forEach((container) => {
        new BallViewer(container as HTMLElement)
    })
}
