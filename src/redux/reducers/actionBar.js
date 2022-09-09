const initialState = {
    menuStatus: false,
    action: 'buy',
    nft: null,
    loading: false,
    fromMobile: false,
};
export default (state = initialState, { type, payload }) => {
    switch (type) {
        case 'TOGGLE_MENU':
            return {
                ...state,
                menuStatus: !state.menuStatus
            }
            break;
        case 'SET_ACTION_MENU':
            return {
                ...state,
                nft: payload.nft,
                action: payload.action,
                fromMobile: payload.fromMobile || false,
                menuStatus: true
            }
            break;
        case 'LOADING_MENU':
            return {
                ...state,
                loading: true
            }
            break;
        case 'UNLOADING_MENU':
            return {
                ...state,
                loading: false
            }
            break;
        case 'SET_NFT':
            return {
                ...state,
                nft: payload.nft || {},
                action: payload.action || 'buy'
            }
            break;
        default:
            return state;
    }
};