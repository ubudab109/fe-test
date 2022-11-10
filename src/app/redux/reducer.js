/* eslint-disable import/prefer-default-export */
import {
  combineReducers
} from '@reduxjs/toolkit';
import {
  LOGIN,
  LOGOUT,
  UPDATE_PROFILE
} from './action';


const initialState = {
  dataUser: {},
};

/**
 * This function takes in a data object and returns an object with a type property and a payload
 * property.
 * @param data - the data that you want to pass to the reducer
 */
export const loginProcess = (data) => ({
  type: LOGIN,
  payload: data,
});

/**
 * This function returns an object with a type property of LOGOUT.
 */
export const logoutProcess = () => ({
  type: LOGOUT,
});

/* A function that takes in a data object and returns an object with a type property and a
payload property. */
export const updateProfile = (data) => ({
  type: UPDATE_PROFILE,
  payload: data,
});

/**
 * It takes the current state and an action, and returns the next state.
 * @param [state] - The current state of the store.
 * @param action - The action object that was dispatched.
 * @returns The reducer is returning the state.
 */
// eslint-disable-next-line default-param-last
const reducers = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        dataUser: action.payload,
      }
    case UPDATE_PROFILE:
      return {
        ...state,
        dataUser: {
          ...state.dataUser,
          fullname: action.payload.fullname,
        },
      }
    case LOGOUT:
      return state;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  app: reducers,
});

export default rootReducer;
