import React, { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { Disc, X, Circle } from "react-feather"
import classnames from "classnames"

import { useSelector } from "react-redux";

import { dicalogin } from "../../../../shared/geral"
import { Container, Content  } from "./styles";

export default function SidebarHeader(props) {
  const auth = useSelector(state => state.auth);
  const [company, setCompany] = useState('empresa')
  const [avatar_company, setAvatar_Company] = useState(null)
  const [iniciais_company, setIniciais_Company] = useState('')
  let {
    toggleSidebarMenu,
    activeTheme,
    collapsed,
    toggle,
    sidebarVisibility,
    menuShadow
  } = props
  useEffect(() =>
  {
     async function loadDados() {
      if (auth.login !== undefined) {
        if (auth.login.company !== undefined) {

          setCompany(auth.login.company)
          setIniciais_Company(dicalogin(auth.login.company))
        }
        if (auth.login.avatar_company !== undefined) {

          setAvatar_Company(auth.login.avatar_company)
        }
      }
     }
     if(auth !== undefined)
      {
        loadDados();
      }
  }, [auth]);
// class SidebarHeader extends Component {
  return (
    <div className="navbar-header">
      <ul className="nav navbar-nav flex-row">
        <li className="nav-item mr-auto">
          <NavLink to="/" className="navbar-brand">
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
            {/*  */}
            <h2 className="brand-text mb-0">{company}</h2>
          </NavLink>
        </li>
        <li className="nav-item nav-toggle">
          <div className="nav-link modern-nav-toggle">
            {collapsed === false ? (
              <Disc
                onClick={() => {
                  toggleSidebarMenu(true)
                  toggle()
                }}
                className={classnames(
                  "toggle-icon icon-x d-none d-xl-block font-medium-4",
                  {
                    "text-primary": activeTheme === "primary",
                    "text-success": activeTheme === "success",
                    "text-danger": activeTheme === "danger",
                    "text-info": activeTheme === "info",
                    "text-warning": activeTheme === "warning",
                    "text-dark": activeTheme === "dark"
                  }
                )}
                size={20}
                data-tour="toggle-icon"
              />
            ) : (
              <Circle
                onClick={() => {
                  toggleSidebarMenu(false)
                  toggle()
                }}
                className={classnames(
                  "toggle-icon icon-x d-none d-xl-block font-medium-4",
                  {
                    "text-primary": activeTheme === "primary",
                    "text-success": activeTheme === "success",
                    "text-danger": activeTheme === "danger",
                    "text-info": activeTheme === "info",
                    "text-warning": activeTheme === "warning",
                    "text-dark": activeTheme === "dark"
                  }
                )}
                size={20}
              />
            )}
            <X
              onClick={sidebarVisibility}
              className={classnames(
                "toggle-icon icon-x d-block d-xl-none font-medium-4",
                {
                  "text-primary": activeTheme === "primary",
                  "text-success": activeTheme === "success",
                  "text-danger": activeTheme === "danger",
                  "text-info": activeTheme === "info",
                  "text-warning": activeTheme === "warning",
                  "text-dark": activeTheme === "dark"
                }
              )}
              size={20}
            />
          </div>
        </li>
      </ul>
      <div
        className={classnames("shadow-bottom", {
          "d-none": menuShadow === false
        })}
      />
    </div>
  )

}

