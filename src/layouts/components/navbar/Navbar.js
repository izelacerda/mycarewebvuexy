import React from "react"
import { Navbar } from "reactstrap"
import { connect } from "react-redux"
import classnames from "classnames"
import { useAuth0 } from "../../../authServices/auth0/auth0Service"
import {
  logoutWithJWT,
  // logoutWithFirebase
} from "../../../redux/actions/auth/loginActions"
import NavbarBookmarks from "./NavbarBookmarks"
import NavbarUser from "./NavbarUser"
import api from "../../../services/api"
import { dicalogin } from "../../../shared/geral"
import { Container, Content  } from "./styles";

// import userImg from "../../../assets/img/portrait/small/avatar-s-11.jpg"

const UserName = props => {
  let name = ""
  if (props.userdata !== undefined) {
    name = props.userdata.name
  } else if (props.user.login.values !== undefined) {
    name = props.user.login.values.name
    if (
      props.user.login.values.loggedInWith !== undefined &&
      props.user.login.values.loggedInWith === "jwt"
    ) {
      name = props.user.login.values.loggedInUser.name
    }
  } else {
    name = ""
  }

  return name
}
const ThemeNavbar = props => {
  const { user } = useAuth0()
  const colorsArr = [ "primary", "danger", "success", "info", "warning", "dark"]
  const navbarTypes = ["floating" , "static" , "sticky" , "hidden"]
  if(props.user.login !== undefined && props.user.login.token !== undefined)
    {
      api.defaults.headers.Authorization = `Bearer ${props.user.login.token}`;
    }
  let company = 'empresa'
  let avatar_company = null
  let iniciais_company = null
  if (props.user.login !== undefined && props.user.login.company !== undefined) {
      company = props.user.login.company
      iniciais_company = dicalogin( props.user.login.company)
      if (props.user.login.avatar_company !== undefined) {
        avatar_company = props.user.login.avatar_company
      }
    }
  return (
    <React.Fragment>
      <div className="content-overlay" />
      <div className="header-navbar-shadow" />
      <Navbar
        className={classnames(
          "header-navbar navbar-expand-lg navbar navbar-with-menu navbar-shadow",
          {
            "navbar-light": props.navbarColor === "default" || !colorsArr.includes(props.navbarColor),
            "navbar-dark": colorsArr.includes(props.navbarColor),
            "bg-primary":
              props.navbarColor === "primary" && props.navbarType !== "static",
            "bg-danger":
              props.navbarColor === "danger" && props.navbarType !== "static",
            "bg-success":
              props.navbarColor === "success" && props.navbarType !== "static",
            "bg-info":
              props.navbarColor === "info" && props.navbarType !== "static",
            "bg-warning":
              props.navbarColor === "warning" && props.navbarType !== "static",
            "bg-dark":
              props.navbarColor === "dark" && props.navbarType !== "static",
            "d-none": props.navbarType === "hidden" && !props.horizontal,
            "floating-nav":
              (props.navbarType === "floating" && !props.horizontal) || (!navbarTypes.includes(props.navbarType) && !props.horizontal),
            "navbar-static-top":
              props.navbarType === "static" && !props.horizontal,
            "fixed-top": props.navbarType === "sticky" || props.horizontal,
            "scrolling": props.horizontal && props.scrolling

          }
        )}
      >
        <div className="navbar-wrapper">
          <div className="navbar-container content">
            <div
              className="navbar-collapse d-flex justify-content-between align-items-center"
              id="navbar-mobile"
            >
              <div className="bookmark-wrapper">
                <NavbarBookmarks
                  sidebarVisibility={props.sidebarVisibility}
                  handleAppOverlay={props.handleAppOverlay}
                />
              </div>
              {props.horizontal ? (
                <div className="logo d-flex align-items-center">
                  {avatar_company ? (
                    <img
                    src={avatar_company}
                    className="round"
                    height="40"
                    width="40"
                    alt="avatar"
                  />
                  ) : (
                    <Container>
                      <Content>
                        <span className="nome">{iniciais_company}</span>
                      </Content>
                    </Container>
                  )}
                  {/* <div className="brand-logo mr-50"></div> */}
                  <h2 className="text-primary brand-text mb-0">
                    {company}
                  </h2>
                </div>
              ) : null}
              <NavbarUser
                handleAppOverlay={props.handleAppOverlay}
                changeCurrentLang={props.changeCurrentLang}
                userName={<UserName userdata={user} {...props} />}
                userImg={
                  props.user.login.values !== undefined &&
                  // props.user.login.values.loggedInWith !== "jwt" &&
                  props.user.login.values.loggedInUser.avatar !== undefined &&
                  props.user.login.values.loggedInUser.avatar !== null &&
                  props.user.login.values.loggedInUser.avatar.url
                    ? props.user.login.values.loggedInUser.avatar.url
                    : null
                }
                loggedInWith={
                  props.user !== undefined &&
                  props.user.login.values !== undefined
                    ? props.user.login.values.loggedInWith
                    : null
                }
                logoutWithJWT={props.logoutWithJWT}
                logoutWithFirebase={props.logoutWithFirebase}
              />
            </div>
          </div>
        </div>
      </Navbar>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    user: state.auth
  }
}

export default connect(mapStateToProps, {
  logoutWithJWT,
  // logoutWithFirebase,
  useAuth0
})(ThemeNavbar)
