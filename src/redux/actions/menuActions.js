const toggleMenu = (payload) => (dispatch) => {
    return dispatch({
        type: 'TOGGLE_MENU',
        payload: payload
    })
}
const setActionMenu = (payload) => (dispatch) => {
    return dispatch({
        type: 'SET_ACTION_MENU',
        payload: payload
    })
}

export {
    toggleMenu,
    setActionMenu
}