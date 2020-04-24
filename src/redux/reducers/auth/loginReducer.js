import * as crypto from "../../../shared/crypto";

const INITIAL_STATE = {
  signed: false,
  loading: false,
  userRole: "",
  token: ""
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
      const login = crypto.encryptByDESModeCBC(action.payload.loggedInUser.login);
      const { id, email, name, remember, userRole, licences, avatar, token } = action.payload.loggedInUser;
      let avatar_company = null;
      if(licences[0].files !== undefined )
      {
        if(licences[0].files !== null )
        {
          avatar_company = licences[0].files.url
        }
      }

      const values = {
        loggedInUser: {
          id,
          login,
          name,
          email,
          password,
          remember,
          userRole,
          avatar,
          licences
          },
          loggedInWith: "jwt"
      }
      return { values,
        signed: true,
        loading: false,
        licence_id: licences[0].id,
        company: licences[0].name,
        avatar_company,
        token,
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
