import React, { useState } from "react";
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux";
import { CardBody, FormGroup, Form, Input, Button, Label } from "reactstrap"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Mail, Lock, Check } from "react-feather"
import { loginWithJWT, signFailure } from "../../../../redux/actions/auth/loginActions"
import { history } from "../../../../history"
import api from "../../../../services/api";

// /class LoginJWT extends React.Component {
//   state = {
//     email: "",
//     password: "",
//     remember: false
//   }
export default function LoginJWT() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const dispatch = useDispatch();

  async function handleLogin() {
    try {
      const response = await api.post("/sessions", {
        email,
        password
      });
      const { token, user } = response.data;

      api.defaults.headers.Authorization = `Bearer ${token}`;

      dispatch(loginWithJWT({ token, ...user }));

      // try {
      //   history.push("/");
      // } catch (error) {

      // }
    } catch (err) {
      if (typeof err.response !== 'undefined')
      {
        if(typeof err.response.status !== 'undefined' && (err.response.status === 401 || err.response.status === 400   ))
        {
          toast.warning("Usuário ou Senha inválidos! Verifique seus dados");
        }
        }
      dispatch(signFailure());
    }
  }
  return (
      <CardBody className="pt-1">
        <Form>
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
              defaultChecked={false}
              onChange={e => setRemember(!remember)}
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
              Novo Usuário
            </Button.Ripple>
          </div>
        </Form>
        <ToastContainer />
      </CardBody>
  );
}
// const mapStateToProps = state => {
//   return {
//     values: state.auth.login
//   }
// }
// export default connect(mapStateToProps, { loginWithJWT })(LoginJWT)


