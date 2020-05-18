import {
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
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
      const { id, email, name, remember, userRole, licences, avatar, token, permissions } = action.payload.loggedInUser;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const checkDate = setMilliseconds(
        setSeconds(setMinutes(setHours(new Date(), 0), 0), 0),
        0
      );
      // transformando a checkdate acima para o formato global, pois
      // a hora pode variar de usuario para usuario, e é bom manter o padrao
      // global
      const loginDate = utcToZonedTime(checkDate, timezone);
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
        userRole,
        permissions,
        loginDate
       }
    }
    case "LOGIN_FAILURE": {
      return { ...state, values: action.payload }
    }
    case "LOGOUT_WITH_JWT": {
      return { ...state, signed: false, userRole: null , permissions: undefined, loginDate: null}
    }
    case "LOGOUT_WITH_FIREBASE": {
      return { ...state, values: action.payload }
    }
    case "CHANGE_AVATAR": {
      return { ...state, company: action.userAvatar.company, avatar_company: action.userAvatar.avatar_company ? action.userAvatar.avatar_company.url : null }
    }
    case "CHANGE_ROLE": {
      return { ...state, userRole: action.userRole }
    }
    default: {
      return state
    }
  }
}
