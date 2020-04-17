import React, { useState } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux";
import * as Yup from "yup";

import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check } from "react-feather"
import { history } from "../../../../history"
import api from "../../../../services/api";

import { loginWithJWT, signFailure } from "../../../../redux/actions/auth/loginActions"

const schema = Yup.object().shape({
  username: Yup.string()
  .required("O nome é obrigatório"),
  company: Yup.string()
  .required("O nome da licença é obrigatório"),
  email: Yup.string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: Yup.string()
    .min(6, "Insira uma senha válida")
    .required("A senha é obrigatória"),
  password_confirmation: Yup.string()
    .min(6, "Insira uma senha válida")
    .required("A senha é obrigatória")
});

export default function RegisterJWT() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUserName] = useState("");
    const [password_confirmation, setConfirmPass] = useState("");
    const [company, setCompany] = useState("");
    const dispatch = useDispatch();

  async function handleRegister(e) {
    try {
      e.preventDefault()
      await schema.validate(
        {
          username,
          company,
          email,
          password,
          password_confirmation
        },
        {
          abortEarly: false
        }
      );
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
        licence_id: 0,
        company
      });
      const response = await api.post("/sessions", {
        email,
        password
      });
      const { token, user } = response.data;
      const { id, name, userRole, licences } = user;

      api.defaults.headers.Authorization = `Bearer ${token}`;

      dispatch(loginWithJWT({ id, name, email, password, userRole, remember: true, token, avatar: null, licences }));

    } catch (error) {
      let validErrors = "";
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach(err => {
          validErrors = `${validErrors} ${err.message}`;
        });
        if (validErrors.length > 0) {
          toast.error(
            `Não foi possível incluir o usuário. ${validErrors}`
          );
        }
      } else {
        if (typeof error.response !== 'undefined')
        {
          if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
          {
            toast.error("Usuário ou Senha inválidos! Verifique seus dados");
          }
          }
        dispatch(signFailure());
      }
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
        <FormGroup className="form-label-group">
          <Input
            type="text"
            placeholder="Licenciado para (nome)"
            required
            value={company}
            onChange={e => setCompany(e.target.value)}
          />
          <Label>Licença de uso</Label>
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
