import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { Card, FormGroup, Form, Input, Button, Label, FormFeedback } from "reactstrap"
import { toast, Flip } from "react-toastify"
import * as Yup from "yup";
import _ from 'lodash';

import { Container, Content } from "./styles";
import * as crypto from "../../../../shared/crypto";


import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Mail, Lock, Check } from "react-feather"
import { loginWithJWT, signFailure } from "../../../../redux/actions/auth/loginActions"
import { history } from "../../../../history"
import api from "../../../../services/api"

const schema = Yup.object().shape({
  login: Yup.string()
  .required("O login é obrigatório"),
  password: Yup.string()
    .required("A senha é obrigatória"),
});

export default function LoginJWT() {
  const [load, setLoad] = useState(true);
  const [atualiza, setAtualiza] = useState(true);
  const auth = useSelector(state => state.auth);
  const [rowData] = useState(
    {
      login:    { value: '',  invalid: false, msg:'' },
      password: { value: '',  invalid: false, msg:'' },
      remember:  { value: auth.login === undefined || auth.login.values === undefined || auth.login.values.loggedInUser  === undefined ? true : auth.login.values.loggedInUser.remember, invalid: false, msg:'' },
    } )
  const dispatch = useDispatch();


  useEffect(() =>
  {
     async function loadAuth() {
      if (auth.login !== undefined) {
        if (auth.login !== undefined) {
          if (auth.login.values !== undefined) {
            if (auth.login.values.loggedInUser !== undefined && load && atualiza) {
              if(rowData.remember.value) {
                let cryptoLogin = crypto.decryptByDESModeCBC(auth.login.values.loggedInUser.login);
                handleChange("login.value", cryptoLogin)
                // let cryptoPassword = crypto.decryptByDESModeCBC(auth.login.values.loggedInUser.password)
                // handleChange("password.value", cryptoPassword)
                handleChange("remember.value", true)
              }
              else
              {
                handleChange("remember.value", false)
              }
              setAtualiza(!atualiza)
              setLoad(false)
            }
          }
        }
      }
     }
     if(auth && load && rowData)
      {
        loadAuth();
      }
  }, [auth] ); // eslint-disable-line

  function handleChange(id, value) {
    _.set(rowData, id, value);
  }

  async function handleLogin(e) {
    try {
      // e.preventDefault()
      rowData.login.value=document.getElementById("login.value").value;
      rowData.password.value=document.getElementById("password.value").value;
      await schema.validate(
        {
          login: rowData.login.value,
          password: rowData.password.value,
        },
        {
          abortEarly: false
        }
      );
      const response = await api.post("/sessions", {
        application_id: 1,
        login: rowData.login.value,
        password: rowData.password.value
      });
      const { token, user } = response.data;
      const { id, email, name, userRole, licences, avatar, permissions } = user;

      api.defaults.headers.Authorization = `Bearer ${token}`;

      dispatch(loginWithJWT({ id, name,  login: rowData.login.value, email, password: rowData.password.value, userRole, remember: rowData.remember.value, token, avatar, licences, permissions }));

    } catch (error) {
      let validErrors = "";
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach(err => {
          validErrors = `${validErrors} ${err.message}`;
          rowData[err.path].invalid = true
          rowData[err.path].msg = err.message
        });
        setLoad(!load)
        if (validErrors.length > 0) {
          toast.error(
            // `Não foi possível incluir o usuário. ${validErrors}`
            `Erro ao incluir o usuário.`, { transition: Flip }
          );
        }
      } else {
        if (typeof error.response !== 'undefined')
        {
          if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
          {
            toast.error(error.response.data.message, { transition: Flip });
          }
        }
        else
        {
          toast.error("Servidor desconectado! Verifique com o administrador do sistema", { transition: Flip });
        }
        dispatch(signFailure());
      }
    }
  }
  return (
    <Card>
      <Form>
        {/* <Form onSubmit={e => e.preventDefault()}> */}
          {/* <FormGroup className="form-label-group position-relative has-icon-left">
            <Input
              placeholder="Login"
              value={login}
              onChange={e => setLogin(e.target.value)}
              required
            />
            <div className="form-control-position">
              <Mail size={15} />
            </div>
            <Label>Login</Label>
          </FormGroup> */}
          <FormGroup className="form-label-group position-relative has-icon-left">
            <Input
              type="text"
              placeholder="Login"
              defaultValue={rowData.login.value}
              id="login.value"
              onChange={e => handleChange(e.target.id,e.target.value)}
              invalid={rowData.login.invalid}
            />
            <div className="form-control-position">
              <Mail size={15} />
            </div>
            <FormFeedback>{rowData.login.msg}</FormFeedback>
          </FormGroup>
          {/* <FormGroup className="form-label-group position-relative has-icon-left">
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <div className="form-control-position">
              <Lock size={15} />
            </div>
            <Label>Senha</Label>
          </FormGroup> */}
          <FormGroup className="form-label-group position-relative has-icon-left">
            <Input
              type="password"
              placeholder="Senha"
              defaultValue={rowData.password.value}
              id="password.value"
              onChange={e => handleChange(e.target.id,e.target.value)}
              invalid={rowData.password.invalid}
            />
            <div className="form-control-position">
              <Lock size={15} />
            </div>
            <FormFeedback>{rowData.password.msg}</FormFeedback>
          </FormGroup>
          <FormGroup className="d-flex justify-content-between align-items-center">
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={16} />}
              label="Lembrar"
              defaultChecked={rowData.remember.value}
              onChange={e => handleChange("remember.value",e.target.checked)}
            />
            <div className="float-right">
              <Link to="/pages/forgot-password">Esqueceu a Senha?</Link>
            </div>
          </FormGroup>
          <div className="d-flex justify-content-between">

            <Button.Ripple color="primary" onClick={() => handleLogin()}>
              Login
            </Button.Ripple>
            <Button.Ripple
              color="primary"
              outline
              onClick={() => {
                history.push("/pages/register")
              }}
            >
              Nova Conta
            </Button.Ripple>
          </div>
        </Form>
        <Container>
          <Content>
          <Label>Mycare - Versão: 1.30.6 - 2020</Label>
          </Content>
        </Container>

      </Card>
  )
}
// const mapStateToProps = state => {
//   return {
//     values: state.auth.login
//   }
// }
// export default connect(mapStateToProps, { loginWithJWT })(LoginJWT)



