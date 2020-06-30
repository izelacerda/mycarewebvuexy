import React, { useState, useEffect, useRef } from "react"
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalBody,
  Media,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback,
  Spinner
} from "reactstrap"
import _ from 'lodash';
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames"
import { User, Info } from "react-feather"
import { toast, Flip } from "react-toastify"
import * as Yup from "yup";
import InputMask from "react-input-mask"
import Select from "react-select"


import Chip from "../../../../components/@vuexy/chips/ChipComponent"
import "../../../../assets/scss/pages/users.scss"
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import Radio from "../../../../components/@vuexy/radio/RadioVuexy"
import { Check, MapPin } from "react-feather"
import Flatpickr from "react-flatpickr";
import { dicalogin } from "../../../../shared/geral"
import { ContainerAvatar } from "./styles";
import * as crypto from "../../../../shared/crypto";

import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import api from "../../../../services/api"
import { testaCPFCNPJ } from "../../../../shared/geral"
import { loginWithJWT } from "../../../../redux/actions/auth/loginActions"
import ToolBar from "../../../../components/especificos/toolbar"

import "../../../../assets/scss/especificos/mymodal.css"

const schema = Yup.object().shape({
  name: Yup.string()
  .required("O nome é obrigatório")
  .min(10, "Mínimo 10 caracteres"),
  email: Yup.string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  documenttype: Yup.string()
    .required("CPF/CNPJ é obrigatório")
    .oneOf(["F","J"],"CPF/CNPJ é obrigatório"),
  document: Yup.string()
    // .nullable()
    .required("CPF/CNPJ é obrigatório")
    .min(11, "Mínimo 11 caracteres")
    .max(14, 'Máximo 14 caracteres')
    .test("test-name", "CPF/CNPJ inválido",
      function(value) {
        return testaCPFCNPJ(value,true)
    }),
  gender: Yup.string()
    .required("Gênero é obrigatório")
    .oneOf(["F","M"],"Gênero é obrigatório"),
  is_active: Yup
    .boolean(),
  contact_email: Yup
    .boolean(),
  contact_message: Yup
    .boolean(),
  contact_phone: Yup
    .boolean(),
  street: Yup.string()
    .required("Endereço é obrigatório"),
  number: Yup.string()
    .min(1,"Número deve ser no mínimo 1 digito")
    .max(6,"Número deve ser no máximo 6 digitos")
    .required("O Número é obrigatório"),
  city_id: Yup.number()
    .min(1,"A Cidade é obrigatória")
    .required("A Cidade é obrigatória"),
  zip: Yup.string()
    .required("O CEP  é obrigatório"),
  // outros notOneof(['admin','teste'], 'este nome nao pode')
  // exemplos https://github.com/jquense/yup#usage
});

