import React, { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  FormGroup,
  Form,
  Input,
  Button,
  Label
} from "reactstrap"
import { toast } from "react-toastify"
import {
  useLocation
} from "react-router-dom";

import { history } from "../../../history"
import resetImg from "../../../assets/img/pages/reset-password.png"
import "../../../assets/scss/pages/authentication.scss"
import api from "../../../services/api"

export default function ResetPassword({ search }) {
  const [password, setPassword] = useState("");
  const [password_confirmation, setConfirmPassword] = useState("");
  // const { token } = props.params;
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();
  let token = query.get("token");

  async function handleResetar(e) {
    try {
      e.preventDefault()
      if(password!== password_confirmation)
      {
        toast.error("Senha e Confirmação de senha são diferentes");
        return;
      }
      await api.put("/passwords", {
        token,
        password,
        password_confirmation
      });
      toast.success("Reset de senha efetuado com sucesso!");

    } catch (err) {
      toast.error("Erro ao resetar a senha!");
    }
  }

  return (
    <Row className="m-0 justify-content-center">
      <Col
        sm="8"
        xl="7"
        lg="10"
        md="8"
        className="d-flex justify-content-center"
      >
        <Card className="bg-authentication rounded-0 mb-0 w-100">
          <Row className="m-0">
            <Col
              lg="6"
              className="d-lg-block d-none text-center align-self-center px-5"
            >
              <img className="px-5 mx-2" src={resetImg} alt="resetImg" />
            </Col>
            <Col lg="6" md="12" className="p-0">
              <Card className="rounded-0 mb-0 px-2 py-50">
                <CardHeader className="pb-1 pt-1">
                  <CardTitle>
                    <h4 className="mb-0">Resetar Senha</h4>
                  </CardTitle>
                </CardHeader>
                <p className="px-2 auth-title">
                  Por favor entre sua nova senha para
                  continuar.
                </p>
                <CardBody className="pt-1">
                  <Form>
                    <FormGroup className="form-label-group">
                      <Input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                      />
                      <Label>Senha</Label>
                    </FormGroup>
                    <FormGroup className="form-label-group">
                       <Input
                        type="password"
                        placeholder="Confirmar Senha"
                        value={password_confirmation}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                      />
                      <Label>Confirmar Senha</Label>
                    </FormGroup>
                    <div className="d-flex justify-content-between flex-wrap flex-sm-row flex-column">

                      <Button.Ripple
                        block
                        color="primary"
                        type="submit"
                        className="btn-block mt-1 mt-sm-0"
                        onClick={e => handleResetar(e)}
                      >
                        Resetar
                      </Button.Ripple>
                      <Button.Ripple
                        block
                        className="btn-block"
                        color="primary"
                        outline
                        onClick={e => {
                          e.preventDefault()
                          history.push("/pages/login")
                        }}
                      >
                        Voltar para o Login
                      </Button.Ripple>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}
