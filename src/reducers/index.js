import * as actionTypes from '../actions/types';
import { combineReducers } from 'redux';

const initialUserState = {
  currentUser: null,
  isLoading: true
}

const user_reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      }
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state;
  }
}

//------------------------------------------------------------------------------

const initialChannelState = {
  currentChannel: null,
  isPrivateChannel: false
};

const channel_reducer = (state = initialChannelState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel
      }
    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel
      }
    default:
      return state;
  }
}

//------------------------------------------------------------------------------
// We want our user_reducer to only modify the user property on global state
// combineReducer allow us to determine what property on global state the given reducer updates
const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer
});

export default rootReducer;
