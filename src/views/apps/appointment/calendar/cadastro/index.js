import React, { useState, useEffect } from "react"
import {
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TabContent,
  TabPane,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  FormFeedback,
  Spinner
} from "reactstrap"
import _ from 'lodash';
import { useSelector } from "react-redux";
import classnames from "classnames"
import { toast, Flip } from "react-toastify"
import * as Yup from "yup";

import "../../../../../assets/scss/pages/users.scss"
import Radio from "../../../../../components/@vuexy/radio/RadioVuexy"

import "flatpickr/dist/themes/light.css";
import "../../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import api from "../../../../../services/api"
import ToolBar from "../../../../../components/especificos/toolbar"

const schema = Yup.object().shape({
  name: Yup.string()
  .required("O nome é obrigatório"),
  is_active: Yup
    .boolean(),
  // outros notOneof(['admin','teste'], 'este nome nao pode')
  // exemplos https://github.com/jquense/yup#usage
});

export default function CalendarCadastro(props) {
  let listaPermission = props.userPermission.includes(37)
  let insertPermission = props.userPermission.includes(38)
  let updatePermission = props.userPermission.includes(39)
  let deletePermission = props.userPermission.includes(40)
  let dadosdoCadastroPermission = props.userPermission.includes(42)
  let salvarPermission = true

  let  [id, setId]  = useState(props.id)
  if(id > 0) {
    if(!updatePermission) {
      salvarPermission = false
    }
  }
  else {
    if(!insertPermission) {
      salvarPermission = false
    }
    deletePermission = false
  }
  const [activeTab, setTab] = useState("1")
  const [load, setLoad] = useState(true)
  const [atualiza, setAtualiza] = useState(true);

  const [showModalDelete, setShowModalDelete] = useState(false)

  const [rowData] = useState(
    {
      id: { value: 0,  invalid: false, tab: '1', msg:'' },
      name: { value: '',  invalid: false, tab: '1', msg:'' },
      is_active: { value: true, invalid: false, tab: '1', msg:'' },
    } )
    const toolBarList = [
      {
        id: 'toolbar1',
        color: 'primary',
        buttomClassName: "btn-icon mb-1",
        icon: 'PlusCircle',
        size: 21,
        label: null,
        outline: false,
        tooltip: "Incluir",
        disabled: !insertPermission,
        action: () => { rowData.id.value=0; rowData.name.value="";  setId(0); setLoad(true) }
      },

      {
        id: 'toolbar3',
        color: 'primary',
        buttomClassName: "btn-icon mb-1",
        icon: 'RefreshCw',
        size: 21,
        label:  null,
        outline: false,
        tooltip: 'Atualiza',
        action: () => setLoad(true)
      },
      {
        id: 'toolbar4',
        color: 'primary',
        buttomClassName: "btn-icon mb-1",
        icon: 'List',
        size: 21,
        label: null,
        outline: false,
        tooltip:  'Lista',
        disabled: !listaPermission,
        action: () => props.handleChangeScreen(1,0)
      },
      {
        id: 'toolbar6',
        color: 'primary',
        buttomClassName: "btn-icon mb-1",
        icon: 'Trash',
        size: 21,
        label: null,
        outline: false,
        tooltip: "Excluir",
        disabled: !deletePermission,
        action: () => toggleModalDelete(true)
      },
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
      }
    ]

  const auth = useSelector(state => state.auth);

  useEffect(() => {
    async function loadrowData() {
      //Profile

      if(!dadosdoCadastroPermission) {
        props.handleChangeScreen(1,0)
      }
      let body = {
        licence_id: auth.login.licence_id,
        id: 0
      };
      let response = null
      if(id > 0) {
        body = {
          licence_id: auth.login.licence_id,
          id: parseInt(id),
          userlog_id: auth.login.values.loggedInUser.id
        };
        response = await api.post("/calendars.list", {
          ...body
        });
        if(response.data !== undefined && response.data[0] !== undefined )
        {
          let dados = response.data[0]

          rowData.id.value = id
          rowData.name.value = dados.name
          rowData.is_active.value = dados.is_active
        }
      }
      setLoad(false)
    }
    if (id !== null && auth !== undefined && load) {
      loadrowData();
    }
  }, [auth, id, load]); // eslint-disable-line

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


  async function handleSubmit() {
    try {
      for(var row in rowData){
        rowData[row].invalid = false
        rowData[row].msg = ""
      }
      await schema.validate(
        {
          name: rowData.name.value,
          is_active: rowData.is_active.value,
        },
        {
          abortEarly: false
        }
      );
      let data=null
      if (id === 0) {
        try {
          data = {
            licence_id: auth.login.licence_id,
            name: rowData.name.value,
            is_active: rowData.is_active.value,
            userlog_id: auth.login.values.loggedInUser.id
          }
          const response = await api.post(`/calendars`, data);
          id = response.data.id
          rowData.id.value = id
          props.handleChangeScreen(1,0)
          // history.push(`/app/calendar/cadastro/${id}`)
          toast.success("Tipo de Agenda incluído com sucesso!", { transition: Flip });
        } catch (error) {
          if (typeof error.response !== 'undefined')
          {
            if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
            {
              if(error.response.data.message !== undefined) {
                toast.error(error.response.data.message, { transition: Flip });
              }
              else{
                toast.error(`Erro ao Incluir o Tipo de Agenda! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao Incluir o Tipo de Agenda! ${error.message}`, { transition: Flip });
          }
        }
      } else {
        try {
          data = {
            id: rowData.id.value,
            licence_id: auth.login.licence_id,
            name: rowData.name.value,
            is_active: rowData.is_active.value,
            userlog_id: auth.login.values.loggedInUser.id
          }
          await api.put(`/calendars`, data);
          props.handleChangeScreen(1,0)
          toast.success("Tipo de Agenda atualizado com sucesso!", { transition: Flip });
        } catch (error) {
          if (typeof error.response !== 'undefined')
          {
            if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
            {
              if(error.response.data.message !== undefined) {
                toast.error(error.response.data.message, { transition: Flip });
              }
              else{
                toast.error(`Erro ao Incluir o Tipo de Agenda! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao atualizar o Tipo de Agenda! ${error.message}`, { transition: Flip });
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
            } o Tipo de Agenda.`
          , { transition: Flip });
        }
        toggle(tabAux)
        setAtualiza(!atualiza)
      } else {
        toast.error(
          `Não foi possível ${id === "0" ? "incluir" : "alterar"} o Tipo de Agenda. ${error.message}`
        , { transition: Flip });
      }
    }
  }

  function toggleModalDelete(status) {
    setShowModalDelete(status)
  }

  async function handleDelete() {
    try {
      if(id){
        let data = {
          licence_id: auth.login.licence_id,
          id,
          userlog_id: auth.login.values.loggedInUser.id
        };
        await api.delete("/calendars",
          { data }
        );
        setShowModalDelete(false)
        props.handleChangeScreen(1,0)
        // history.push(`/app/calendar/list`)
        // let rowDataAux = rowData.filter(function(row){ return row.id !== userDelete.id; })
        // setrowData(rowDataAux)
        toast.success("Tipo de Agenda excluído com sucesso!", { transition: Flip });
      }

    } catch (error) {
      if (typeof error.response !== 'undefined')
      {
        if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400  || error.response.status === 500 ))
        {
          if(error.response.data.message !== undefined) {
            toast.error(error.response.data.message, { transition: Flip });
          }
          else{
            toast.error(`Erro ao Excluir o Tipo de Agenda! ${error.message}`, { transition: Flip });
          }
        }
      }
      else {
        toast.error(`Erro ao Excluir o Tipo de Agenda! ${error.message}`, { transition: Flip });
      }
      setShowModalDelete(false)

    }

  }

  function FormTab1() {
    return (
      <Row>
        <Col sm="12">
          <Form onSubmit={e => e.preventDefault()}>
            <Row>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label className="d-block mb-50">Nome</Label>
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
                </FormGroup>
                <FormGroup>
                  <Label className="d-block mb-50">Ativo</Label>
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
  return (
  <>
    <Row>
      <Col sm="12">
        <Card>
          <CardBody className="pt-1">

              <div>
                <div className="d-flex justify-content-between flex-wrap mb-1">
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
                        <span className="align-middle ml-50">{id>0 ? "Alteração" : "Inclusão" }</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <div className="filter-actions d-flex justify-content-end">
                    <ToolBar toolBarList={toolBarList} typeBar="1"/>
                  </div>
                  <Modal
                    isOpen={showModalDelete}
                    toggle={() => toggleModalDelete(false)}
                    className="modal-dialog-centered"
                  >
                    <ModalHeader toggle={() => toggleModalDelete(false)} className="bg-warning">
                      Exclusão
                    </ModalHeader>
                    <ModalBody>
                      Confirma a exclusão do Tipo de Agenda? <br></br><br></br>
                      <span className="text-center">
                        {rowData.name.value}
                      </span>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="warning" onClick={() => handleDelete()}>
                        Confirmar
                      </Button>{" "}
                    </ModalFooter>
                  </Modal>
                </div>
                {load === false ?
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <FormTab1 />
                    </TabPane>
                  </TabContent>
                :
                    <Spinner color="primary" className="reload-spinner" />
                }
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </>
  )

}
