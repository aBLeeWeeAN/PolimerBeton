/* eslint-disable no-console */
// ! ------------------------------------------------------------
// ! PRODUCTION CODEBASE: ASSISTED BY DEEPSEEK & GOOGLE GEMINI
// ! Logic verified by output results. Maintained by aLeeTheY.
// ! ------------------------------------------------------------

import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

import { getVariantFromElement } from './types'

// Глобальный кэш для предотвращения повторной загрузки одной и той же модели по сети.
// Хранит Promise, чтобы параллельные запросы дожидались одной загрузки.
const gltfCache = new Map<string, Promise<GLTF>>()

class BallViewer {
    // --- Настройки анимации и взаимодействия ---
    private readonly AUTO_ROTATE_DEG_PER_SEC = 15.04 // Скорость авто-вращения (градусы в секунду)
    private readonly SENSITIVITY = 0.005 // Чувствительность мыши/тача при вращении
    private readonly START_DELAY = 0.3 // Задержка перед началом авто-вращения (сек)
    private readonly RAMP_UP_DURATION = 2.7 // Длительность плавного разгона авто-вращения (сек)

    // --- Prefers Reduced Motion ---
    private prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // --- DOM и ссылки ---
    private container: HTMLElement
    private modelUrl: string

    // --- Основные компоненты Three.js ---
    private scene!: THREE.Scene
    private camera!: THREE.PerspectiveCamera
    private renderer!: THREE.WebGLRenderer
    private ballGroup!: THREE.Group

    // --- Состояние времени и анимации ---
    private clock = new THREE.Timer()
    private elapsedTimeAfterLoad = 0
    private needsDeltaReset = false // Флаг для сброса скачков времени при возврате на вкладку/появлении в зоне видимости

    // --- Состояние взаимодействия ---
    private isDragging = false
    private previousPointerPosition = { x: 0, y: 0 }
    private yaw = 0 // Вращение по оси Y (влево/вправо)
    private pitch = 0 // Вращение по оси X (вверх/вниз)
    private initialPitch = 0
    private idleTimer: number | null = null
    private shouldResetAxis = false // Флаг возврата мяча в исходное положение по оси X

    // --- Обсерверы и очистка ---
    private animationFrameId: number | null = null
    private resizeObserver!: ResizeObserver
    private intersectionObserver!: IntersectionObserver
    private isVisible = false
    private disposed = false

    // Массив для гарантированного удаления клонированных материалов,
    // чтобы избежать утечек памяти (memory leaks) в WebGL.
    private instancedMaterials: THREE.Material[] = []

    constructor(container: HTMLElement) {
        this.container = container
        this.modelUrl = container.dataset.modelSrc as string
        this.clock.connect(document)
        this.init()
    }

