import BallViewer from './ball_viewer'

export function init3DBalls() {
    const ballContainers = document.querySelectorAll('.my-balls-group__3d-model')

    ballContainers.forEach((container) => {
        new BallViewer(container as HTMLElement)
    })
}
