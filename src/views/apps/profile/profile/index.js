import React, { useState, useEffect } from "react"
import {
  Card,
  CardBody,
  Row,
  Col
} from "reactstrap"
import { useSelector } from "react-redux";

import api from "../../../../services/api"

import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"

import "../../../../assets/scss/especificos/cadastros.scss"

import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import UserCadastro from "../../user/cadastro"
import { history } from "../../../../history"

export default function Profile(props) {
  const auth = useSelector(state => state.auth);

  const [profiles, setProfiles] = useState([])
  const [countries, setCountries] = useState([])
  const [sidebar, setSidebar] = useState(false)
  const [id, setId] = useState(0)
  const [data, setData] = useState(null)

  useEffect(() =>
  {
     async function loadDados() {
      if (auth.login !== undefined) {
        if (auth.login.licence_id !== undefined) {
          let body = {
            licence_id: auth.login.licence_id,
            id: 0
          };
          let response = await api.post("/profiles.list", {
            ...body
          });
          setProfiles(response.data)

          body = {
            id: 0
          };
          response = await api.post("/countries.list", {
            ...body
          });
          setCountries(response.data)

          body = {
            licence_id: auth.login.licence_id,
            id: auth.login.values.loggedInUser.id,
            active: 'all'
          };
          response = await api.post("/users.list",
            body
          );
          let rowData = response.data;
          handleId(rowData[0],auth.login.values.loggedInUser.id,true)
        }
      }
     }
     if(auth !== undefined)
      {
        loadDados();
      }
  }, [auth]);


  function handleId(data, id, sidebar) {
    setData(data)
    setId(id)
    setSidebar(sidebar)
  }
  async function handleSidebar(sidebar) {
    setSidebar(sidebar)
    setId(0)
    history.push("/")
  }

  return (
  <>
    <Breadcrumbs
    breadCrumbTitle="Profile"
    breadCrumbParent="Sistema"
    breadCrumbActive="Profile"
    />
    <Row>
      <Col sm="12">
        <Card >
          <CardBody>
            <div className="app-cadastros position-relative">
              <div
                className={`app-content-overlay ${sidebar ? "show" : "hidden"}`}
                onClick={() => {
                  handleSidebar(false)
                }}
              ></div>
                <UserCadastro
                  sidebar={sidebar}
                  handleSidebar={handleSidebar}
                  id={id}
                  userPermission={props.userPermission}
                  data={data}
                  countries={countries}
                  profiles={profiles}
                />
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </>
  )
}
