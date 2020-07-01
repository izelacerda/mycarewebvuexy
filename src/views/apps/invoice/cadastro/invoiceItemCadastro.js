import React, { useState, useEffect } from "react"
import {
  Row,
  Col,
  Form,
  Modal,
  ModalBody,
  Label,
  FormGroup,
  Spinner
} from "reactstrap"
import _ from 'lodash';
import { useSelector } from "react-redux";
import { toast, Flip } from "react-toastify"
import * as Yup from "yup";
import NumberFormat from "react-number-format"
import Select from "react-select"

import Chip from "../../../../components/@vuexy/chips/ChipComponent"
import "../../../../assets/scss/pages/users.scss"

import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import ToolBar from "../../../../components/especificos/toolbar"

const schema = Yup.object().shape({
  un_id: Yup.number()
  .min(1,"Unidade de Negócio é obrigatória")
  .required("Unidade de Negócio é obrigatória"),
  financial_id: Yup.number()
  .min(1,"Conta do Financeiro é obrigatória")
  .required("Conta do Financeiro é obrigatória"),
  material_id: Yup.number()
  .min(1,"Material é obrigatório")
  .required("Material é obrigatório"),
  qtd:  Yup.number()
  .min(0.0001, "Quantidade é obrigatória")
  .required("Quantidade é obrigatória"),
  unitValue: Yup.number()
  .min(0.01, "Valor Unitário é obrigatório")
  .required("Valor Unitário é obrigatório"),
  discValue: Yup.number()
  .min(0, "Valor do Desconto inválido"),
  addValue: Yup.number()
  .min(0, "Valor do Acréscimo inválido"),
  value: Yup.number()
  .min(0.01, "Valor total inválido"),
});

