const railwayReducerDefaultState = {};

export const railwayReducer = (state = railwayReducerDefaultState, action) => {
    switch (action.type) {
        case 'GET_STATE_FROM_STORAGE':
            return {
                ...action.payload
            }
        case 'GET_LIVE_STATUS':
            return {
                ...state, ...action.payload
            };
        case 'GET_PNR_STATUS':
            return {
                ...state, ...action.payload
            };
        case 'TOGGLE_LIVE_STATUS_ROUTE':
            state.live_status.toggleRoute = action.payload;
            return {
                ...state
            };
        case 'GET_TRAIN_BETWEEN_STATIONS':
            return {
                ...state, ...action.payload
            };
        default:
            return state;
    }
}