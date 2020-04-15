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

import fgImg from "../../../assets/img/pages/forgot-password.png"
import { history } from "../../../history"
import api from "../../../services/api"
import "../../../assets/scss/pages/authentication.scss"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")

  async function handleRecuperar(e) {
    try {
      e.preventDefault()
      const environment_mode =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000" : process.env.REACT_APP_URL ;
      await api.post("/passwords", {
        email,
        redirect_url: environment_mode + '/pages/reset-password'
      });
      toast.success("Reset de senha enviado para o seu e-mail!");

    } catch (err) {
      toast.error("Erro ao enviar solicitação de reset de senha!");
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
              className="d-lg-block d-none text-center align-self-center"
            >
              <img src={fgImg} alt="fgImg" />
            </Col>
            <Col lg="6" md="12" className="p-0">
              <Card className="rounded-0 mb-0 px-2 py-1">
                <CardHeader className="pb-1">
                  <CardTitle>
                    <h4 className="mb-0">Recuperar sua senha</h4>
                  </CardTitle>
                </CardHeader>
                <p className="px-2 auth-title">
                  Por favor entre com o seu endereço de e-mail e iremos enviar
                  instruções de como resetar sua senha.
                </p>
                <CardBody className="pt-1 pb-0">
                  <Form>
                    <FormGroup className="form-label-group">
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                      <Label>Email</Label>
                    </FormGroup>
                    <div className="float-md-left d-block mb-1">
                      <Button.Ripple
                        color="primary"
                        type="submit"
                        className="px-75 btn-block"
                        onClick={handleRecuperar}
                      >
                        Recuperar Senha
                      </Button.Ripple>
                    </div>
                    <div className="float-md-right d-block mb-1">
                      <Button.Ripple
                        color="primary"
                        outline
                        className="px-75 btn-block"
                        onClick={() => history.push("/pages/login")}
                      >
                        Voltar para o login
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
