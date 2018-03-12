export const getStateFromStorage = (payload) => {
    return {
        type: 'GET_STATE_FROM_STORAGE',
        payload
    }
}


export const getLiveStatus = (payload) => {
    return {
        type: 'GET_LIVE_STATUS',
        payload
    }
}

export const getPNRStatus = (payload) => {
    return {
        type: 'GET_PNR_STATUS',
        payload
    }
}

export const toggleLiveStatusRoute = (payload) => {
    return {
        type: 'TOGGLE_LIVE_STATUS_ROUTE',
        payload
    }
}

export const getTrainBetweenStations = (payload) => {
    return {
        type: 'GET_TRAIN_BETWEEN_STATIONS',
        payload
    }
}