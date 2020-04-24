import React, { useState, useEffect, useRef } from "react"
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
import { Container } from "./styles";

import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"

import {
  Cloud,
  Link,
  Twitter,
  Facebook,
  Instagram
} from "react-feather"
import { toast } from "react-toastify";
import * as Yup from "yup";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  username: Yup.string().required("O nome é obrigatório")
});

export default function UserCadastro({ match }) {
  const { id } = match.params;
  const [activeTab, setTab] = useState("1")
  const [load, setLoad] = useState(false)
  const [rowData, setrowData] = useState("0")
  const [addresses, setAddresses] = useState([
    {
      street: "",
      number: "",
      complement: "",
      city_id: null,
      type: 0,
      zip: ""
    }
  ])
  const [iniciais, setIniciais] = useState("")
  const [url, setUrl] = useState(null)
  const edicao = id > 0;

  const auth = useSelector(state => state.auth);

  const [file, setFile] = useState(null);

  const ref = useRef();

  async function handleChangeFile(e) {
    const data = new FormData();

    data.append("file", e.target.files[0]);
    const response = await api.post("files", data);

    const { id, url } = response.data;

    setFile(id);
    handleImg(url)
    handleChange("avatar_id", id)
  }
  function handleImg(par) {
    handleChange("files.url", par)
    setUrl(par)
    if(par === null) {
      handleChange("avatar_id", null)
    }
  }
  useEffect(() => {
    async function loadrowData() {
      const body = {
        licence_id: auth.login.licence_id,
        id: parseInt(id)
      };
      const response = await api.post("/users.list", {
        ...body
      });
      let rowData = response.data;
      if(rowData !== undefined && rowData[0] !== undefined)
      {
        let dados = rowData[0]
        // console.log(dados)
        if(dados.addresses !== undefined)
        {
          if(dados.addresses[0] !== undefined)
          {
            const addresses = [
              {
                street: dados.addresses[0].street,
                number: dados.addresses[0].number,
                complement: dados.addresses[0].complement,
                city_id:  dados.addresses[0].city_id,
                type: dados.addresses[0].type,
                zip: dados.addresses[0].zip,
              }
            ]
            setAddresses(addresses)
          }
        }
        _.unset(dados,'addresses')
        setrowData(dados)
        setIniciais(dicalogin(dados.username))
        setUrl(dados.files ? dados.files.url : null)
      }
    }
    if (id > 0 && auth !== undefined) {

      loadrowData();
    }
  }, [auth, id, load]);

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
  }
  function handleChangeAddresses(id, value) {
    _.set(addresses, id, value);
  }
  async function handleSubmit() {
    try {
      await schema.validate(
        {
          username: rowData.username,
          email: rowData.email
        },
        {
          abortEarly: false
        }
      );
      if (!edicao) {
        try {
          // const response = await api.get("deliveryman", {
          //   params: { email: data.email }
          // });

          // if (response.data && response.data.length > 0) {
          //   toast.error("email ja utilizado em outro entregador!");
          // } else {
          //   await api.post("/deliveryman", data);
          //   history.push({
          //     pathname: `/deliveryman`
          //   });
          //   toast.success("Entregador incluído com sucesso!");
          // }
        } catch (error) {
          toast.error("Erro ao incluir Usuário!");
        }
      } else {
        try {
          // var myJSON = JSON.stringify(rowData);
          const user = {
            id: rowData.id,
            username: rowData.username,
            email: rowData.email,
            dob: rowData.dob,
            is_verified: rowData.is_verified,
            mobile: rowData.mobile,
            gender: rowData.gender,
            is_active: rowData.is_active,
            avatar_id: rowData.avatar_id,
            website: rowData.website,
            contact_email: rowData.contact_email,
            contact_message: rowData.contact_message,
            contact_phone: rowData.contact_phone,
            phone: rowData.phone,
            twitter: rowData.twitter,
            facebook: rowData.facebook,
            instagram: rowData.instagram
          }
          const data = {
            user,
            addresses
          }
          await api.put(`/users`, data);

          toast.success("Usuário atualizado com sucesso!");
        } catch (error) {
          toast.error("Erro ao atualizar usuário!");
        }
      }
    } catch (error) {
      let validErrors = "";
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach(err => {
          validErrors = `${validErrors} ${err.message}`;
        });
        if (validErrors.length > 0) {
          toast.error(
            `Não foi possível ${
              id === "0" ? "incluir" : "alterar"
            } o usuário. ${validErrors}`
          );
        }
      } else {
        toast.error(
          `Não foi possível ${id === "0" ? "incluir" : "alterar"} o usuário.`
        );
      }
    }
  }

  function FormTab1() {
    return (
      <Row>
        <Col sm="12">
          <Media className="mb-2">
            <Media className="mr-2 my-25" left href="#">
                <Container>
                  <label htmlFor="avatar">
                    {url ? (
                        <Media
                          className="users-avatar-shadow rounded"
                          object
                          src={url}
                          alt="imagem"
                          height="84"
                          width="84"
                        />
                    ) : (
                      <span className="nome">{iniciais}</span>
                    )}
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      data-file={file}
                      onChange={handleChangeFile}
                      ref={ref}
                    />
                  </label>
                </Container>
            </Media>
            <Media className="mt-2" body>
              <Media className="font-medium-1 text-bold-600" tag="p" heading>
                {rowData.username ? rowData.username : null}
              </Media>
              <div className="d-flex flex-wrap">
                <Button.Ripple className="mr-1" color="primary" outline onClick={() => handleImg(null)} size="sm" >
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
              <Col md="6" sm="12">
                <FormGroup>
                  <Label className="d-block mb-50">Ativo</Label>
                  <div className="d-inline-block mr-1">
                    <Radio
                      label="Sim"
                      color="primary"
                      defaultChecked={rowData.is_active}
                      onChange={e => handleChange("is_active", true)}
                      name="is_active"
                    />
                  </div>
                  <div className="d-inline-block mr-1">
                    <Radio
                      label="Não"
                      color="primary"
                      defaultChecked={!rowData.is_active}
                      onChange={e => handleChange("is_active",false)}
                      name="is_active"
                    />
                  </div>
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
              <Label for="contactnumber">Número Celular</Label>
              <Input
                type="number"
                id="mobile"
                placeholder="Número Celular"
                defaultValue={rowData.mobile}
                onChange={e => handleChange(e.target.id,e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="website">Telefone Fixo</Label>
              <Input
                type="number"
                id="phone"
                placeholder="Telefone Fixo"
                defaultValue={rowData.phone}
                onChange={e => handleChange(e.target.id,e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label className="d-block mb-50">Sexo</Label>
              <div className="d-inline-block mr-1">
                <Radio
                  label="Masculino"
                  color="primary"
                  defaultChecked={rowData.gender === 'M' ? true : false}
                  onChange={e => handleChange("gender", "M")}
                  name="gender"
                />
              </div>
              <div className="d-inline-block mr-1">
                <Radio
                  label="Feminino"
                  color="primary"
                  defaultChecked={rowData.gender === 'F' ? true : false}
                  onChange={e => handleChange("gender","F")}
                  name="gender"
                />
              </div>
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
              <Input
                type="text"
                id="[0].street"
                placeholder="Endereço"
                defaultValue={addresses[0] !== undefined ? addresses[0].street : ''}
                onChange={e => handleChangeAddresses(e.target.id,e.target.value)}
                />
            </FormGroup>
            <FormGroup>
              <Label for="numero">Número</Label>
              <Input
                type="number"
                id="[0].number"
                placeholder="Número"
                defaultValue={addresses[0] !== undefined ? addresses[0].number : ''}
                onChange={e => handleChangeAddresses(e.target.id,e.target.value)}
                />
            </FormGroup>
            <FormGroup>
              <Label for="complement">Complemento</Label>
              <Input
                type="text"
                id="[0].complement"
                placeholder="Complemento"
                defaultValue={addresses[0] !== undefined ? addresses[0].complement : ''}
                onChange={e => handleChangeAddresses(e.target.id,e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="pincode">CEP</Label>
              <Input
                type="text"
                id="[0].zip"
                placeholder="CEP"
                defaultValue={addresses[0] !== undefined ? addresses[0].zip : ''}
                onChange={e => handleChangeAddresses(e.target.id,e.target.value)}
              />
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
            <Label for="twitter">Website</Label>
            <FormGroup className="position-relative has-icon-left">
              <Input
                type="url"
                id="website"
                placeholder="Endereço Web"
                defaultValue={rowData.website}
                onChange={e => handleChange(e.target.id,e.target.value)}
              />
              <div className="form-control-position">
                <Cloud size={15} />
              </div>
            </FormGroup>
            <Label for="twitter">Twitter</Label>
            <FormGroup className="position-relative has-icon-left">
              <Input
                id="twitter"
                placeholder="https://www.twitter.com/"
                defaultValue={rowData.twitter}
                onChange={e => handleChange(e.target.id,e.target.value)}
              />
              <div className="form-control-position">
                <Twitter size={15} />
              </div>
            </FormGroup>

          </Col>
          <Col md="6" sm="12">
            <Label for="facebook">Facebook</Label>
            <FormGroup className="position-relative has-icon-left">
              <Input
                id="facebook"
                placeholder="https://www.facebook.com/"
                defaultValue={rowData.facebook}
                onChange={e => handleChange(e.target.id,e.target.value)}
              />
              <div className="form-control-position">
                <Facebook size={15} />
              </div>
            </FormGroup>
            <Label for="instagram">Instagram</Label>
            <FormGroup className="position-relative has-icon-left">
              <Input
                id="instagram"
                placeholder="https://www.instagram.com/"
                defaultValue={rowData.instagram}
                onChange={e => handleChange(e.target.id,e.target.value)}
              />
              <div className="form-control-position">
                <Instagram size={15} />
              </div>
            </FormGroup>
          </Col>
          <Col className="d-flex justify-content-end flex-wrap" sm="12">
            <Button.Ripple className="mr-1" color="primary" onClick={() => handleSubmit()}>
              Gravar
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
