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
  FormGroup,
  FormFeedback
} from "reactstrap"
import _ from 'lodash';
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames"
import { User, Info, Share } from "react-feather"
import { toast, Flip } from "react-toastify"
import * as Yup from "yup";
import InputMask from "react-input-mask"
import {
  Cloud,
  Link,
  Twitter,
  Facebook,
  Instagram
} from "react-feather"
import Select from "react-select"

import "../../../../assets/scss/pages/users.scss"
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import Radio from "../../../../components/@vuexy/radio/RadioVuexy"
import { Check, MapPin } from "react-feather"
import Flatpickr from "react-flatpickr";
import { dicalogin } from "../../../../shared/geral"
import { Container } from "./styles";
import * as crypto from "../../../../shared/crypto";

import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import api from "../../../../services/api"
import { testaCPFCNPJ } from "../../../../shared/geral"
import { loginWithJWT } from "../../../../redux/actions/auth/loginActions"
import { history } from "../../../../history"
import ToolBar from "../../../../components/especificos/toolbar"

const schema = Yup.object().shape({
  username: Yup.string()
  .required("O nome é obrigatório")
  .min(10, "Mínimo 10 caracteres"),
  login: Yup.string()
  .required("O login é obrigatório")
  .min(10, "Mínimo 10 caracteres"),
  email: Yup.string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  document: Yup.string()
    .nullable()
    .test("test-name", "CPF/CNPJ inválido",
      function(value) {
        return testaCPFCNPJ(value,true)
    }),
  gender: Yup.string()
    .required("Gênero é obrigatório")
    .oneOf(["F","M"],"Gênero é obrigatório"),
  documenttype: Yup.string()
    .required("CPF/CNPJ é obrigatório")
    .oneOf(["F","J"],"CPF/CNPJ é obrigatório"),
  is_active: Yup
    .boolean(),
  contact_email: Yup
    .boolean(),
  contact_message: Yup
    .boolean(),
  contact_phone: Yup
    .boolean(),
  website: Yup.string()
    .nullable()
    .url("Utilize o formato correto para o Website"),
  twitter: Yup.string()
    .nullable()
    .url("Utilize o formato correto para o Twitter"),
  facebook: Yup.string()
    .nullable()
    .url("Utilize o formato correto para o Facebook"),
  instagram: Yup.string()
    .nullable()
    .url("Utilize o formato correto para o Instagram"),
  street: Yup.string()
    .required("Endereço é obrigatório"),
  number: Yup.string()
    .min(1,"Número deve ser no mínimo 1 digito")
    .max(6,"Número deve ser no máximo 6 digitos")
    .required("O Número é obrigatório"),
  city_id: Yup.number()
    .min(1,"A Cidade é obrigatória")
    .required("A Cidade é obrigatória"),
  profile_id: Yup.number()
    .min(1,"O Perfil é obrigatório")
    .required("O Perfil é obrigatório"),
  zip: Yup.string()
    .required("O CEP  é obrigatório"),
  // outros notOneof(['admin','teste'], 'este nome nao pode')
  // exemplos https://github.com/jquense/yup#usage
});

