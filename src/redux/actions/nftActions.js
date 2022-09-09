import { LOAD_NFT, UPDATE_NFT, SET_COLLETION, SET_NFT } from '../constants/index'
import { MoralisDappProvider } from 'providers/MoralisDappProvider/MoralisDappProvider'

const loadNft = (payload) => (dispatch) => {

    return dispatch({
        type: LOAD_NFT,
        payload: payload
    })
}
const resetNftData = (payload) => (dispatch) => {

    return dispatch({
        type: 'RESET_NEFT',
        payload: payload
    })
}
const updateNft = (payload) => (dispatch) => {
    return dispatch({
        type: UPDATE_NFT,
        payload: payload
    })
}

const setCollection = (payload) => (dispatch) => {
    return dispatch({
        type: SET_COLLETION,
        payload: payload
    })
}
const setActiveNft = (payload) => (dispatch) => {
    return dispatch({
        type: SET_NFT,
        payload: payload
    })
}
const toggleIsmobile = (payload) => (dispatch) => {
    return dispatch({
        type: 'TOGGLE_MOBILE_UI',
        payload
    })
}

export {
    loadNft,
    updateNft,
    setCollection,
    setActiveNft,
    resetNftData, toggleIsmobile
}

