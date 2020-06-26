import React, { useState, useEffect } from "react"
import {
  Row,
  Col,
  Form,
  Modal,
  ModalBody,
  Label,
  FormGroup,
  FormFeedback,
  Spinner
} from "reactstrap"
import _ from 'lodash';
import { useSelector } from "react-redux";
import { toast, Flip } from "react-toastify"
import * as Yup from "yup";
import Flatpickr from "react-flatpickr";
import NumberFormat from "react-number-format"

import Chip from "../../../../components/@vuexy/chips/ChipComponent"
import "../../../../assets/scss/pages/users.scss"

import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import ToolBar from "../../../../components/especificos/toolbar"

const schema = Yup.object().shape({
  dueDate: Yup.date()
  .required("A Data de Vencimento é obrigatória"),
  value: Yup.number()
  .min(1, "Valor Total é obrigatório")
  .required("O Valor Total é obrigatório"),
});

export default function InvoiceFinantialCadastro(props) {
  let listaPermission = true
  let insertPermission = true
  let updatePermission = true
  let dadosdoCadastroPermission = true
  let salvarPermission = true

  const [id, setId]  = useState(props.id)
  const [edicao, setEdicao] = useState(props.id > 0)
  if(edicao) {
    if(!updatePermission) {
      salvarPermission = false
    }
  }
  else {
    if(!insertPermission) {
      salvarPermission = false
    }
  }
  const [activeTab, setTab] = useState("1")
  const [load, setLoad] = useState(true)
  const [atualiza, setAtualiza] = useState(true);

  const baseData = {
    id: { value: 0,  invalid: false, tab: '1', msg:'' },
    dueDate: { value: '',  invalid: false, tab: '1', msg:'' },
    value: { value: '', invalid: false, tab: '1', msg:'' },
  }
  const [rowData, setRowData] = useState(baseData)
  const toolBarList = [
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
    },
    {
      id: 'toolbar4',
      color: 'primary',
      buttomClassName: "btn-icon mb-1",
      icon: 'XCircle',
      size: 21,
      label: null,
      outline: false,
      tooltip:  'Fechar',
      disabled: !listaPermission,
      action: () => props.handleSidebar(false)
    }
  ]

  const auth = useSelector(state => state.auth);

  useEffect(() => {
    async function loadrowData() {
      //Profile

      if(!dadosdoCadastroPermission) {
        props.handleSidebar(false)
        return
      }
      setId(props.id)
      setEdicao(props.id>0)
      if(props.id > 0 && props.data) {
        rowData.id.value = props.data.id
        rowData.dueDate.value = props.data.dueDate
        rowData.value.value = props.data.value
      }
      else {
        setRowData(baseData)
      }
      setLoad(false)
      setAtualiza(!atualiza)
    }
    if (id >=0 && auth !== undefined) {
      loadrowData();
    }
  }, [auth, props.id, props.data]); // eslint-disable-line

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
          dueDate: rowData.dueDate.value,
          value: rowData.value.value,
        },
        {
          abortEarly: false
        }
      );
      let data=null
      if (!edicao) {
        try {
           data =  {
            dueDate: rowData.dueDate.value,
            value: rowData.value.value,
            balance: rowData.value.value
          }
          props.handleSidebar(false)
          props.handleAdd(data)
          setRowData(baseData)
        } catch (error) {
          if (typeof error.response !== 'undefined')
          {
            if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
            {
              if(error.response.data.message !== undefined) {
                toast.error(error.response.data.message, { transition: Flip });
              }
              else{
                toast.error(`Erro ao Incluir o Financeiro! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao Incluir o Financeiro! ${error.message}`, { transition: Flip });
          }
        }
      } else {
        try {
          data =  {
            id: id,
            dueDate: rowData.dueDate.value,
            value: rowData.value.value,
            balance: rowData.value.value
          }
          props.handleSidebar(false)
          props.handleUpdate(data)
          setRowData(baseData)
        } catch (error) {
          if (typeof error.response !== 'undefined')
          {
            if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
            {
              if(error.response.data.message !== undefined) {
                toast.error(error.response.data.message, { transition: Flip });
              }
              else{
                toast.error(`Erro ao Incluir o Financeiro! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao atualizar o Financeiro! ${error.message}`, { transition: Flip });
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
            } o Financeiro.`
          , { transition: Flip });
        }
        toggle(tabAux)
        setAtualiza(!atualiza)
      } else {
        toast.error(
          `Não foi possível ${id === "0" ? "incluir" : "alterar"} o Financeiro. ${error.message}`
        , { transition: Flip });
      }
    }
  }

  function FormTab1() {
    return (
      <Row>
        <Col sm="12">
          <Form onSubmit={e => e.preventDefault()}>
            <Row>
              <Col sm="12" lg="12">
                <FormGroup>
                  <Label>
                    Data do Vencimento
                  </Label>
                  <Flatpickr
                    id="dobD"
                    className="form-control"
                    options={{ dateFormat: "d-m-Y" }}
                    value={rowData.dueDate.value}
                    onChange={date => handleChange("dueDate.value", date[0].toJSON())}
                    disabled={!salvarPermission}
                    // onChange={date => this.handledob(date)}
                  />
                  <FormFeedback>{rowData.dueDate.msg}</FormFeedback>
                </FormGroup>
              </Col>
              <Col sm="12" lg="12">
                <FormGroup>
                  <Label>Valor total</Label>
                  <NumberFormat
                    prefix={'R$'}
                    decimalScale={2}
                    decimalSeparator={','}
                    thousandSeparator={'.'}
                    className="form-control"
                    placeholder="Valor Total"
                    value={rowData.value.value}
                    onValueChange={e => handleChange("value.value",e.floatValue)}
                    invalid={rowData.value.invalid.toString()}
                    disabled={!salvarPermission}
                  />
                  <FormFeedback>{rowData.value.msg}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    )
  }
  return (
    <Modal
        isOpen={props.sidebar ? true : false}
        className="modal-dialog-centered modal-sm"
        toggle={() => props.handleSidebar(false)}
      >
      <ModalBody>
        <div className="add-event-body">
          <div className="d-flex justify-content-between flex-wrap mb-1">
            <div>
              <span className="align-middle ml-50">

              { edicao ?
                <Chip
                className="mr-1"
                avatarColor="primary"
                // avatarIcon={<Edit />}
                text="Alteração"
                />
              :
                <Chip
                className="mr-1"
                avatarColor="primary"
                // avatarIcon={<Plus />}
                text="Inclusão"
                />
              }

              </span>

            </div>
            <div className="d-flex justify-content-end">
              <ToolBar toolBarList={toolBarList} typeBar="1"/>
            </div>
          </div>
          {load === false ?
            <FormTab1 />
          :
            <Spinner color="primary" className="reload-spinner" />
          }
        </div>
      </ModalBody>
    </Modal>
  )
}
