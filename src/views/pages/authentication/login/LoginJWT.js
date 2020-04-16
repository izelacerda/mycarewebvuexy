import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { CardBody, FormGroup, Form, Input, Button, Label } from "reactstrap"
import { toast } from "react-toastify"
import { Container, Content } from "./styles";
import * as crypto from "../../../../shared/crypto";


import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Mail, Lock, Check } from "react-feather"
import { loginWithJWT, signFailure } from "../../../../redux/actions/auth/loginActions"
import { history } from "../../../../history"
import api from "../../../../services/api"
// import * as Yup from "yup";

// /class LoginJWT extends React.Component {
//   state = {
//     email: "",
//     password: "",
//     remember: false
//   }
// const schema = Yup.object().shape({
//   email: Yup.string()
//     .email("Insira um e-mail válido")
//     .required("O e-mail é obrigatório"),
//   password: Yup.string()
//     .min(6, "Insira uma senha válida")
//     .required("A senha é obrigatória")
// });
export default function LoginJWT() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  useEffect(() =>
  {
     async function loadAuth() {
      if (auth.login !== undefined) {
        if (auth.login.state !== undefined) {
          if (auth.login.state.values !== undefined) {
            if (auth.login.state.values.loggedInUser !== undefined) {
              if(auth.login.state.values.loggedInUser.remember) {
                let cryptoEmail = crypto.decryptByDESModeCBC(auth.login.state.values.loggedInUser.email);
                setEmail(cryptoEmail);
                let cryptoPassword = crypto.decryptByDESModeCBC(auth.login.state.values.loggedInUser.password);
                setPassword(cryptoPassword);
                setRemember(auth.login.state.values.loggedInUser.remember);
              }
              else{
                setRemember(false);
              }

            }
          }
        }
      }
     }
     if(auth)
      {
        loadAuth();
      }
  }, [auth]);

  async function handleLogin(e) {
    try {
      e.preventDefault()
      const response = await api.post("/sessions", {
        email,
        password
      });
      const { token, user } = response.data;
      const { id, name, userRole, licences, avatar } = user;

      api.defaults.headers.Authorization = `Bearer ${token}`;

      dispatch(loginWithJWT({ id, name, email, password, userRole, remember, token, avatar, licences }));

    } catch (err) {
      if (typeof err.response !== 'undefined')
      {
        if(typeof err.response.status !== 'undefined' && (err.response.status === 401 || err.response.status === 400   ))
        {
          toast.error("Usuário ou Senha inválidos! Verifique seus dados");
        }
        else{
          if(typeof err.response.status !== 'undefined' && (err.response.status === 500 || err.response.status === 501  ))
          {
            toast.error("Usuário não encontrado! Verifique seus dados");
          }
        }
      }
      else
      {
        toast.error("Servidor desconectado! Verifique com o administrador do sistema");
      }
      dispatch(signFailure());
    }
  }
  return (
      <CardBody className="pt-1">
        <Form action="/" onSubmit={handleLogin}>
          <FormGroup className="form-label-group position-relative has-icon-left">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <div className="form-control-position">
              <Mail size={15} />
            </div>
            <Label>Email</Label>
          </FormGroup>
          <FormGroup className="form-label-group position-relative has-icon-left">
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
          </FormGroup>
          <FormGroup className="d-flex justify-content-between align-items-center">
            <Checkbox
              color="primary"
              icon={<Check className="vx-icon" size={16} />}
              label="Lembrar"
              defaultChecked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            <div className="float-right">
              <Link to="/pages/forgot-password">Esqueceu a Senha?</Link>
            </div>
          </FormGroup>
          <div className="d-flex justify-content-between">

            <Button.Ripple color="primary" type="submit">
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
          <Label>Mycare.med.br - Versão: 1.0.1 - 16/04/2020</Label>
          </Content>
        </Container>

      </CardBody>
  )
}
// const mapStateToProps = state => {
//   return {
//     values: state.auth.login
//   }
// }
// export default connect(mapStateToProps, { loginWithJWT })(LoginJWT)


