import React, { useState } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux";

import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check } from "react-feather"
import { history } from "../../../../history"
import api from "../../../../services/api";

import { loginWithJWT, signFailure } from "../../../../redux/actions/auth/loginActions"

export default function RegisterJWT() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUserName] = useState("");
    const [password_confirmation, setConfirmPass] = useState("");
    const dispatch = useDispatch();

  async function handleRegister(e) {
    try {
      e.preventDefault()
      if(password!== password_confirmation)
      {
        toast.error("Senha e Confirmação de senha são diferentes");
        return;
      }
       await api.post("/users", {
        username,
        email,
        password,
        password_confirmation,
        addresses: [],
        licence_id: 0
      });
      const response = await api.post("/sessions", {
        email,
        password
      });
      const { token, user } = response.data;
      const { id, name, userRole, licences } = user;

      api.defaults.headers.Authorization = `Bearer ${token}`;

      dispatch(loginWithJWT({ id, name, email, password, userRole, remember: true, token, avatar: null, licences }));

    } catch (err) {
      if (typeof err.response !== 'undefined')
      {
        if(typeof err.response.status !== 'undefined' && (err.response.status === 401 || err.response.status === 400   ))
        {
          toast.error("Usuário ou Senha inválidos! Verifique seus dados");
        }
        }
      dispatch(signFailure());
    }
  }
    return (
      <Form action="/" onSubmit={handleRegister}>
        <FormGroup className="form-label-group">
          <Input
            type="text"
            placeholder="Nome"
            required
            value={username}
            onChange={e => setUserName(e.target.value)}
          />
          <Label>Nome</Label>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Label>Email</Label>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="password"
            placeholder="Senha"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Label>Senha</Label>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="password"
            placeholder="Confirmar Senha"
            required
            value={password_confirmation}
            onChange={e => setConfirmPass(e.target.value)}
          />
          <Label>Confirmar Senha</Label>
        </FormGroup>
        <FormGroup>
          <Checkbox
            color="primary"
            icon={<Check className="vx-icon" size={16} />}
            label=" Aceitar termos e condições."
            defaultChecked={true}
          />
        </FormGroup>
        <div className="d-flex justify-content-between">
          <Button.Ripple color="primary" type="submit">
            Incluir
          </Button.Ripple>
          <Button.Ripple
            color="primary"
            outline
            onClick={() => {
              history.push("/pages/login")
            }}
          >
            Já possui conta
          </Button.Ripple>
        </div>
      </Form>
    )
}
