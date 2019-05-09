export function situationColor(situation) {
    switch (situation) {
        case 'NORMAL':
            return '#4dff88'
        case 'CANCELADO':
            return 'yellow'
        case 'DISPUTA':
            return 'orange'
        case 'ASSINADO':
            return '#6699ff'
    }
}

export default { situationColor }