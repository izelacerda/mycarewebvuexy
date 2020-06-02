import React, { useState, useEffect } from "react"
import {
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap"
import classnames from "classnames"
import { User, Users } from "react-feather"

import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import { history } from "../../../history"
import CompanyGroupList from "./list/companygrouplist"
import CompanyList from "./list/companylist"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"

export default function Company(props) {
  let AcessoPermission = props.userPermission.includes(43)
  const [load, setLoad] = useState(true)
  const [activeTab, setTab] = useState("1")
  // const dispatch = useDispatch()

  useEffect(() =>
  {
     async function loadDados() {
       if(!AcessoPermission) {
        history.push(`/`)
       }
      setLoad(false)
     }
     if(load)
      {
        loadDados();
      }
  }, [load]); // eslint-disable-line

  function toggle(tab) {
    if(tab==='-1'){
      const tabNro = parseInt(activeTab)+1
      if(tabNro > 3) {
        tab="1"
      }
      else
      {
        tab= tabNro.toString()
      }
    }

    setTab(tab)
  }

  return (
  <>
    <Breadcrumbs
      breadCrumbTitle="Empresas"
      breadCrumbParent="Gerencial"
      breadCrumbActive="Empresas"
    />
    <Row>
      <Col sm="6">
        <Card>
          <CardBody className="pt-1">

              <div>
                <div className="d-flex justify-content-between flex-wrap mb-1">
                  <div>
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "1"
                          })}
                          onClick={() => {
                            toggle("1")
                          }}
                        >
                          <Users size={16} />
                          <span className="align-middle ml-50">Grupos Empresariais</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "2"
                          })}
                          onClick={() => {
                            toggle("2")
                          }}
                        >
                          <User size={16} />
                          <span className="align-middle ml-50">Empresas</span>
                        </NavLink>
                      </NavItem>

                    </Nav>
                  </div>
                </div>
                {
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <CompanyGroupList {...props} />
                    </TabPane>
                    <TabPane tabId="2">
                      <CompanyList {...props} />
                    </TabPane>

                  </TabContent>

                }
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </>
  )

}