export default function InvoiceItemCadastro(props) {
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
    un_id: { value: 0,  invalid: false, tab: '1', msg:'', select: null },
    financial_id: { value: 0,  invalid: false, tab: '1', msg:'', select: null },
    material_id: { value: 0,  invalid: false, tab: '1', msg:'', select: null },
    qtd: { value: 0,  invalid: false, tab: '1', msg:'' },
    unitValue: { value: 0, invalid: false, tab: '1', msg:'' },
    discValue: { value: 0, invalid: false, tab: '1', msg:'' },
    addValue: { value: 0, invalid: false, tab: '1', msg:'' },
    value: { value: 0, invalid: false, tab: '1', msg:'' },
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
        rowData.un_id.value = props.data.un_id
        rowData.financial_id.value = props.data.financial_id
        rowData.material_id.value = props.data.material_id
        rowData.qtd.value = props.data.qtd
        rowData.unitValue.value = props.data.unitValue
        rowData.discValue.value = props.data.discValue
        rowData.addValue.value = props.data.addValue
        rowData.value.value = props.data.value
        rowData.un_id.select = props.data.businessUnit
        rowData.financial_id.select = props.data.financialAccount
        rowData.material_id.select = props.data.material
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
    if(id==='qtd.value' || id==='unitValue.value' || id==='discValue.value' || id==='addValue.value' ) {
      let valor= (rowData.qtd.value *  rowData.unitValue.value ) - rowData.discValue.value + rowData.addValue.value
      _.set(rowData, 'value.value', valor);
    }
    _.set(rowData, id, value);
    // setAtualiza(!atualiza)
  }
  function handleChangeSelect(id, idSelect, value, select) {
    _.set(rowData, id, value);
    if(select !== undefined) {
      _.set(rowData, idSelect, select)
    }
    // setAtualiza(!atualiza)
  }
  async function handleSubmit() {
    try {
      for(var row in rowData){
        rowData[row].invalid = false
        rowData[row].msg = ""
      }
      if(rowData.qtd.value === undefined || rowData.qtd.value === null) {
        rowData.qtd.value = 0
      }
      if(rowData.unitValue.value === undefined || rowData.unitValue.value === null) {
        rowData.unitValue.value = 0
      }
      if(rowData.discValue.value === undefined || rowData.discValue.value === null) {
        rowData.discValue.value = 0
      }
      if(rowData.addValue.value === undefined || rowData.addValue.value === null) {
        rowData.addValue.value = 0
      }
      if(rowData.value.value === undefined || rowData.value.value === null) {
        rowData.value.value = 0
      }
      await schema.validate(
        {
          un_id: rowData.un_id.value,
          financial_id: rowData.financial_id.value,
          material_id: rowData.material_id.value,
          qtd: rowData.qtd.value,
          unitValue: rowData.unitValue.value,
          discValue: rowData.discValue.value,
          addValue: rowData.addValue.value,
          value: rowData.value.value,
        },
        {
          abortEarly: false
        }
      );

      rowData.value.value= (rowData.qtd.value *  rowData.unitValue.value ) - rowData.discValue.value + rowData.addValue.value
      console.log(rowData.value)
      if(rowData.value.value<=0) {
        rowData.value.msg='Valor total do item com valor inválido!'
        rowData.value.invalid = true
        setAtualiza(!atualiza)
        return
      }
      setAtualiza(!atualiza)
      let  data =  {
        un_id: rowData.un_id.value,
        financial_id: rowData.financial_id.value,
        material_id: rowData.material_id.value,
        qtd: rowData.qtd.value,
        unitValue: rowData.unitValue.value,
        discValue: rowData.discValue.value,
        addValue: rowData.addValue.value,
        value: (rowData.qtd.value *  rowData.unitValue.value ) - rowData.discValue.value + rowData.addValue.value,
        businessUnit: (rowData.un_id.select ? {
          id: rowData.un_id.select.id,
          name: rowData.un_id.select.name
        } : null),
        financialAccount: (rowData.financial_id.select ? {
          id: rowData.financial_id.select.id,
          name: rowData.financial_id.select.name
        } : null),
        material: (rowData.material_id.select ? {
          id: rowData.material_id.select.id,
          name: rowData.material_id.select.name
        } : null)
      }
      if (!edicao) {
        try {
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
                toast.error(`Erro ao Incluir o Material! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao Incluir o Material! ${error.message}`, { transition: Flip });
          }
        }
      } else {
        try {
          data.id  =  rowData.id.value
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
                toast.error(`Erro ao Incluir o Material! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao atualizar o Material! ${error.message}`, { transition: Flip });
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
              !edicao ? "incluir" : "alterar"
            } o Material.`
          , { transition: Flip });
        }
        toggle(tabAux)
        setAtualiza(!atualiza)
      } else {
        toast.error(
          `Não foi possível ${!edicao ? "incluir" : "alterar"} o Material. ${error.message}`
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
              <Col sm="6" lg="6">
                <FormGroup>
                  <Label>Unidade de Negócio</Label>
                  <Select
                    getOptionLabel={option => `${option.id} - ${option.name}`}
                    getOptionValue={option => option.id}
                    className="React"
                    placeholder="Unidade de Negócio"
                    classNamePrefix="select"
                    isSearchable={true}
                    name="group"
                    options={props.businessunits}
                    defaultValue={props.businessunits ? props.businessunits.filter(option => option.id === rowData.un_id.value) : 0}
                    onChange={e =>  handleChangeSelect("un_id.value","un_id.select", e === null ? null : e.id,e)}
                    isDisabled={!salvarPermission}
                  />
                  {rowData.un_id.invalid ? <div className="text-danger font-small-2">{rowData.un_id.msg}</div>: null }
                </FormGroup>
              </Col>
              <Col sm="6" lg="6">
                <FormGroup>
                  <Label>Conta Financeira</Label>
                  <Select
                    getOptionLabel={option => `${option.id} - ${option.name}`}
                    getOptionValue={option => option.id}
                    className="React"
                    placeholder="Conta Financeira"
                    classNamePrefix="select"
                    isSearchable={true}
                    name="group"
                    options={props.financialaccounts}
                    defaultValue={props.financialaccounts ? props.financialaccounts.filter(option => option.id === rowData.financial_id.value) : 0}
                    onChange={e =>  handleChangeSelect("financial_id.value","financial_id.select", e === null ? null : e.id,e)}
                    isDisabled={!salvarPermission}
                  />
                  {rowData.financial_id.invalid ? <div className="text-danger font-small-2">{rowData.financial_id.msg}</div>: null }
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="6" lg="6">
                <FormGroup>
                  <Label>Material</Label>
                  <Select
                    getOptionLabel={option => `${option.id} - ${option.name}`}
                    getOptionValue={option => option.id}
                    className="React"
                    placeholder="Material"
                    classNamePrefix="select"
                    isSearchable={true}
                    name="group"
                    options={props.materials}
                    defaultValue={props.materials ? props.materials.filter(option => option.id === rowData.material_id.value) : 0 }
                    onChange={e =>  handleChangeSelect("material_id.value","material_id.select", e === null ? null : e.id,e)}
                    isDisabled={!salvarPermission}
                  />
                  {rowData.material_id.invalid ? <div className="text-danger font-small-2">{rowData.material_id.msg}</div>: null }
                </FormGroup>
              </Col>
              <Col sm="3" lg="3">
                <FormGroup>
                  <Label>Quantidade</Label>
                  <NumberFormat
                    // prefix={'R$'}
                    decimalScale={4}
                    decimalSeparator={','}
                    thousandSeparator={'.'}
                    className="form-control"
                    placeholder="Quantidade"
                    value={rowData.qtd.value}
                    onValueChange={e => handleChange("qtd.value",e.floatValue)}
                    invalid={rowData.qtd.invalid.toString()}
                    disabled={!salvarPermission}
                  />
                  {rowData.qtd.invalid ? <div className="text-danger font-small-2">{rowData.qtd.msg}</div>: null }
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="3" lg="3">
                <FormGroup>
                  <Label>Valor Unitário</Label>
                  <NumberFormat
                    prefix={'R$'}
                    decimalScale={4}
                    decimalSeparator={','}
                    thousandSeparator={'.'}
                    className="form-control"
                    placeholder="Valor Unitário"
                    autoFocus
                    value={rowData.unitValue.value}
                    onValueChange={e => handleChange("unitValue.value",e.floatValue)}
                    invalid={rowData.unitValue.invalid.toString()}
                    disabled={!salvarPermission}
                  />
                  {rowData.unitValue.invalid ? <div className="text-danger font-small-2">{rowData.unitValue.msg}</div>: null }
                </FormGroup>
              </Col>
              <Col sm="3" lg="3">
                <FormGroup>
                  <Label>Desconto</Label>
                  <NumberFormat
                    prefix={'R$'}
                    decimalScale={4}
                    decimalSeparator={','}
                    thousandSeparator={'.'}
                    className="form-control"
                    placeholder="Desconto"
                    value={rowData.discValue.value}
                    onValueChange={e => handleChange("discValue.value",e.floatValue)}
                    invalid={rowData.discValue.invalid.toString()}
                    disabled={!salvarPermission}
                  />
                  {rowData.discValue.invalid ? <div className="text-danger font-small-2">{rowData.discValue.msg}</div>: null }
                </FormGroup>
              </Col>
              <Col sm="3" lg="3">
                <FormGroup>
                  <Label>Acréscimo</Label>
                  <NumberFormat
                    prefix={'R$'}
                    decimalScale={4}
                    decimalSeparator={','}
                    thousandSeparator={'.'}
                    className="form-control"
                    placeholder="Acréscimo"
                    value={rowData.addValue.value}
                    onValueChange={e => handleChange("addValue.value",e.floatValue)}
                    invalid={rowData.addValue.invalid.toString()}
                    disabled={!salvarPermission}
                  />
                  {rowData.addValue.invalid ? <div className="text-danger font-small-2">{rowData.addValue.msg}</div>: null }
                </FormGroup>
              </Col>
            </Row>
            <Row>
            <Col sm="3" lg="3">
                <FormGroup>
                  <Label>Total</Label>
                  <NumberFormat
                    prefix={'R$'}
                    decimalScale={4}
                    decimalSeparator={','}
                    thousandSeparator={'.'}
                    className="form-control"
                    placeholder="Total"
                    value={rowData.value.value}
                    onValueChange={e => handleChange("value.value",e.floatValue)}
                    invalid={rowData.value.invalid.toString()}
                    disabled={!salvarPermission}
                  />
                  {rowData.value.invalid ? <div className="text-danger font-small-2">{rowData.value.msg}</div>: null }
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
        className="modal-dialog-centered modal-lg"
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
