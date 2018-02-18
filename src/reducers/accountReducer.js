const initialState = {
  account: undefined
}

const accountReducer = (state = initialState, action) => {
  if (action.type === 'ACCOUNT_LOADED')
  {
    return Object.assign({}, state, {
      account: action.payload.account.account
    })
  }

  return state
}

export default accountReducer;
