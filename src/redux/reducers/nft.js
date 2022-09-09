const initialState = {
    collection: null,
    prevCursor: null,
    nextCursor: null,
    filter: 'high-low',
    data: [],
    nft: {},
    isMobile: false,
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case 'SET_COLLETION':
            return {
                ...state,
                collection: payload
            }
            break;
        case 'SET_NFT':
            return {
                ...state,
                nft: payload
            }
            break;
        case 'RESET_NFT':
            return {
                ...state,
                data: []
            }
            break;
        case 'LOAD_NFT':
            return {
                ...state,
                data: [...state.data, ...payload]
            }
            break;
        case 'UPDATE_NFT':
            return {
                ...state,
                data: payload
            }

            break;
        case 'TOGGLE_MOBILE_UI':
            return {
                ...state,
                isMobile: payload
            }

            break;
        default:
            return state;
    }
};