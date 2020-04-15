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
  Media,
  Button,
  Form,
  Input,
  Label,
  FormGroup
} from "reactstrap"
import _ from 'lodash';
import { useSelector } from "react-redux";
import classnames from "classnames"
import { User, Info, Share } from "react-feather"
import "../../../../assets/scss/pages/users.scss"
import api from "../../../../services/api"

import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import Radio from "../../../../components/@vuexy/radio/RadioVuexy"
import { Check, MapPin } from "react-feather"
import Flatpickr from "react-flatpickr";
import { dicalogin } from "../../../../shared/geral"
import { Container, Content  } from "./styles";

import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"

import {
  Link,
  Twitter,
  Facebook,
  Instagram
} from "react-feather"

export default function UserCadastro({ match }) {
  const { id } = match.params;
  const [activeTab, setTab] = useState("1")
  const [load, setLoad] = useState(false)
  const [rowData, setrowData] = useState("0")
  const [iniciais, setIniciais] = useState("")
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    async function loadrowData() {
      const headers = {
        licence_id: auth.login.licence_id,
        id
      };
      const response = await api.get("/users", {
        headers
      });
      let rowData = response.data;
      if(rowData !== undefined && rowData[0] !== undefined)
      {
        setrowData(rowData[0])
        setIniciais(dicalogin(rowData[0].username))
      }
    }
    if (id > 0 && auth !== undefined) {

      loadrowData();
    }
  }, [auth, id, load, setIniciais]);

  function toggle(tab) {
    setTab(tab)
  }
  function handleDados(par) {
    if(par === "9")
    {
      setrowData([])
      setLoad(!load)
    }
  }
  function handleChange(id, value) {
    _.set(rowData, id, value);
    console.log(id)
    console.log(value)
    console.log(rowData)
  }
  function FormTab1() {
    return (
      <Row>
        <Col sm="12">
          <Media className="mb-2">
            <Media className="mr-2 my-25" left href="#">
                {rowData.files ? (
                    <Media
                      className="users-avatar-shadow rounded"
                      object
                      src={rowData.files ? rowData.files.url : ''}
                      alt="imagem"
                      height="84"
                      width="84"
                    />
                ) : (
                  <Container>
                    <Content>
                      <span className="nome">{iniciais}</span>
                    </Content>
                  </Container>
                )}
            </Media>
            <Media className="mt-2" body>
              <Media className="font-medium-1 text-bold-600" tag="p" heading>
                {rowData.username ? rowData.username : null}
              </Media>
              <div className="d-flex flex-wrap">
                <Button.Ripple className="mr-1" color="primary" outline>
                 Remover Imagem
                </Button.Ripple>
                {/* <Button.Ripple color="flat-danger">Remover Imagem</Button.Ripple> */}
              </div>
            </Media>
          </Media>
        </Col>
        <Col sm="12">
          <Form onSubmit={e => e.preventDefault()}>
            <Row>
              <Col md="6" sm="12">
                  <Label for="username">Nome</Label>
                  <Input
                    type="text"
                    defaultValue= {rowData.username ? rowData.username : null}
                    id="username"
                    placeholder="Nome"
                    onChange={e => handleChange(e.target.id,e.target.value)}
                  />
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="status">Status</Label>
                  <Input type="select" name="status" id="status">
                    <option>Ativo</option>
                    <option>Desativado</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="role">Perfil</Label>
                  <Input type="select" name="role" id="role">
                    <option>User</option>
                    <option>Staff</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="email">E-mail</Label>
                  <Input
                    type="text"
                    defaultValue={rowData.email ? rowData.email : null}
                    id="email"
                    placeholder="E-mail"
                    onChange={e => handleChange(e.target.id,e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col
                className="d-flex justify-content-end flex-wrap mt-2"
                sm="12"
              >
                <Button.Ripple className="mr-1" color="primary" onClick={() => toggle("2")}>
                  Proximo
                </Button.Ripple>
                <Button.Ripple color="flat-warning" onClick={() => handleDados("9")} >Limpar</Button.Ripple>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    )
  }

  function FormTab2() {
    return (
      <Form onSubmit={e => e.preventDefault()}>
        <Row className="mt-1">
          <Col className="mt-1" md="6" sm="12">
            <h5 className="mb-1">
              <User className="mr-50" size={16} />
              <span className="align-middle">Informações pessoais</span>
            </h5>
            <FormGroup>
              <Label className="d-block" for="dob">
                Data de Aniversário
              </Label>
              <Flatpickr
                id="dob"
                className="form-control"
                options={{ dateFormat: "d-m-Y" }}
                value={rowData.dob}
                onChange={date => handleChange("dob", date[0].toJSON())}
                // onChange={date => this.handledob(date)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="contactnumber">Número telefone</Label>
              <Input
                type="number"
                id="mobile"
                placeholder="Número telefone"
                value={rowData.mobile}
                onChange={e => handleChange(e.target.id,e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="website">Website</Label>
              <Input
                type="url"
                id="website"
                placeholder="Endereço Web"
                onChange={e => handleChange(e.target.id,e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label className="d-block mb-50">Sexo</Label>
              <div className="d-inline-block mr-1">
                <Radio
                  label="Masculino"
                  color="primary"
                  defaultChecked={false}
                  name="gender"
                />
              </div>
              <div className="d-inline-block mr-1">
                <Radio
                  label="Feminino"
                  color="primary"
                  defaultChecked={true}
                  name="gender"
                />
              </div>
              {/* <div className="d-inline-block">
                <Radio
                  label="Others"
                  color="primary"
                  defaultChecked={false}
                  name="gender"
                />
              </div> */}
            </FormGroup>
            <FormGroup>
              <Label className="d-block mb-50" for="communication">
                Comunicação
              </Label>
              <div className="d-inline-block mr-1">
                <Checkbox
                  color="primary"
                  icon={<Check className="vx-icon" size={16} />}
                  label="E-mail"
                  defaultChecked={rowData.contact_email}
                  id="contact_email"
                  onChange={e => handleChange("contact_email",e.target.checked)}
                />
              </div>
              <div className="d-inline-block mr-1">
                <Checkbox
                  color="primary"
                  icon={<Check className="vx-icon" size={16} />}
                  label="SMS"
                  id="contact_message"
                  defaultChecked={rowData.contact_message}
                  onChange={e => handleChange("contact_message",e.target.checked)}
                />
              </div>
              <div className="d-inline-block">
                <Checkbox
                  color="primary"
                  icon={<Check className="vx-icon" size={16} />}
                  label="Telefone"
                  id="contact_phone"
                  defaultChecked={rowData.contact_phone}
                  onChange={e => handleChange("contact_phone",e.target.checked)}
                />
              </div>
            </FormGroup>
          </Col>
          <Col className="mt-1" md="6" sm="12">
            <h5 className="mb-1">
              <MapPin className="mr-50" size={16} />
              <span className="align-middle">Endereço</span>
            </h5>
            <FormGroup>
              <Label for="address1">Endereço</Label>
              <Input type="text" id="address1" placeholder="Endereço" />
            </FormGroup>
            <FormGroup>
              <Label for="numero">Número</Label>
              <Input type="text" id="numero" placeholder="Número" />
            </FormGroup>
            <FormGroup>
              <Label for="address2">Complemento</Label>
              <Input type="text" id="address2" placeholder="Complemento" />
            </FormGroup>
            <FormGroup>
              <Label for="pincode">CEP</Label>
              <Input type="text" id="CEP" placeholder="CEP" />
            </FormGroup>
            <Row>
              <Col  md="4" sm="12">
                <FormGroup>
                  <Label for="Country">País</Label>
                  <Input
                    type="text"
                    defaultValue=""
                    id="Country"
                    placeholder="País"
                  />
                </FormGroup>
              </Col>
              <Col  md="4" sm="12">
                <FormGroup>
                  <Label for="State">Estado</Label>
                  <Input
                    type="text"
                    defaultValue=""
                    id="State"
                    placeholder="Estado"
                  />
                </FormGroup>
              </Col>
              <Col  md="4" sm="12">
                <FormGroup>
                  <Label for="city">Cidade</Label>
                  <Input
                    type="text"
                    defaultValue=""
                    id="city"
                    placeholder="Cidade"
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>
          <Col className="d-flex justify-content-end flex-wrap" sm="12">
            <Button.Ripple className="mr-1" color="primary" onClick={() => toggle("3")}>
              Proximo
            </Button.Ripple>
            <Button.Ripple color="flat-warning" onClick={() => handleDados("9")} >Limpar</Button.Ripple>
          </Col>
        </Row>
      </Form>
    )
  }
  function FormTab3() {
    return (
      <Form className="mt-2" onSubmit={e => e.preventDefault()}>
        <h5 className="mb-1">
          <Link size={15} />
          <span className="align-middle ml-50">Social Links</span>
        </h5>
        <Row>
          <Col md="6" sm="12">
            <Label for="twitter">Twitter</Label>
            <FormGroup className="position-relative has-icon-left">
              <Input
                id="twitter"
                placeholder="https://www.twitter.com/"
                onChange={e => handleChange(e.target.id,e.target.value)}
              />
              <div className="form-control-position">
                <Twitter size={15} />
              </div>
            </FormGroup>
            <Label for="facebook">Facebook</Label>
            <FormGroup className="position-relative has-icon-left">
              <Input
                id="facebook"
                placeholder="https://www.facebook.com/"
                onChange={e => handleChange(e.target.id,e.target.value)}
              />
              <div className="form-control-position">
                <Facebook size={15} />
              </div>
            </FormGroup>

          </Col>
          <Col md="6" sm="12">
            <Label for="instagram">Instagram</Label>
            <FormGroup className="position-relative has-icon-left">
              <Input
                id="instagram"
                placeholder="https://www.instagram.com/"
                onChange={e => handleChange(e.target.id,e.target.value)}
              />
              <div className="form-control-position">
                <Instagram size={15} />
              </div>
            </FormGroup>
          </Col>
          <Col className="d-flex justify-content-end flex-wrap" sm="12">
            <Button.Ripple className="mr-1" color="primary" onClick={() => handleDados("0")}>
              Gravar dados
            </Button.Ripple>
            <Button.Ripple color="flat-warning" onClick={() => handleDados("9")} >Limpar</Button.Ripple>
          </Col>
        </Row>
      </Form>
    )
  }

  return (
    <Row>
      <Col sm="12">
        <Card>
          <CardBody className="pt-2">
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
                  <User size={16} />
                  <span className="align-middle ml-50">Acesso</span>
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
                  <Info size={16} />
                  <span className="align-middle ml-50">Informações</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: activeTab === "3"
                  })}
                  onClick={() => {
                    toggle("3")
                  }}
                >
                  <Share size={16} />
                  <span className="align-middle ml-50">Social</span>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <FormTab1 />
              </TabPane>
              <TabPane tabId="2">
                <FormTab2 />
              </TabPane>
              <TabPane tabId="3">
                <FormTab3 />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )

}