    private init() {
        this.scene = new THREE.Scene()

        // Инициализация рендерера с упором на качество и производительность
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true, // Прозрачный фон
            powerPreference: 'high-performance', // Запрос дискретной видеокарты, если доступна
        })
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        // Ограничиваем pixelRatio до 2, чтобы не убивать производительность на мобилках с экранами 3x-4x
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Современный воркфлоу работы с цветом и светом
        this.renderer.outputColorSpace = THREE.SRGBColorSpace
        this.renderer.toneMapping = THREE.AgXToneMapping // AgX дает более реалистичные засветы, чем ACESFilmic
        this.renderer.toneMappingExposure = 1.0

        this.loadModel()
            .then((gltf) => {
                // Если за время загрузки компонент уже был уничтожен (например, пользователь ушел со страницы)
                if (this.disposed) {
                    this.disposeInstancedMaterials()
                    return
                }
                this.onModelLoaded(gltf)
            })
            .catch((error) =>
                console.error(`[BallViewer] Model loading error ${this.modelUrl}: `, error),
            )

        this.addObservers()
        this.addEventListeners()

        // prefers reduced motion
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.prefersReducedMotion = e.matches
        })
    }

    private async loadModel(): Promise<GLTF> {
        // Если модели нет в кэше, начинаем загрузку
        if (!gltfCache.has(this.modelUrl)) {
            const loader = new GLTFLoader()
            loader.setMeshoptDecoder(MeshoptDecoder) // Поддержка сжатой геометрии
            const promise = new Promise<GLTF>((resolve, reject) => {
                loader.load(this.modelUrl, resolve, undefined, reject)
            })
            gltfCache.set(this.modelUrl, promise)
        }

        // Ждем оригинальную модель
        const originalGltf = await gltfCache.get(this.modelUrl)!
        if (!originalGltf.scene) {
            throw new Error('[BallViewer] GLTF has no scene')
        }

        // Клонируем сцену, чтобы каждый экземпляр BallViewer мог иметь свои независимые трансформации
        const clonedScene = originalGltf.scene.clone(true)
        return {
            ...originalGltf,
            scene: clonedScene,
        } as GLTF
    }

    private async onModelLoaded(gltf: GLTF) {
        if (this.disposed || !gltf.scene) {
            return
        }

        const loadedScene = gltf.scene
        this.ballGroup = new THREE.Group()

        // Безопасный перенос мешей: сначала собираем в массив, потом attach.
        // Если делать это прямо в traverse, нарушится итерация по дереву сцены.
        const meshesToMove: THREE.Mesh[] = []
        loadedScene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                meshesToMove.push(child)
            }
        })

        // attach сохраняет мировые трансформации при смене родителя
        meshesToMove.forEach((mesh) => {
            this.ballGroup.attach(mesh)
        })

        this.scene.add(loadedScene)
        this.scene.add(this.ballGroup)

        // --- Настройка камеры ---
        // Ищем камеру в модели, если её нет — создаем дефолтную
        if (gltf.cameras && gltf.cameras.length > 0) {
            this.camera = gltf.cameras[0] as THREE.PerspectiveCamera
        } else {
            loadedScene.traverse((child) => {
                if (child instanceof THREE.PerspectiveCamera) {
                    this.camera = child
                }
            })
        }

        if (!this.camera) {
            this.camera = new THREE.PerspectiveCamera(
                39.6,
                this.container.clientWidth / this.container.clientHeight,
                0.1,
                100,
            )
            this.camera.position.set(2.495, 0, 0)
            this.camera.rotation.set(0, Math.PI / 2, 0)
        }
        this.updateCameraAspect()

        const variant = getVariantFromElement(this.container)
        const maxAnisotropy = Math.min(this.renderer.capabilities.getMaxAnisotropy(), 8)

        // --- Настройка освещения ---
        loadedScene.traverse((child) => {
            if (child instanceof THREE.DirectionalLight) {
                const KEY_LIGHT_INTENSITY = 5
                // Настраиваем интенсивность по именам источников света из блендера/GLTF
                if (child.name.toLowerCase().includes('key')) {
                    child.intensity = KEY_LIGHT_INTENSITY
                } else if (child.name.toLowerCase().includes('fill')) {
                    child.intensity = 0.15 * KEY_LIGHT_INTENSITY
                }
            }
        })

        // --- Применение вариантов материалов (кастомизация мяча) ---
        this.ballGroup.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = false
                child.receiveShadow = false

                const isArray = Array.isArray(child.material)
                const materials = (isArray ? child.material : [child.material]) as THREE.Material[]

                const newMaterials = materials.map((material: THREE.Material) => {
                    if (material instanceof THREE.MeshPhysicalMaterial) {
                        // Клонируем материал, чтобы изменение цвета не затронуло другие мячи на странице
                        const clonedMat = material.clone()
                        clonedMat.color.set(variant.color)
                        clonedMat.roughness = 0.475
                        // clonedMat.needsUpdate = true

                        // Глубокое клонирование карты нормалей для применения уникальных оффсетов
                        if (clonedMat.normalMap) {
                            clonedMat.normalMap = clonedMat.normalMap.clone()

                            clonedMat.normalMap.wrapS = THREE.RepeatWrapping
                            clonedMat.normalMap.wrapT = THREE.RepeatWrapping

                            clonedMat.normalMap.repeat.set(1.618, 1.618)
                            clonedMat.normalMap.offset.set(variant.offset[0], variant.offset[1])
                            clonedMat.normalScale.set(2, -2) // Инверсия/усиление нормалей

                            // Улучшение качества текстур под углом
                            clonedMat.normalMap.minFilter = THREE.LinearMipMapLinearFilter
                            clonedMat.normalMap.generateMipmaps = true
                            clonedMat.normalMap.anisotropy = maxAnisotropy

                            // clonedMat.normalMap.needsUpdate = true
                        }

                        // Сохраняем для последующей очистки памяти
                        this.instancedMaterials.push(clonedMat)
                        return clonedMat
                    }
                    return material
                })

                child.material = isArray ? newMaterials : newMaterials[0]
            }
        })

        // --- Подгонка камеры под размеры шара ---
        this.fitCameraToSphere()

        this.initialPitch = 0
        this.pitch = 0
        this.yaw = 0

        // --- Предкомпиляция шейдеров ---
        // Убирает "фриз" (подтормаживание) при первом кадре рендера
        try {
            await this.renderer.compileAsync(this.scene, this.camera)
        } catch (e) {
            console.warn('[BallViewer] compileAsync fail, fallback to sync compile', e)
            this.renderer.compile(this.scene, this.camera)
        }

        if (this.disposed) {
            return
        }

        // Добавляем канвас в DOM только когда всё готово
        this.container.appendChild(this.renderer.domElement)

        // Сообщаем UI, что 3D версия готова (например, чтобы скрыть плейсхолдер)
        const wrapper = this.container.closest(
            '.my-balls-group__ball-wrapper',
        ) as HTMLElement | null
        if (wrapper) {
            wrapper.dataset.variant = '3d'
        }

        // Если мяч уже во вьюпорте, запускаем анимацию
        if (this.isVisible) {
            this.needsDeltaReset = true
            this.animate()
        }
    }

    private fitCameraToSphere() {
        if (!this.ballGroup || !this.camera) {
            return
        }

        const box = new THREE.Box3().setFromObject(this.ballGroup)
        const size = new THREE.Vector3()
        box.getSize(size)

        const radius = Math.max(size.x, size.y, size.z) / 2
        if (radius === 0) {
            return
        }

        const center = new THREE.Vector3()
        box.getCenter(center)
        this.ballGroup.position.sub(center)

        const vFovRad = THREE.MathUtils.degToRad(this.camera.fov) / 2
        const aspect = this.camera.aspect
        const hFovRad = Math.atan(Math.tan(vFovRad) * aspect)

        const distV = radius / Math.sin(vFovRad)
        const distH = radius / Math.sin(hFovRad)

        // Коэффициент отступа: 1.01 дает 1% безопасного запаса вокруг сферы
        const PADDING_FACTOR = 1.01
        const distance = Math.max(distV, distH) * PADDING_FACTOR

        this.camera.position.set(distance, 0, 0)
        this.camera.lookAt(0, 0, 0)
        this.camera.updateProjectionMatrix()
    }

    private updateCameraAspect() {
        if (!this.camera || this.disposed) {
            return
        }
        const width = this.container.clientWidth
        const height = this.container.clientHeight
        if (width === 0 || height === 0) {
            return
        }

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
    }

    private addObservers() {
        // Следим за изменением размеров контейнера для адаптивности
        this.resizeObserver = new ResizeObserver(() => this.updateCameraAspect())
        this.resizeObserver.observe(this.container)

        // Глобальная оптимизация: ставим рендер на паузу, если компонент не виден на экране
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                const isIntersecting = entries[0].isIntersecting
                if (isIntersecting && !this.isVisible) {
                    this.isVisible = true
                    if (this.ballGroup && !this.disposed) {
                        this.needsDeltaReset = true // Сбрасываем дельту, чтобы мяч не "прыгнул"
                        this.animate()
                    }
                } else if (!isIntersecting && this.isVisible) {
                    this.isVisible = false
                    if (this.animationFrameId !== null) {
                        cancelAnimationFrame(this.animationFrameId) // Останавливаем цикл
                        this.animationFrameId = null
                    }
                }
            },
            { threshold: 0.01 }, // Срабатывает, как только хотя бы 1% появляется/исчезает
        )
        this.intersectionObserver.observe(this.container)
    }

    private onPointerDown = (e: PointerEvent) => {
        if (this.disposed) {
            return
        }
        this.isDragging = true
        this.previousPointerPosition = { x: e.clientX, y: e.clientY }

        // Отменяем таймер возврата в исходное положение, если пользователь коснулся мяча
        if (this.idleTimer !== null) {
            clearTimeout(this.idleTimer)
            this.idleTimer = null
        }
        this.shouldResetAxis = false

        // Захватываем указатель, чтобы события продолжали работать, даже если мышь ушла за пределы контейнера
        this.container.setPointerCapture(e.pointerId)

        // Добавляем класс grabbing к объекту, который хватаем
        this.container.classList.add('grabbing')
    }

    private onPointerMove = (e: PointerEvent) => {
        if (!this.isDragging || !this.ballGroup || this.disposed) {
            return
        }

        const deltaX = e.clientX - this.previousPointerPosition.x
        const deltaY = e.clientY - this.previousPointerPosition.y

        this.yaw += deltaX * this.SENSITIVITY
        this.pitch += deltaY * this.SENSITIVITY

        // Ограничиваем вращение по вертикали (чтобы мяч не переворачивался наизнанку)
        const maxPitch = THREE.MathUtils.degToRad(85)
        this.pitch = THREE.MathUtils.clamp(this.pitch, -maxPitch, maxPitch)

        this.previousPointerPosition = { x: e.clientX, y: e.clientY }
    }

    private onPointerUpOrCancel = (e: PointerEvent) => {
        if (!this.isDragging) {
            return
        }
        this.isDragging = false

        try {
            this.container.releasePointerCapture(e.pointerId)
        } catch {
            /* ignore - иногда браузер может сам снять захват */
        }

        // Запускаем таймер бездействия. Через 1 секунду мяч начнет возвращаться в дефолтную ось X.
        if (this.idleTimer !== null) {
            clearTimeout(this.idleTimer)
        }
        this.idleTimer = window.setTimeout(() => {
            this.shouldResetAxis = true
        }, 1000)

        // Удаляем класс grabbing из объекта, который держали
        this.container.classList.remove('grabbing')
    }

    private addEventListeners() {
        this.container.addEventListener('pointerdown', this.onPointerDown)
        this.container.addEventListener('pointermove', this.onPointerMove)
        this.container.addEventListener('pointerup', this.onPointerUpOrCancel)
        this.container.addEventListener('pointercancel', this.onPointerUpOrCancel)
    }

    private removeEventListeners() {
        this.container.removeEventListener('pointerdown', this.onPointerDown)
        this.container.removeEventListener('pointermove', this.onPointerMove)
        this.container.removeEventListener('pointerup', this.onPointerUpOrCancel)
        this.container.removeEventListener('pointercancel', this.onPointerUpOrCancel)
    }

    private animate = (time?: number) => {
        if (!this.isVisible || this.disposed) {
            return
        }

        this.animationFrameId = requestAnimationFrame(this.animate)

        this.clock.update(time)
        let delta = this.clock.getDelta()

        // Сброс скачка времени после сворачивания вкладки или IntersectionObserver
        if (this.needsDeltaReset) {
            delta = 0
            this.needsDeltaReset = false
        }

        // Защита от зависаний (если дельта огромная, ограничиваем её)
        if (delta > 0.1) {
            delta = 0.1
        }
        if (delta <= 0) {
            return
        }

        this.elapsedTimeAfterLoad += delta

        if (this.ballGroup) {
            if (!this.isDragging && !this.prefersReducedMotion) {
                let speedFactor = 0
                // Логика плавного разгона авто-вращения
                if (this.elapsedTimeAfterLoad > this.START_DELAY) {
                    const rampProgress = THREE.MathUtils.clamp(
                        (this.elapsedTimeAfterLoad - this.START_DELAY) / this.RAMP_UP_DURATION,
                        0,
                        1,
                    )
                    // smoothstep делает разгон нелинейным (мягкое начало и конец)
                    speedFactor = THREE.MathUtils.smoothstep(rampProgress, 0, 1)
                }
                const currentDegPerSec = this.AUTO_ROTATE_DEG_PER_SEC * speedFactor
                this.yaw += THREE.MathUtils.degToRad(currentDegPerSec) * delta
            }

            // Плавное возвращение к исходному наклону (pitch), если пользователь отпустил мяч
            if (this.shouldResetAxis && !this.isDragging) {
                // lerp с учетом delta time делает анимацию независимой от FPS
                this.pitch = THREE.MathUtils.lerp(
                    this.pitch,
                    this.initialPitch,
                    1 - Math.pow(0.001, delta),
                )
                // Завершаем возврат, когда разница становится микроскопической
                if (Math.abs(this.pitch - this.initialPitch) < 0.001) {
                    this.pitch = this.initialPitch
                    this.shouldResetAxis = false
                }
            }

            // 'YXZ' важен, чтобы вращения применялись в правильном порядке (избежание шарнирного замка)
            this.ballGroup.rotation.set(this.pitch, this.yaw, 0, 'YXZ')
        }

        if (this.camera) {
            this.renderer.render(this.scene, this.camera)
        }
    }

    /** Освобождает только клонированные материалы и их текстуры */
    private disposeInstancedMaterials() {
        this.instancedMaterials.forEach((mat) => {
            mat.dispose()
            // Важно чистить текстуры внутри материалов, WebGL сам их не выкинет
            if (mat instanceof THREE.MeshPhysicalMaterial && mat.normalMap) {
                mat.normalMap.dispose()
            }
        })
        this.instancedMaterials = []
    }

    /** Рекурсивно удаляет все геометрии и материалы в узле (для полной очистки видеопамяти) */
    private disposeHierarchy(node: THREE.Object3D) {
        if (node instanceof THREE.Mesh) {
            node.geometry?.dispose()
            const materials = Array.isArray(node.material) ? node.material : [node.material]
            materials.forEach((mat) => mat.dispose())
        }
    }

    public dispose() {
        if (this.disposed) {
            return
        }
        this.disposed = true

        // 1. Остановка всех циклов
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId)
            this.animationFrameId = null
        }
        if (this.idleTimer !== null) {
            clearTimeout(this.idleTimer)
            this.idleTimer = null
        }

        // 2. Снятие слушателей
        this.removeEventListeners()
        this.resizeObserver?.disconnect()
        this.intersectionObserver?.disconnect()

        // 3. Освобождаем все ресурсы сцены (геометрии и материалы)
        this.scene.traverse((child) => this.disposeHierarchy(child))

        // 4. Дополнительно чистим массив клонированных материалов (на случай, если какие-то не попали в сцену)
        this.disposeInstancedMaterials()

        // 5. Очищаем дерево сцены
        this.scene.clear()

        // 6. Уничтожаем рендерер и жестко сбрасываем контекст WebGL
        this.renderer.dispose()
        this.renderer.forceContextLoss()

        // 7. Удаляем Canvas из DOM
        if (this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
        }
    }
}

export default BallViewer
