import * as crypto from "../../../shared/crypto";

const INITIAL_STATE = {
  signed: false,
  loading: false,
  userRole: ""
};

export const login = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN_WITH_EMAIL": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_WITH_FB": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_WITH_TWITTER": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_WITH_GOOGLE": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_WITH_GITHUB": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_WITH_JWT": {
      const password = crypto.encryptByDESModeCBC(action.payload.loggedInUser.password);
      const email = crypto.encryptByDESModeCBC(action.payload.loggedInUser.email);
      const { id, name, remember, userRole } = action.payload.loggedInUser;
      const values = {
        loggedInUser: {
          id,
          name,
          email,
          password,
          remember,
          userRole
          },
          loggedInWith: "jwt"
      }
      return { values,
        signed: true,
        loading: false,
        userRole }
    }
    case "LOGIN_FAILURE": {
      return { ...state, values: action.payload }
    }
    case "LOGOUT_WITH_JWT": {
      return { state }
    }
    case "LOGOUT_WITH_FIREBASE": {
      return { ...state, values: action.payload }
    }
    case "CHANGE_ROLE": {
      return { ...state, userRole: action.userRole }
    }
    default: {
      return state
    }
  }
}
