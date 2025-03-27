const STATE = {
    showControlPoints: false,
}

const proxy = new Proxy(STATE, {
    set(target, key, value) {
        target[key] = value
        if (key === 'showControlPoints') {
            const controlPoints = document.querySelectorAll('.control-point')
            controlPoints.forEach((controlPoint) => {
                controlPoint.style.display = value ? 'block' : 'none'
            })
        }
        return true
    }
})