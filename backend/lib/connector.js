

const connector = (act, pow) => {
    switch (act) {
        case 'neutral':
            return ''
        case 'push':
            return 'forward'
        case 'pull':
            return 'back'
        case 'lift':
            return 'up'
        case 'drop':
            return 'down'
        case 'left':
            return 'left'
        case 'right':
            return 'right'
        case 'rotateLeft':
            return ''
        case 'rotateRight':
            return ''
        case 'command':
            return 'command'
        default:
            return '';
    }
}

export default connector