import { AnyAction } from 'redux'

const bgState = {
    particles: []
}

const background = (state = bgState, action: AnyAction) => {
    switch (action.type) {
        case 'SET_PARTICLES':
            return {
                ...state,
                bgStyle: action.payload
            }
        default:
            return state
    }
}

export default background