export default function ProviderCadastro(props) {
  let listaPermission = props.userPermission.includes(25)
  let insertPermission = props.userPermission.includes(26)
  let updatePermission = props.userPermission.includes(27)
  let dadosdoCadastroPermission = props.userPermission.includes(30)
  let salvarPermission = true

  const [id, setId]  = useState(props.id)
  const [edicao, setEdicao] = useState(props.id > 0)
  if(edicao) {
    if(!updatePermission) {
      salvarPermission = false
    }
  }
  else {
    if(!insertPermission) {
      salvarPermission = false
    }
  }
  const [activeTab, setTab] = useState("1")
  const [loaded, setLoaded] = useState(false)
  const [atualiza, setAtualiza] = useState(true);

  const baseData = {
    id: { value: 0,  invalid: false, tab: '1', msg:'' },
    login:    { value: '',  invalid: false, tab: '1', msg:'' },
    name: { value: '',  invalid: false, tab: '1', msg:'' },
    email:    { value: '',  invalid: false, tab: '1', msg:'' },
    avatar: { value: null,  invalid: false, tab: '1', msg:'' },
    avatar_id: { value: null,  invalid: false, tab: '1', msg:'' },
    is_active: { value: true, invalid: false, tab: '1', msg:'' },
    document: { value: '',  invalid: false, tab: '1', msg:'', mask: '999-999-999-99', valueMask:'', label: 'CPF' },
    documenttype: { value: 'F', invalid: false, tab: '1', msg:'' },
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
  }
  const [rowData, setRowData] = useState(baseData)

  const [estados, setEstados] = useState([])
  const [cities, setCities] = useState([])

  const dispatch = useDispatch()

  const toolBarList = [
      {
        id: 'toolbar2',
        color: 'warning',
        buttomClassName: "btn-icon mb-1",
        icon: 'Save',
        size: 21,
        label: null,
        outline: false,
        tooltip: "Salvar",
        disabled: !salvarPermission,
        action: () => handleSubmit()
      },
      {
        id: 'toolbar4',
        color: 'primary',
        buttomClassName: "btn-icon mb-1",
        icon: 'XCircle',
        size: 21,
        label: null,
        outline: false,
        tooltip:  'Fechar',
        disabled: !listaPermission,
        action: () => props.handleSidebar(false)
      }
    ]
  const [iniciais, setIniciais] = useState("")
  const [url, setUrl] = useState(null)

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
      if(!dadosdoCadastroPermission) {
        props.handleSidebar(false)
        return
      }

      setId(props.id)
      setEdicao(props.id>0)
      if(props.id > 0 && props.data) {

        if(props.data.addresses !== undefined)
        {
          if(props.data.addresses[0] !== undefined)
          {
            rowData.street.value = props.data.addresses[0].street
            rowData.number.value = props.data.addresses[0].number
            rowData.complement.value = props.data.addresses[0].complement
            rowData.addresstype.value = props.data.addresses[0].addresstype
            rowData.zip.value = props.data.addresses[0].zip
            rowData.country_id.value = props.data.addresses[0].cities.states.countries.id ? props.data.addresses[0].cities.states.countries.id : 0
            rowData.state_id.value = props.data.addresses[0].cities.states.id ? props.data.addresses[0].cities.states.id : 0
            rowData.city_id.value = props.data.addresses[0].cities.id ? props.data.addresses[0].cities.id : 0
            handlePopula(true,true,rowData.country_id.value,rowData.state_id.value)
          }
        }
        rowData.id.value =  props.data.id
        rowData.login.value = props.data.login
        rowData.name.value = props.data.name
        rowData.email.value = props.data.email
        rowData.document.value = props.data.document
        rowData.documenttype.value = props.data.documenttype
        rowData.dob.value = props.data.dob
        rowData.mobile.value = props.data.mobile
        rowData.phone.value = props.data.phone
        rowData.gender.value = props.data.gender
        rowData.contact_email.value = props.data.contact_email
        rowData.contact_message.value = props.data.contact_message
        rowData.contact_phone.value = props.data.contact_phone
        rowData.avatar_id.value = props.data.avatar_id
        rowData.is_active.value = props.data.is_active
        rowData.avatar.value = props.data.files
        setIniciais(dicalogin(props.data.name))
        setUrl(props.data.files ? props.data.files.url : null)
      }
      else {
        setRowData(baseData)
      }
      setLoaded(true)
      setAtualiza(!atualiza)
    }
    if (id >=0 && auth !== undefined) {
      loadrowData();
    }
  }, [auth, props.id, props.data]) // eslint-disable-line

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
      const pais =  props.countries.find(
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
          name: rowData.name.value,
          email: rowData.email.value,
          document: rowData.document.value,
          documenttype: rowData.documenttype.value,
          dob:      rowData.dob.value,
          mobile:    rowData.mobile.value,
          phone:    rowData.phone.value,
          gender:    rowData.gender.value,
          contact_email:  rowData.contact_email.value,
          contact_message:  rowData.contact_message.value,
          contact_phone:  rowData.contact_phone.value,
          avatar_id: rowData.avatar_id.value,
          is_active: rowData.is_active.value,
          street: rowData.street.value,
          number: rowData.number.value ,
          zip: rowData.zip.value,
          city_id: rowData.city_id.value
        },
        {
          abortEarly: false
        }
      )
      let data=null
      if(rowData.avatar.value !== null && rowData.avatar_id.value === null) {
        data = rowData.avatar.value
        const response = await api.post("files", data)
        rowData.avatar_id.value = response.data.id
        rowData.avatar.value = response.data
      }

      data = {
          id: rowData.id.value,
          login: edicao === false ? rowData.email.value : rowData.login.value,
          name: rowData.name.value,
          email: rowData.email.value,
          document: rowData.document.value,
          documenttype: rowData.documenttype.value,
          is_active: rowData.is_active.value,
          dob:      rowData.dob.value,
          mobile:    rowData.mobile.value,
          phone:    rowData.phone.value,
          gender:    rowData.gender.value,
          contact_email:  rowData.contact_email.value,
          contact_message:  rowData.contact_message.value,
          contact_phone:  rowData.contact_phone.value,
          avatar_id: rowData.avatar_id.value,
          userlog_id:   auth.login.values.loggedInUser.id,
          licence_id: auth.login.licence_id,
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
          const response = await api.post(`/providers`, data);
          rowData.id.value = response.data.id
          props.handleSidebar(false)
          props.handleAdd(response.data[0])
          setRowData(baseData)
          setIniciais(dicalogin(response.data.name))
          toast.success("Profissional incluido com sucesso!", { transition: Flip });
        } catch (error) {
          if (typeof error.response !== 'undefined')
          {
            if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400 || error.response.status === 403  ))
            {
              if(error.response.data.message !== undefined) {
                toast.error(error.response.data.message, { transition: Flip });
              }
              else{
                toast.error(`Erro ao Incluir o Profissional! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao Incluir o Profissional! ${error.message}`, { transition: Flip });
          }
        }
      } else {
        try {
          const response = await api.put(`/providers`, data);
          if(auth.login.values.loggedInUser.id === parseInt(id)) {
            let cryptoPassword = crypto.decryptByDESModeCBC(auth.login.values.loggedInUser.password)
            dispatch(loginWithJWT({
              id: auth.login.values.loggedInUser.id,
              name: rowData.name.value,
              login: rowData.login.value,
              email: rowData.email.value,
              password: cryptoPassword,
              userRole: auth.login.values.loggedInUser.userRole,
              remember: auth.login.values.loggedInUser.remember,
              token: auth.login.token,
              avatar: rowData.avatar.value,
              licences: auth.login.values.loggedInUser.licences,
              permissions:  auth.login.permissions,
            }));
          }
          props.handleSidebar(false)
          props.handleUpdate(response.data[0])
          setRowData(baseData)
          toast.success("Profissional atualizado com sucesso!", { transition: Flip });
        } catch (error) {
          if (typeof error.response !== 'undefined')
          {
            if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
            {
              if(error.response.data.message !== undefined) {
                toast.error(error.response.data.message, { transition: Flip });
              }
              else{
                toast.error(`Erro ao Incluir o Profissional! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao atualizar o Profissional! ${error.message}`, { transition: Flip });
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
            } o Profissional.`
          , { transition: Flip });
        }
        toggle(tabAux)
        setAtualiza(!atualiza)
      } else {
        toast.error(
          `Não foi possível ${id === "0" ? "incluir" : "alterar"} o Profissional. ${error.message}`
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
                <ContainerAvatar>
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
                      disabled={!salvarPermission}
                    />
                  </label>
                </ContainerAvatar>
            </Media>
            <Media className="mt-2" body>
              <Media className="font-medium-1 text-bold-600" tag="p" heading>
                {rowData.name ? rowData.name.value : null}
              </Media>
              <div className="d-flex flex-wrap">
                <Button.Ripple className="mr-1" color="primary" disabled={!salvarPermission} outline onClick={() => handleImg(null)} size="sm" >
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
                  <Label for="name">Nome</Label>
                  <Input
                    type="text"
                    defaultValue= {rowData.name.value ? rowData.name.value : null}
                    id="name.value"
                    placeholder="Nome"
                    onChange={e => handleChange(e.target.id,e.target.value)}
                    invalid={rowData.name.invalid}
                    disabled={!salvarPermission}
                  />
                  <FormFeedback>{rowData.name.msg}</FormFeedback>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="email">E-mail</Label>
                  <Input
                    type="text"
                    defaultValue={rowData.email ? rowData.email.value : null}
                    id="email.value"
                    placeholder="E-mail"
                    onChange={e => handleChange(e.target.id,e.target.value)}
                    invalid={rowData.email.invalid}
                    disabled={!salvarPermission}
                  />
                  <FormFeedback>{rowData.email.msg}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label className="d-block mb-50">Pessoa</Label>
                  <div className="d-inline-block mr-1">
                    <Radio
                      label="Física"
                      color="primary"
                      defaultChecked={rowData.documenttype.value==="F"}
                      name="documenttype.value"
                      onChange={e => onChangeDocumentType("F")}
                      disabled={!salvarPermission}
                    />
                  </div>
                  <div className="d-inline-block mr-1">
                    <Radio
                      label="Jurídica"
                      color="primary"
                      defaultChecked={rowData.documenttype.value==="J"}
                      name="documenttype.value"
                      onChange={e => onChangeDocumentType("J")}
                      disabled={!salvarPermission}
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
                    disabled={!salvarPermission}
                    tag={InputMask}
                  />
                  <Label>{rowData.document.label}</Label>
                  <FormFeedback>{rowData.document.msg}</FormFeedback>
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label className="d-block">Ativo</Label>
                  <div className="d-inline-block mr-1">
                    <Radio
                      label="Sim"
                      color="primary"
                      defaultChecked={rowData.is_active.value}
                      onChange={e => handleChange("is_active.value", true)}
                      name="is_active"
                      disabled={!salvarPermission}
                    />
                  </div>
                  <div className="d-inline-block mr-1">
                    <Radio
                      label="Não"
                      color="primary"
                      defaultChecked={!rowData.is_active.value}
                      onChange={e => handleChange("is_active.value",false)}
                      name="is_active"
                      disabled={!salvarPermission}
                    />
                  </div>
                </FormGroup>


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
                value={rowData.dob.value}
                onChange={date => handleChange("dob.value", date[0].toJSON())}
                disabled={!salvarPermission}
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
                disabled={!salvarPermission}
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
                disabled={!salvarPermission}
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
                  disabled={!salvarPermission}
                />
              </div>
              <div className="d-inline-block mr-1">
                <Radio
                  label="Feminino"
                  color="primary"
                  defaultChecked={rowData.gender.value === 'F' ? true : false}
                  onChange={e => handleChange("gender.value","F")}
                  name="gender.value"
                  disabled={!salvarPermission}
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
                  disabled={!salvarPermission}
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
                  disabled={!salvarPermission}
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
                  disabled={!salvarPermission}
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
                id="street.value"
                placeholder="Endereço"
                defaultValue={rowData.street.value}
                onChange={e => handleChange(e.target.id,e.target.value)}
                invalid={rowData.street.invalid}
                disabled={!salvarPermission}
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
                disabled={!salvarPermission}
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
                disabled={!salvarPermission}
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
                disabled={!salvarPermission}
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
                    options={props.countries}
                    value={props.countries.filter(option => option.id === rowData.country_id.value)}
                    onChange={e => handleChangeSelect("country_id.value","country_id.select",e.id,e)}
                    isDisabled={!salvarPermission}
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
                    isDisabled={!salvarPermission}
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
                    isDisabled={!salvarPermission}
                    invalid={true}
                  />
                  {rowData.city_id.invalid ? <div className="text-danger font-small-2">{rowData.city_id.msg}</div>: null }
                  {/* <label>teste</label> */}
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    )
  }

  return (
    <Modal
        isOpen={props.sidebar ? true : false}
        className="modal-dialog-centered"
        style={{minWidth: '1000px', width: '100%'}}
        toggle={() => props.handleSidebar(false)}
        // style={{minWidth: '1200px', minHeight: '900px', width: '80%', height: '808px', margin: '10px auto'}}

      >
      {/* <ModalHeader toggle={() => toggleModalDelete(null,false)} className="bg-danger">
        Exclusão
      </ModalHeader> */}
      <ModalBody  className="mh-700">
      <div>
          <div>
            <span className="align-middle ml-50">

            { edicao ?
              <Chip
              className="mr-1"
              avatarColor="primary"
              // avatarIcon={<Edit />}
              text="Alteração"
              />
            :
              <Chip
              className="mr-1"
              avatarColor="primary"
              // avatarIcon={<Plus />}
              text="Inclusão"
              />
            }

            </span>
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
              </Nav>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <ToolBar toolBarList={toolBarList} typeBar="1"/>
          </div>
        </div>
        {loaded === true ?
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <FormTab1 />
            </TabPane>
            <TabPane tabId="2">
              <FormTab2 />
            </TabPane>
          </TabContent>
        :
            <Spinner color="primary" className="reload-spinner" />
        }
      </ModalBody>
      {/* <ModalFooter>
        <Button color="danger" onClick={() => handleDelete()}>
          Confirmar
        </Button>{" "}
      </ModalFooter> */}
    </Modal>
  )
}
