import React, { useState, useEffect, useRef } from "react"
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Media,
  Form,
  Input,
  Label,
  FormFeedback,
  Spinner
} from "reactstrap"
import _ from 'lodash';
import { useSelector, useDispatch } from "react-redux";
import { toast, Flip } from "react-toastify"
import * as Yup from "yup";

import "../../../../assets/scss/pages/users.scss"
import { dicalogin } from "../../../../shared/geral"
import { Container } from "./styles";

import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import api from "../../../../services/api"
import { changeAvatar } from "../../../../redux/actions/auth/loginActions"
import { history } from "../../../../history"
import ToolBar from "../../../../components/especificos/toolbar"

const schema = Yup.object().shape({
  name: Yup.string()
  .required("O nome é obrigatório")
  .min(10, "Mínimo 10 caracteres"),
});

export default function LicenceCadastro(props) {
  let dadosdoCadastroPermission = props.userPermission.includes(17)
  let updatePermission = props.userPermission.includes(18)
  let salvarPermission = true
  const auth = useSelector(state => state.auth);

  const edicao = auth.login.licence_id > 0;
  if(edicao) {
    if(!updatePermission) {
      salvarPermission = false
    }
  }
  const [load, setLoad] = useState(true)
  const [atualiza, setAtualiza] = useState(true);

  const dispatch = useDispatch()

  const [rowData] = useState(
    {
      name: { value: '',  invalid: false, tab: '1', msg:'' },
      avatar: { value: null,  invalid: false, tab: '1', msg:'' },
      avatar_id: { value: null,  invalid: false, tab: '1', msg:'' },
      is_active: { value: true, invalid: false, tab: '1', msg:'' },
    } )
    const toolBarList = [
      {
        id: 'toolbar1',
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
        id: 'toolbar2',
        color: 'primary',
        buttomClassName: "btn-icon mb-1",
        icon: 'Trash',
        size: 21,
        label: null,
        outline: false,
        tooltip: "Remover Imagem",
        disabled: !salvarPermission,
        action: () => handleImg(null)
      }
    ]

  const [iniciais, setIniciais] = useState("")
  const [url, setUrl] = useState(null)

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
        history.push(`/`)
      }

          rowData.name.value = auth.login.company
          rowData.avatar_id.value = auth.login.avatar_company ? auth.login.avatar_company.id : 0
          rowData.avatar.value = auth.login.avatar_company ? auth.login.avatar_company : null
          setIniciais(dicalogin(auth.login.company))
          setUrl(auth.login.avatar_company ? auth.login.avatar_company : null)

      setLoad(false)
    }
    if (auth !== undefined && load) {
      loadrowData();
    }
  }, [auth, load]); // eslint-disable-line


  function handleChange(id, value) {
    _.set(rowData, id, value);
  }


  async function handleSubmit() {
    try {
      for(var row in rowData){
        rowData[row].invalid = false
        rowData[row].msg = ""
      }
      await schema.validate(
        {
          name: rowData.name.value
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
        name: rowData.name.value,
        avatar_id: rowData.avatar_id.value,
        userlog_id:   auth.login.values.loggedInUser.id,
        licence_id: auth.login.licence_id
      }

      try {
          await api.put(`/licences`, data);

          dispatch(changeAvatar({
            company: rowData.name.value,
            avatar_company: rowData.avatar.value
          }));
        toast.success("Licença atualizada com sucesso!", { transition: Flip });
      } catch (error) {
        if (typeof error.response !== 'undefined')
        {
          if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
          {
            if(error.response.data.message !== undefined) {
              toast.error(error.response.data.message, { transition: Flip });
            }
            else{
              toast.error(`Erro ao atualizar licença! ${error.message}`, { transition: Flip });
            }
          }
        }
        else {
          toast.error(`Erro ao atualizar Licença! ${error.message}`, { transition: Flip });
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
            `Dados incorretos ao alterar a licença.`
          , { transition: Flip });
        }
        setAtualiza(!atualiza)
      } else {
        toast.error(
          `Não foi possível a licença. ${error.message}`
        , { transition: Flip });
      }
    }
  }
  function FormTab1() {
    return (
      <>
        <Row>
          <Col className="d-flex justify-content-center">
            <Media  href="#">
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
                      disabled={!salvarPermission}
                    />
                  </label>
                </Container>
              </Media>
            </Col>
        </Row>
        <Row>
          <Col>
            <Form onSubmit={e => e.preventDefault()}>
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
            </Form>
          </Col>
        </Row>
      </>
    )
  }
  return (
    <Row>
       <Col lg="4" md="12">
        <Card>
          <CardHeader>
            <span className="font-medium-1 text-bold-600">Licença de Uso</span>
          </CardHeader>
          <CardBody>
              <div>
                <div className="d-flex justify-content-end flex-wrap" sm="12">
                    <ToolBar toolBarList={toolBarList} typeBar="1"/>
                </div>
                {load === false ?
                  <FormTab1 />
                :
                    <Spinner color="primary" className="reload-spinner" />
                }
            </div>
            {/* <div className="card-btns d-flex justify-content-between mt-2">
              <Button.Ripple className="gradient-light-primary text-white" outline onClick={() => handleSubmit()}>
                Save
              </Button.Ripple>
              <Button.Ripple color="primary" outline onClick={() => handleImg(null)}>
                Remover Imagem
              </Button.Ripple>
            </div> */}
          </CardBody>
        </Card>
      </Col>
    </Row>
  )

}
