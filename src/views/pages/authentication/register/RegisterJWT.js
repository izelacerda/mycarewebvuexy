import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback
} from "reactstrap"
import InputMask from "react-input-mask"

import { toast, Flip } from "react-toastify"

import { useDispatch } from "react-redux";
import * as Yup from "yup";
import Select from "react-select"
import classnames from "classnames"
import { User, Info } from "react-feather"
import _ from 'lodash';

import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import Radio from "../../../../components/@vuexy/radio/RadioVuexy"

import { Check } from "react-feather"
import { history } from "../../../../history"
import api from "../../../../services/api";
import { testaCPFCNPJ } from "../../../../shared/geral"

import { loginWithJWT, signFailure } from "../../../../redux/actions/auth/loginActions"

const schema = Yup.object().shape({
  username: Yup.string()
  .required("O nome é obrigatório")
  .min(10, "Mínimo 10 caracteres"),
  login: Yup.string()
  .required("O login é obrigatório")
  .min(10, "Mínimo 10 caracteres"),
  company: Yup.string()
  .required("O nome da licença é obrigatório")
  .min(6, "Mínimo 6 caracteres"),
  email: Yup.string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: Yup.string()
    .required("A senha é obrigatória")
    .min(6, "Mínimo 6 caracteres")
    .max(10, 'Máximo 10 caracteres'),
  password_confirmation: Yup.string()
    .required("A Confirmação de senha é obrigatória")
    .min(6, "Mínimo 6 caracteres")
    .max(10, 'Máximo 10 caracteres')
    .test('passwords-match', 'Password e Confirmação devem ser iguais', function(value) {
      return this.parent.password === value;
    }),
  document: Yup.string()
    .required("CPF/CNPJ é obrigatório")
    .min(11, "Mínimo 11 caracteres")
    .max(14, 'Máximo 14 caracteres')
    .test("test-name", "CPF/CNPJ inválido",
      function(value) {
        return testaCPFCNPJ(value,false)
    }),
  documenttype: Yup.string()
    .required("CPF/CNPJ é obrigatório")
    .oneOf(["F","J"]),
  price_id: Yup.number()
  .required("Tipo do Plano é obrigatório")
  .oneOf([1,2,3]),
  aceitar: Yup
    .boolean()
    .label('aceitar')
    .test(
      'is-true',
      'Deve aceitar os termos para continuar',
      value => value === true
    ),

  // outros notOneof(['admin','teste'], 'este nome nao pode')
  // exemplos https://github.com/jquense/yup#usage
});

