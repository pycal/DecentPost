const initialState = {
  instance: null
}

const contractReducer = (state = initialState, action) => {
  if (action.type === 'CONTRACT_LOADED')
  {
    return Object.assign({}, state, {
      instance: action.payload.contract
    })
  }

  return state
}

export default contractReducer;