export default function UserCadastro({ match }) {
  let { id } = match.params
  const [activeTab, setTab] = useState("1")
  const [load, setLoad] = useState(true)
  const [atualiza, setAtualiza] = useState(true);
  const [profiles, setProfiles] = useState([])
  const [countries, setCountries] = useState([])
  const [estados, setEstados] = useState([])
  const [cities, setCities] = useState([])

  const dispatch = useDispatch()

  const [rowData] = useState(
    {
      id: { value: 0,  invalid: false, tab: '1', msg:'' },
      login:    { value: '',  invalid: false, tab: '1', msg:'' },
      username: { value: '',  invalid: false, tab: '1', msg:'' },
      email:    { value: '',  invalid: false, tab: '1', msg:'' },
      avatar: { value: null,  invalid: false, tab: '1', msg:'' },
      avatar_id: { value: null,  invalid: false, tab: '1', msg:'' },
      is_active: { value: true, invalid: false, tab: '1', msg:'' },
      profile_id: { value: 0,  invalid: false, tab: '1', msg:'', select: { value: 0, label: ""} },
      document: { value: '',  invalid: false, tab: '2', msg:'', mask: '999-999-999-99', valueMask:'', label: 'CPF' },
      documenttype: { value: 'F', invalid: false, tab: '2', msg:'' },
      dob:      { value: null, invalid: false, tab: '2', msg:'' },
      mobile:    { value: '',  invalid: false, tab: '2', msg:'', mask: '(99)9999-9999', valueMask:'', label: 'celular' },
      phone:    { value: '',  invalid: false, tab: '2', msg:'', mask: '(99)9999-9999', valueMask:'', label: 'fixo' },
      gender:    { value: '',  invalid: false, tab: '2', msg:'' },
      contact_email:  { value: false, invalid: false, tab: '2', msg:'' },
      contact_message:  { value: false, invalid: false, tab: '2', msg:'' },
      contact_phone:  { value: false, invalid: false, tab: '2', msg:'' },
      country_id: { value: 1,  invalid: false, tab: '2', msg:'', select: { value: 0, label: "Brasil"} },
      state_id: { value: 0,  invalid: false, tab: '2', msg:'', select: { value: 0, label: "RS"} },
      city_id: { value: 0,  invalid: false, tab: '2', msg:'', select: { value: 0, label: "POA"} },
      street: { value: '',  invalid: false, tab: '2', msg:'' },
      number: { value: 0,  invalid: false, tab: '2', msg:'' },
      complement: { value: '',  invalid: false, tab: '2', msg:'' },
      addresstype: { value: '1',  invalid: false, tab: '2', msg:'' },
      zip: { value: '',  invalid: false, tab: '2', msg:'', mask: '99999-999', valueMask:'', label: 'zip' },
      website:    { value: '',  invalid: false, tab: '3', msg:'' },
      twitter:    { value: '',  invalid: false, tab: '3', msg:'' },
      facebook:    { value: '',  invalid: false, tab: '3', msg:'' },
      instagram:    { value: '',  invalid: false, tab: '3', msg:'' },
    } )
    const toolBarList = [
      {
        id: 'toolbar1',
        color: 'primary',
        buttomClassName: "mr-1 mb-1",
        icon: 'PlusCircle',
        size: 21,
        label: null,
        outline: false,
        tooltip: "Incluir",
        action: () => history.push(`/app/user/cadastro/0`)
      },

      {
        id: 'toolbar3',
        color: 'primary',
        buttomClassName: "mr-1 mb-1",
        icon: 'RefreshCw',
        size: 21,
        label:  null,
        outline: false,
        tooltip: 'Atualiza',
        action: () => handleDados("9")
      },
      {
        id: 'toolbar4',
        color: 'primary',
        buttomClassName: "mr-1 mb-1",
        icon: 'List',
        size: 21,
        label: null,
        outline: false,
        tooltip:  'Lista',
        action: () => history.push(`/app/user/list`)
      },
      {
        id: 'toolbar5',
        color: 'primary',
        buttomClassName: "mr-1 mb-1",
        icon: 'ArrowRight',
        size: 21,
        label: null,
        outline: true,
        tooltip: 'Próximo',
        action: () => toggle("-1")
      },
      {
        id: 'toolbar2',
        color: 'warning',
        buttomClassName: "mr-1 mb-1",
        icon: 'Save',
        size: 21,
        label: null,
        outline: false,
        tooltip: "Salvar",
        action: () => handleSubmit()
      }
    ]
  const [iniciais, setIniciais] = useState("")
  const [url, setUrl] = useState(null)
  const edicao = id > 0;

  const auth = useSelector(state => state.auth);

  const [file] = useState(null);

  const ref = useRef();

  async function handleChangeFile(e) {
    const data = new FormData();

    data.append("file", e.target.files[0]);

    const url = URL.createObjectURL(e.target.files[0])

    // const response = await api.post("files", data);

    // const { id: idfile, url } = response.data;
    handleChange("avatar.value", data)
    handleChange("avatar_id.value", null)
    // setFile(idfile);
    handleImg(url)
    // handleChange("avatar_id.value", idfile)
  }
  function handleImg(par) {
    handleChange("files.url", par)
    setUrl(par)
    if(par === null) {
      handleChange("avatar_id.value", null)
      handleChange("avatar.value", null)
    }
  }
  useEffect(() => {
    async function loadrowData() {
      //Profile
      let body = {
        licence_id: auth.login.licence_id,
        id: 0
      };
      let response = await api.post("/profiles.list", {
        ...body
      });
      setProfiles(response.data)

      //Countries
      body = {
        id: 0
      };
      response = await api.post("/countries.list", {
        ...body
      });
      setCountries(response.data)

      // Usuários
      if(id > 0) {
        body = {
          licence_id: auth.login.licence_id,
          id: parseInt(id)
        };
        response = await api.post("/users.list", {
          ...body
        });
        if(response.data !== undefined && response.data[0] !== undefined )
        {
          let dados = response.data[0]
          if(dados.addresses !== undefined)
          {
            if(dados.addresses[0] !== undefined)
            {
              rowData.street.value = dados.addresses[0].street
              rowData.number.value = dados.addresses[0].number
              rowData.complement.value = dados.addresses[0].complement
              rowData.addresstype.value = dados.addresses[0].addresstype
              rowData.zip.value = dados.addresses[0].zip
              rowData.country_id.value = dados.addresses[0].cities.states.countries.id ? dados.addresses[0].cities.states.countries.id : 0
              rowData.state_id.value = dados.addresses[0].cities.states.id ? dados.addresses[0].cities.states.id : 0
              rowData.city_id.value = dados.addresses[0].cities.id ? dados.addresses[0].cities.id : 0
            }
          }

          _.unset(dados,'addresses')
          rowData.id.value = parseInt(id)
          rowData.login.value = dados.login
          rowData.username.value = dados.username
          rowData.email.value = dados.email
          rowData.document.value = dados.document
          rowData.documenttype.value = dados.documenttype
          rowData.dob.value = dados.dob
          rowData.mobile.value = dados.mobile
          rowData.phone.value = dados.phone
          rowData.gender.value = dados.gender
          rowData.website.value = dados.website
          rowData.contact_email.value = dados.contact_email
          rowData.contact_message.value = dados.contact_message
          rowData.contact_phone.value = dados.contact_phone
          rowData.avatar_id.value = dados.avatar_id
          rowData.twitter.value = dados.twitter
          rowData.facebook.value = dados.facebook
          rowData.instagram.value = dados.instagram
          rowData.is_active.value = dados.is_active
          rowData.avatar.value = dados.files
          rowData.profile_id.value = dados.pivot && dados.pivot.profile_id ? dados.pivot.profile_id : 0
          setIniciais(dicalogin(dados.username))
          setUrl(dados.files ? dados.files.url : null)

        }
      }
      setLoad(false)
    }
    if (id !== null && auth !== undefined && load) {
      loadrowData();
    }
  }, [auth, id, load]); // eslint-disable-line
  useEffect(() => {
    if(countries.length>0 && !load) {
      handlePopula(true,true,rowData.country_id.value,rowData.state_id.value)
    }
  }, [countries, load]); // eslint-disable-line

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
  function handleDados(par) {
    if(par === "9")
    {
      setLoad(!load)
    }
  }
  function handleChange(id, value) {
    _.set(rowData, id, value);
  }

  function handleChangeMask(id, idMask, valueMask) {
    _.set(rowData, idMask, valueMask);
    let value = valueMask.replace(/\D/g, '')
    _.set(rowData, id, value)
  }

  function handlePopula(popEstado,popCidade,valueCountry,valueEstado) {
    let statesAux=[]
    let citiesAux=[]
    if(popEstado) {
      const pais =  countries.find(
        country => country.id === valueCountry
      )
      if(pais !== undefined) {
        statesAux = pais.states
      }
      setEstados(statesAux)
    }
    else {
      statesAux = estados
    }
    if(popCidade) {
      const estado =  statesAux.find(
        country => country.id === valueEstado
      )
      if(estado !== undefined) {
        citiesAux = estado.cities
      }
      setCities(citiesAux)
    }
  }
  function handleChangeSelect(id, idSelect, value, select) {
    if(id==="country_id.value") {
        handlePopula(true,false,value,0)
        setCities([])
      _.set(rowData,"state_id.value", 0);
      _.set(rowData,"city_id.value", 0);
    }
    if(id==="state_id.value") {
      handlePopula(false,true,0,value)
      _.set(rowData,"city_id.value", 0);
    }
    _.set(rowData, id, value);
    if(select !== undefined) {
      _.set(rowData, idSelect, select)
    }
    setAtualiza(!atualiza)
  }
  function onChangeDocumentType(par) {
    // if (/^3[47]/.test(value)) {
    if (par==="F"){
      rowData.document.mask = "999-999-999-99"
      rowData.document.label = 'CPF'
      rowData.document.value = ''
    }
    else
    {
      rowData.document.mask = "99-999-999/9999-99"
      rowData.document.label = 'CNPJ'
      rowData.document.value = ''
    }
    handleChange("documenttype.value", par)
    setAtualiza(!atualiza)
  }

  async function handleSubmit() {
    try {
      for(var row in rowData){
        rowData[row].invalid = false
        rowData[row].msg = ""
      }
      await schema.validate(
        {
          login: rowData.login.value,
          username: rowData.username.value,
          email: rowData.email.value,
          document: rowData.document.value,
          documenttype: rowData.documenttype.value,
          dob:      rowData.dob.value,
          mobile:    rowData.mobile.value,
          phone:    rowData.phone.value,
          gender:    rowData.gender.value,
          website:    rowData.website.value,
          contact_email:  rowData.contact_email.value,
          contact_message:  rowData.contact_message.value,
          contact_phone:  rowData.contact_phone.value,
          avatar_id: rowData.avatar_id.value,
          twitter:    rowData.twitter.value,
          facebook:    rowData.facebook.value,
          instagram:    rowData.instagram.value,
          is_active: rowData.is_active.value,
          street: rowData.street.value,
          number: rowData.number.value ,
          zip: rowData.zip.value,
          city_id: rowData.city_id.value,
          profile_id: rowData.profile_id.value
        },
        {
          abortEarly: false
        }
      );
      let data=null
      if(rowData.avatar.value !== null && rowData.avatar_id.value === null) {
        data = rowData.avatar.value
        const response = await api.post("files", data)
        rowData.avatar_id.value = response.data.id
        rowData.avatar.value = response.data
      }

      data = {
        user: {
          id: rowData.id.value,
          login: rowData.login.value,
          username: rowData.username.value,
          email: rowData.email.value,
          document: rowData.document.value,
          documenttype: rowData.documenttype.value,
          is_active: rowData.is_active.value,
          dob:      rowData.dob.value,
          mobile:    rowData.mobile.value,
          phone:    rowData.phone.value,
          gender:    rowData.gender.value,
          website:    rowData.website.value,
          contact_email:  rowData.contact_email.value,
          contact_message:  rowData.contact_message.value,
          contact_phone:  rowData.contact_phone.value,
          avatar_id: rowData.avatar_id.value,
          twitter:    rowData.twitter.value,
          facebook:    rowData.facebook.value,
          instagram:    rowData.instagram.value,
          profile_id:  rowData.profile_id.value,
          userlog_id:   auth.login.values.loggedInUser.id,
          licence_id: auth.login.licence_id
        },
        addresses: [{
          street: rowData.street.value,
          number: rowData.number.value ,
          complement: rowData.complement.value,
          addresstype: rowData.addresstype.value,
          zip: rowData.zip.value,
          city_id: rowData.city_id.value,
          userlog_id:   auth.login.values.loggedInUser.id
        }]
      }
      if (!edicao) {
        try {


          const response = await api.post(`/users`, data);
          id = response.data.data.id
          rowData.id.value = id
          setIniciais(dicalogin(response.data.data.username))
          history.push(`/app/user/cadastro/${id}`)
          toast.success("Usuário incluido com sucesso!", { transition: Flip });
        } catch (error) {
          if (typeof error.response !== 'undefined')
          {
            if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
            {
              if(error.response.data.message !== undefined) {
                toast.error(error.response.data.message, { transition: Flip });
              }
              else{
                toast.error(`Erro ao Incluir o usuário! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao Incluir o usuário! ${error.message}`, { transition: Flip });
          }
        }
      } else {
        try {
          await api.put(`/users`, data);
          if(auth.login.values.loggedInUser.id === parseInt(id)) {
            let cryptoPassword = crypto.decryptByDESModeCBC(auth.login.values.loggedInUser.password)
            dispatch(loginWithJWT({
              id: auth.login.values.loggedInUser.id,
              name: rowData.username.value,
              login: rowData.login.value,
              email: rowData.email.value,
              password: cryptoPassword,
              userRole: auth.login.values.loggedInUser.userRole,
              remember: auth.login.values.loggedInUser.remember,
              token: auth.login.token,
              avatar: rowData.avatar.value,
              licences: auth.login.values.loggedInUser.licences
            }));
          }
          toast.success("Usuário atualizado com sucesso!", { transition: Flip });
        } catch (error) {
          if (typeof error.response !== 'undefined')
          {
            if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
            {
              if(error.response.data.message !== undefined) {
                toast.error(error.response.data.message, { transition: Flip });
              }
              else{
                toast.error(`Erro ao Incluir o usuário! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao atualizar o usuário! ${error.message}`, { transition: Flip });
          }
        }
      }
    } catch (error) {
      let validErrors = "";
      let tabAux = "";
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach(err => {
          validErrors = `${validErrors} ${err.message}`;

          rowData[err.path].invalid = true
          rowData[err.path].msg = err.message
          if(tabAux ==="" || rowData[err.path].tab < tabAux) {
            tabAux = rowData[err.path].tab
          }
        });
        if (validErrors.length > 0) {
          toast.error(
            `Dados incorretos ao ${
              id === "0" ? "incluir" : "alterar"
            } o usuário.`
          , { transition: Flip });
        }
        toggle(tabAux)
        // setAtualiza(!atualiza)
      } else {
        toast.error(
          `Não foi possível ${id === "0" ? "incluir" : "alterar"} o usuário. ${error.message}`
        , { transition: Flip });
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
                        <img
                          // className="users-avatar-shadow rounded"
                          // object
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
                {rowData.username ? rowData.username.value : null}
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
                    defaultValue= {rowData.username.value ? rowData.username.value : null}
                    id="username.value"
                    placeholder="Nome"
                    onChange={e => handleChange(e.target.id,e.target.value)}
                    invalid={rowData.username.invalid}
                  />
                  <FormFeedback>{rowData.username.msg}</FormFeedback>
              </Col>
              <Col md="6" sm="12">
                {/* <FormGroup>
                  <Label for="role">Perfil</Label>
                  <Input type="select" name="role" id="role">
                    <option>User</option>
                    <option>Staff</option>
                  </Input>
                </FormGroup> */}
                <FormGroup>
                  <Label for="role">Perfil</Label>
                  <Select
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option.id}
                    className="React"
                    classNamePrefix="select"
                    isSearchable={false}
                    name="profile"
                    options={profiles}
                    value={profiles.filter(option => option.id === rowData.profile_id.value)}
                    onChange={e => handleChangeSelect("profile_id.value","profile_id.select",e.id,e)}
                  />
                   {rowData.profile_id.invalid ? <div className="text-danger font-small-2">{rowData.profile_id.msg}</div>: null }
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="login">Login</Label>
                  <Input
                    type="text"
                    defaultValue={rowData.login ? rowData.login.value : null}
                    id="login.value"
                    placeholder="Login"
                    onChange={e => handleChange(e.target.id,e.target.value)}
                    invalid={rowData.login.invalid}
                  />
                  <FormFeedback>{rowData.login.msg}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="email">E-mail</Label>
                  <Input
                    type="text"
                    defaultValue={rowData.email ? rowData.email.value : null}
                    id="email.value"
                    placeholder="E-mail"
                    onChange={e => handleChange(e.target.id,e.target.value)}
                    invalid={rowData.email.invalid}
                  />
                  <FormFeedback>{rowData.email.msg}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label className="d-block mb-50">Ativo</Label>
                  <div className="d-inline-block mr-1">
                    <Radio
                      label="Sim"
                      color="primary"
                      defaultChecked={rowData.is_active.value}
                      onChange={e => handleChange("is_active.value", true)}
                      name="is_active"
                    />
                  </div>
                  <div className="d-inline-block mr-1">
                    <Radio
                      label="Não"
                      color="primary"
                      defaultChecked={!rowData.is_active.value}
                      onChange={e => handleChange("is_active.value",false)}
                      name="is_active"
                    />
                  </div>
                </FormGroup>

              </Col>
              {/* <Col
                className="d-flex justify-content-end flex-wrap mt-2"
                sm="12"
              >
                <Button.Ripple className="mr-1" color="primary" onClick={() => toggle("2")}>
                  Proximo
                </Button.Ripple>
                <Button.Ripple color="flat-warning" onClick={() => handleDados("9")} >Limpar</Button.Ripple>
              </Col> */}
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
                value={rowData.dob.value}
                onChange={date => handleChange("dob.value", date[0].toJSON())}
                // onChange={date => this.handledob(date)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="mobile">Número Celular</Label>
              <Input
                type="text"
                placeholder={rowData.mobile.label}
                required
                defaultValue={rowData.mobile.value}
                mask={rowData.mobile.mask}
                onChange={e => handleChangeMask("mobile.value",'mobile.valueMask',e.target.value)}
                invalid={rowData.mobile.invalid}
                tag={InputMask}
              />
              <Label>{rowData.mobile.label}</Label>
              <FormFeedback>{rowData.mobile.msg}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                placeholder={rowData.phone.label}
                required
                defaultValue={rowData.phone.value}
                mask={rowData.phone.mask}
                onChange={e => handleChangeMask("phone.value",'phone.valueMask',e.target.value)}
                invalid={rowData.phone.invalid}
                tag={InputMask}
              />
              <Label for="phone">Telefone Fixo</Label>
              <FormFeedback>{rowData.phone.msg}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label className="d-block mb-50">Gênero</Label>
              <div className="d-inline-block mr-1">
                <Radio
                  label="Masculino"
                  color="primary"
                  defaultChecked={rowData.gender.value === 'M' ? true : false}
                  onChange={e => handleChange("gender.value", "M")}
                  name="gender.value"
                />
              </div>
              <div className="d-inline-block mr-1">
                <Radio
                  label="Feminino"
                  color="primary"
                  defaultChecked={rowData.gender.value === 'F' ? true : false}
                  onChange={e => handleChange("gender.value","F")}
                  name="gender.value"
                />
              </div>
              {rowData.gender.invalid ? <div className="text-danger font-small-2">{rowData.gender.msg}</div>: null }
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
                  defaultChecked={rowData.contact_email.value}
                  id="contact_email.value"
                  onChange={e => handleChange("contact_email.value",e.target.checked)}
                />
              </div>
              <div className="d-inline-block mr-1">
                <Checkbox
                  color="primary"
                  icon={<Check className="vx-icon" size={16} />}
                  label="SMS"
                  id="contact_message.value"
                  defaultChecked={rowData.contact_message.value}
                  onChange={e => handleChange("contact_message.value",e.target.checked)}
                />
              </div>
              <div className="d-inline-block">
                <Checkbox
                  color="primary"
                  icon={<Check className="vx-icon" size={16} />}
                  label="Telefone"
                  id="contact_phone.value"
                  defaultChecked={rowData.contact_phone.value}
                  onChange={e => handleChange("contact_phone.value",e.target.checked)}
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label className="d-block mb-50">Pessoa</Label>
              <div className="d-inline-block mr-1">
                <Radio
                  label="Física"
                  color="primary"
                  defaultChecked={rowData.documenttype.value==="F"}
                  name="documenttype.value"
                  onChange={e => onChangeDocumentType("F")}
                />
              </div>
              <div className="d-inline-block mr-1">
                <Radio
                  label="Jurídica"
                  color="primary"
                  defaultChecked={rowData.documenttype.value==="J"}
                  name="documenttype.value"
                  onChange={e => onChangeDocumentType("J")}
                />
              </div>
              {rowData.documenttype.invalid ? <td className="text-danger font-small-2" >{rowData.documenttype.msg}</td>: null }
            </FormGroup>
            <FormGroup className="form-label-group">
              <Input
                type="text"
                placeholder={rowData.document.label}
                required
                defaultValue={rowData.document.value}
                mask={rowData.document.mask}
                onChange={e => handleChangeMask("document.value",'document.valueMask',e.target.value)}
                invalid={rowData.document.invalid}
                tag={InputMask}
              />
              <Label>{rowData.document.label}</Label>
              <FormFeedback>{rowData.document.msg}</FormFeedback>
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
                id="street.value"
                placeholder="Endereço"
                defaultValue={rowData.street.value}
                onChange={e => handleChange(e.target.id,e.target.value)}
                invalid={rowData.street.invalid}
                />
              <FormFeedback>{rowData.street.msg}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="numero">Número</Label>
              <Input
                type="number"
                id="number.value"
                placeholder="Número"
                defaultValue={rowData.number.value}
                onChange={e => handleChange(e.target.id,e.target.value)}
                invalid={rowData.number.invalid}
                />
              <FormFeedback>{rowData.number.msg}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="complement">Complemento</Label>
              <Input
                type="text"
                id="complement.value"
                placeholder="Complemento"
                defaultValue={rowData.complement.value}
                onChange={e => handleChange(e.target.id,e.target.value)}
                invalid={rowData.complement.invalid}
              />
              <FormFeedback>{rowData.complement.msg}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="pincode">CEP</Label>
              <Input
                type="text"
                placeholder={rowData.zip.label}
                required
                defaultValue={rowData.zip.value}
                mask={rowData.zip.mask}
                onChange={e => handleChangeMask("zip.value",'zip.valueMask',e.target.value)}
                invalid={rowData.zip.invalid}
                tag={InputMask}
              />
               <FormFeedback>{rowData.zip.msg}</FormFeedback>
            </FormGroup>
            <Row>
              <Col  md="4" sm="12">
                 <FormGroup>
                  <Label for="role">País</Label>
                  <Select
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option.id}
                    className="React"
                    classNamePrefix="select"
                    isSearchable={false}
                    name="country"
                    options={countries}
                    value={countries.filter(option => option.id === rowData.country_id.value)}
                    onChange={e => handleChangeSelect("country_id.value","country_id.select",e.id,e)}
                  />
                </FormGroup>
              </Col>
              <Col  md="4" sm="12">
                <FormGroup>
                  <Label for="role">Estado</Label>
                  <Select
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option.id}
                    className="React"
                    classNamePrefix="select"
                    isSearchable={false}
                    name="state"
                    options={estados}
                    value={estados.filter(option => option.id === rowData.state_id.value)}
                    onChange={e => handleChangeSelect("state_id.value","state_id.select",e.id,e)}
                  />
                </FormGroup>
              </Col>
              <Col  md="4" sm="12">
                <FormGroup>
                  <Label>Cidade</Label>
                  <Select
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option.id}
                    className="React"
                    classNamePrefix="select"
                    isSearchable={false}
                    name="city"
                    options={cities}
                    value={cities.filter(option => option.id === rowData.city_id.value)}
                    onChange={e => handleChangeSelect("city_id.value","city_id.select",e.id,e)}
                    invalid={true}
                  />
                  {rowData.city_id.invalid ? <div className="text-danger font-small-2">{rowData.city_id.msg}</div>: null }
                  {/* <label>teste</label> */}
                </FormGroup>
              </Col>
            </Row>
          </Col>
          {/* <Col className="d-flex justify-content-end flex-wrap" sm="12">
            <Button.Ripple className="mr-1" color="primary" onClick={() => toggle("3")}>
              Proximo
            </Button.Ripple>
            <Button.Ripple color="flat-warning" onClick={() => handleDados("9")} >Limpar</Button.Ripple>
          </Col> */}
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
                id="website.value"
                placeholder="Endereço Web"
                defaultValue={rowData.website.value}
                onChange={e => handleChange(e.target.id,e.target.value)}
                invalid={rowData.website.invalid}
              />
              <div className="form-control-position">
                <Cloud size={15} />
              </div>
              <FormFeedback>{rowData.website.msg}</FormFeedback>
            </FormGroup>
            <Label for="twitter">Twitter</Label>
            <FormGroup className="position-relative has-icon-left">
              <Input
                id="twitter.value"
                placeholder="https://www.twitter.com/"
                defaultValue={rowData.twitter.value}
                onChange={e => handleChange(e.target.id,e.target.value)}
                invalid={rowData.twitter.invalid}
              />
              <div className="form-control-position">
                <Twitter size={15} />
              </div>
              <FormFeedback>{rowData.twitter.msg}</FormFeedback>
            </FormGroup>

          </Col>
          <Col md="6" sm="12">
            <Label for="facebook">Facebook</Label>
            <FormGroup className="position-relative has-icon-left">
              <Input
                id="facebook.value"
                placeholder="https://www.facebook.com/"
                defaultValue={rowData.facebook.value}
                onChange={e => handleChange(e.target.id,e.target.value)}
                invalid={rowData.facebook.invalid}
              />
              <div className="form-control-position">
                <Facebook size={15} />
              </div>
            </FormGroup>
            <Label for="instagram">Instagram</Label>
            <FormGroup className="position-relative has-icon-left">
              <Input
                id="instagram.value"
                placeholder="https://www.instagram.com/"
                defaultValue={rowData.instagram.value}
                onChange={e => handleChange(e.target.id,e.target.value)}
                invalid={rowData.instagram.invalid}
              />
              <div className="form-control-position">
                <Instagram size={15} />
              </div>
              <FormFeedback>{rowData.instagram.msg}</FormFeedback>
            </FormGroup>
          </Col>
          {/* <Col className="d-flex justify-content-end flex-wrap" sm="12">
            <Button.Ripple className="mr-1" color="primary" onClick={() => handleSubmit()}>
              Gravar
            </Button.Ripple>
            <Button.Ripple color="flat-warning" onClick={() => handleDados("9")} >Limpar</Button.Ripple>
          </Col> */}
        </Row>
      </Form>
    )
  }

  return (
    <Row>
      <Col sm="12">
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
                </div>
                <div className="filter-actions d-flex">
                 <ToolBar toolBarList={toolBarList} typeBar="1"/>
                </div>
              </div>
            </div>
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
            {/* <hr className="my-2" />
            <div className="card-btns d-flex justify-content-between">
              <div className="float-right">
                <ToolBar toolBarList={toolBarList} typeBar="2"/>
              </div>
            </div> */}
          </CardBody>
        </Card>
      </Col>
    </Row>
  )

}