const priceOptions = [
  { value: 1, label: "Gratuito" },
  { value: 2, label: "Plano Mensal" },
  { value: 3, label: "Plano Anual" }
]
export default function RegisterJWT() {
  const [atualiza, setAtualiza] = useState(true);
  const [rowData] = useState(
    {
      login:    { value: '',  invalid: false, tab: '1', msg:'' },
      username: { value: '',  invalid: false, tab: '1', msg:'' },
      company:  { value: '',  invalid: false, tab: '2', msg:''},
      email:    { value: '',  invalid: false, tab: '1',msg:'' },
      password: { value: '',  invalid: false, tab: '1',msg:'' },
      password_confirmation: { value: '', invalid: false, tab: '1',msg:'' },
      document: { value: '',  invalid: false, tab: '2',msg:'', mask: '999-999-999-99', valueMask:'', label: 'CPF' },
      price_id: { value: 1,  invalid: false, tab: '2',msg:'', select: { value: 1, label: "Gratuito"} },
      documenttype: { value: 'F', invalid: false, tab: '2',msg:'' },
      aceitar:  { value: false, invalid: false, tab: '2',msg:'' },
    } )
  const [activeTab, setTab] = useState("1")

  const dispatch = useDispatch()

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

  async function handleRegister(e) {
    try {
      e.preventDefault()
      for(var row in rowData){
        rowData[row].invalid = false
        rowData[row].msg = ""
      }
      if(rowData.aceitar.value !== true)
      {
        toast.error("Você deve aceitar os termos e condições do contrato", { transition: Flip });
        return;
      }
      await schema.validate(
        {
          login: rowData.login.value,
          username: rowData.username.value,
          company: rowData.company.value,
          email: rowData.email.value,
          password: rowData.password.value,
          password_confirmation: rowData.password_confirmation.value,
          document: rowData.document.value,
          price_id: rowData.price_id.value,
          documenttype: rowData.documenttype.value,
          aceitar: rowData.aceitar.value,
        },
        {
          abortEarly: false
        }
      );
      let data = {
        id: 0,
        login: rowData.login.value,
        username: rowData.username.value,
        email: rowData.email.value,
        document: rowData.document.value,
        documenttype: rowData.documenttype.value,
        password: rowData.password.value,
        password_confirmation: rowData.password_confirmation.value,
        is_active: true,
        dob:      null,
        mobile:    null,
        phone:    null,
        gender:    null,
        website:    null,
        contact_email:  false,
        contact_message:  false,
        contact_phone:  false,
        avatar_id: null,
        twitter:    null,
        facebook:    null,
        instagram:    null,
        profile_id:  null,
        userlog_id:   null,
        price_id: rowData.price_id.value,
        company: rowData.company.value,
        licence_id: 0,
        addresses: []
      }
      await api.post("/users", data);
      const response = await api.post("/sessions", {
        application_id: 1,
        login: rowData.login.value,
        password: rowData.password.value,
      });
      const { token, user } = response.data;
      const { id, name, userRole, licences, permissions } = user;

      api.defaults.headers.Authorization = `Bearer ${token}`;

      dispatch(loginWithJWT({ id, name, login: rowData.login.value, email: rowData.email.value, password: rowData.password.value, userRole, remember: true, token, avatar: null, licences, permissions }));

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
            // `Não foi possível incluir o usuário. ${validErrors}`
            `Erro ao incluir o usuário.`, { transition: Flip }
          );
        }
        toggle(tabAux)
        setAtualiza(!atualiza)

      } else {
        if (typeof error.response !== 'undefined')
        {
          if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400  || error.response.status === 403 ))
          {
            toast.error(error.response.data.message, { transition: Flip });
          }
        }
        dispatch(signFailure());
      }
    }
  }
  function toggle(tab) {
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
  function handleChangeSelect(id, idSelect, value, select) {
    _.set(rowData, id, value);
    _.set(rowData, idSelect, select)
  }

  function FormTab1() {
    return (
      <Form onSubmit={e => e.preventDefault()}>
        <FormGroup className="form-label-group">
          <Input
            type="text"
            placeholder="Nome"
            defaultValue={rowData.username.value}
            id="username.value"
            onChange={e => handleChange(e.target.id,e.target.value)}
            invalid={rowData.username.invalid}
          />
          <Label>Nome</Label>
          <FormFeedback>{rowData.username.msg}</FormFeedback>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="text"
            placeholder="Login"
            defaultValue={rowData.login.value}
            id="login.value"
            onChange={e => handleChange(e.target.id,e.target.value)}
            invalid={rowData.login.invalid}
          />
          <Label>Login</Label>
          <FormFeedback>{rowData.login.msg}</FormFeedback>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="email"
            placeholder="Email"
            defaultValue={rowData.email.value}
            id="email.value"
            onChange={e => handleChange(e.target.id,e.target.value)}
            invalid={rowData.email.invalid}
          />
          <Label>Email</Label>
          <FormFeedback>{rowData.email.msg}</FormFeedback>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="password"
            placeholder="Senha"
            defaultValue={rowData.password.value}
            id="password.value"
            onChange={e => handleChange(e.target.id,e.target.value)}
            invalid={rowData.password.invalid}
          />
          <Label>Senha</Label>
          <FormFeedback>{rowData.password.msg}</FormFeedback>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="password"
            placeholder="Confirmar Senha"
            defaultValue={rowData.password_confirmation.value}
            id="password_confirmation.value"
            onChange={e => handleChange(e.target.id,e.target.value)}
            invalid={rowData.password_confirmation.invalid}
          />
          <Label>Confirmar Senha</Label>
          <FormFeedback>{rowData.password_confirmation.msg}</FormFeedback>
        </FormGroup>
        <div className="d-flex justify-content-between">
          <Button.Ripple
              color="primary"
              outline
              onClick={() => {
                history.push("/pages/login")
              }}
            >
              Voltar Login
          </Button.Ripple>
          <Button.Ripple color="primary" onClick={() => toggle("2")}>
            Próximo
          </Button.Ripple>
        </div>
      </Form>
    )
  }
  function FormTab2() {
    return (
      <Form onSubmit={e => e.preventDefault()}>
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
        <FormGroup className="form-label-group">
          <Input
            type="text"
            placeholder="Licenciado para (nome)"
            required
            defaultValue={rowData.company.value}
            id="company.value"
            onChange={e => handleChange(e.target.id,e.target.value)}
            invalid={rowData.company.invalid}
          />
          <Label>Licença de uso</Label>
          <FormFeedback>{rowData.company.msg}</FormFeedback>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Select
              className="React"
              classNamePrefix="select"
              name="preços"
              options={priceOptions}
              defaultValue={rowData.price_id.select}
              onChange={e => handleChangeSelect("price_id.value","price_id.select",e.value,e)}
          />
          <Label>Preços</Label>
        </FormGroup>
        {/* <hr /> */}
        {/* <br></br> */}
        <div className="d-flex justify-content-end">
          <FormGroup className="form-label-group">
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={16} />}
              label="Aceitar termos e condições."
              defaultChecked={rowData.aceitar.value}
              onChange={e => handleChange("aceitar.value",!rowData.aceitar.value)}
              invalid={rowData.aceitar.invalid}
            />
            <FormFeedback>{rowData.aceitar.msg}</FormFeedback>
          </FormGroup>
        </div>
        <br></br>
        <div className="d-flex justify-content-between">
          <Button.Ripple
              color="primary"
              outline
              onClick={() => toggle("1")}
            >
              Voltar
          </Button.Ripple>
          <Button.Ripple color="primary" onClick={(e) => handleRegister(e)}>
            Confirmar
          </Button.Ripple>
        </div>

      </Form>
    )
  }

  return (
    <Card>
      <Row >
        <Col sm="12">
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
                <span className="align-middle ml-50">Licença de Uso</span>
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
          </TabContent>
        </Col>
      </Row>
    </Card>
  )
}
