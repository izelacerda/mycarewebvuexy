import React, { useState, useEffect } from "react"
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  // Input,
  Label,
  FormGroup,
  FormFeedback,
  Spinner
} from "reactstrap"
import _ from 'lodash';
import { useSelector } from "react-redux";
import classnames from "classnames"
import { User, Info, Share } from "react-feather"
import { toast, Flip } from "react-toastify"
import * as Yup from "yup";

import Select from "react-select"
import NumberFormat from "react-number-format"
import {
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

import Chip from "../../../../components/@vuexy/chips/ChipComponent"
import "../../../../assets/scss/pages/users.scss"
import Flatpickr from "react-flatpickr";

import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import api from "../../../../services/api"
import ToolBar from "../../../../components/especificos/toolbar"

import "../../../../assets/scss/especificos/mymodal.css"
import InvoiceFinancialList from "./invoiceFinancialList"
import InvoiceItemList from "./invoiceItemList"

const schema = Yup.object().shape({
  company_id: Yup.number()
  .min(1,"A Empresa é obrigatória")
  .required("A Empresa é obrigatória"),
  invoicetype_id: Yup.number()
  .min(1,"Tipo de Documento é obrigatório")
  .required("Tipo de Documento é obrigatório"),
  person_id: Yup.number()
  .min(1,"Fornecedor é obrigatório")
  .required("Fornecedor é obrigatório"),
  series: Yup.string()
  .min(0,"Série deve ser 1 digito")
  .max(9,"Série deve ser 1 digito")
  .required("A Série é obrigatório"),
  number: Yup.string()
    .min(1,"Número deve ser no mínimo 1 digito")
    .max(10,"Número deve ser no máximo 10 digitos")
    .required("O Número é obrigatório"),
  sequential: Yup.string()
    .min(0,"Sequencia deve ser 1 digito")
    .max(9,"Sequencia deve ser 1 digito")
    .required("A Sequencia é obrigatório"),
  dtDocument: Yup.date()
  .required("A Data do Documento é obrigatória"),
  dtReceived: Yup.date()
  .required("A Data do Documento é obrigatória"),
  totalValue: Yup.number()
  .required("O Valor Total é obrigatório"),
  // outros notOneof(['admin','teste'], 'este nome nao pode')
  // exemplos https://github.com/jquense/yup#usage
});

export default function InvoiceCadastro(props) {
  let listaPermission = props.userPermission.includes(94)
  let insertPermission = props.userPermission.includes(94+1)
  let updatePermission = props.userPermission.includes(94+2)
  let deletePermission = props.userPermission.includes(94+3)
  let reportPermission = props.userPermission.includes(94+4)
  let dadosdoCadastroPermission = props.userPermission.includes(94+5)
  let salvarPermission = true

  const permission = {
    insert: insertPermission,
    delete: deletePermission,
    report: reportPermission,
    dadosdoCadastro:  dadosdoCadastroPermission
  }

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
  const [loaded, setLoaded] = useState(false)
  const [atualiza, setAtualiza] = useState(true);
  const [showModalClose, setShowModalClose] = useState(false)

  const baseData = {
    id: { value: 0,  invalid: false, tab: '1', msg:'' },
    invoicetype_id: { value: 0,  invalid: false, tab: '1', msg:'', select: { value: 0, label: ""} },
    company_id: { value: 0,  invalid: false, tab: '1', msg:'', select: { value: 0, label: ""} },
    person_id: { value: 0,  invalid: false, tab: '1', msg:'', select: { value: 0, label: ""} },
    series: { value: 0,  invalid: false, tab: '1', msg:'' },
    number: { value: 0,  invalid: false, tab: '1', msg:'' },
    sequential: { value: 0,  invalid: false, tab: '1', msg:'' },
    dtDocument: { value: '',  invalid: false, tab: '1', msg:'' },
    dtReceived: { value: '',  invalid: false, tab: '1', msg:'' },
    totalValue: { value: 0.00,  invalid: false, tab: '1', msg:'' },
    invoicefinancials: { value: [],  invalid: false, tab: '1', msg:'' },
    invoiceitems: { value: [],  invalid: false, tab: '1', msg:'' },
    changed: { value: false }
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
        action: () => toggleModalClose(false)
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

        if(props.data.addresses !== undefined)
        {
          if(props.data.addresses[0] !== undefined)
          {
            // rowData.street.value = props.data.addresses[0].street
            // rowData.number.value = props.data.addresses[0].number
            // rowData.complement.value = props.data.addresses[0].complement
            // rowData.addresstype.value = props.data.addresses[0].addresstype
            // rowData.zip.value = props.data.addresses[0].zip
            // rowData.country_id.value = props.data.addresses[0].companies.states.countries.id ? props.data.addresses[0].companies.states.countries.id : 0
            // rowData.state_id.value = props.data.addresses[0].companies.states.id ? props.data.addresses[0].companies.states.id : 0
            // rowData.city_id.value = props.data.addresses[0].companies.id ? props.data.addresses[0].companies.id : 0
            // handlePopula(true,true,rowData.country_id.value,rowData.state_id.value)
          }
        }
        rowData.id.value =  props.data.id
        rowData.invoicetype_id.value = props.data.invoicetype_id
        rowData.company_id.value = props.data.company_id
        rowData.person_id.value = props.data.person_id
        rowData.series.value = props.data.series
        rowData.number.value = props.data.number
        rowData.sequential.value = props.data.sequential
        rowData.dtDocument.value = props.data.dtDocument
        rowData.dtReceived.value = props.data.dtReceived
        rowData.totalValue.value = props.data.totalValue
        rowData.invoicefinancials.value = props.data.invoicefinancials
        rowData.invoiceitems.value = props.data.invoiceitems
      }
      else {
        setRowData(baseData)
      }
      setLoaded(true)
      setAtualiza(!atualiza)
    }
    if (id >=0 && auth !== undefined) {
      loadrowData();
    }
  }, [auth, props.id, props.data]) // eslint-disable-line

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
    if(id==='dtReceived.value' || id==='dtDocument.value') {
      let data = new Date(value.toString())
      let minutes = data.getMinutes()
      let hours = data.getHours()
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let start = setMilliseconds(
        setSeconds(setMinutes(setHours(data, hours), minutes), 0),
        0
      );
      value = utcToZonedTime(start, timezone);
    }
    _.set(rowData, id, value);
    _.set(rowData, 'changed.value', true)
  }


  function handleChangeSelect(id, idSelect, value, select) {
    _.set(rowData, id, value);
    if(select !== undefined) {
      _.set(rowData, idSelect, select)
    }
    _.set(rowData, 'changed.value', true)
    setAtualiza(!atualiza)
  }
  async function handleAddFinancial(data) {
    let dados = rowData.invoicefinancials.value.map(e => { return e })
    let maior = Math.max.apply(Math, rowData.invoicefinancials.value.map(function(e){return e.id}))
    if(maior === null || maior === undefined || rowData.invoicefinancials.value.length ===0 ){
      maior = 0
    }
    data.id = maior + 10001
    data.licence_id = auth.login.licence_id
    data.invoice_id = props.idPai
    dados.push(data)
    rowData.invoicefinancials.value = dados
    _.set(rowData, 'changed.value', true)
    setAtualiza(!atualiza)
  }

  async function handleUpdateFinancial(data) {
    let updatedData = rowData.invoicefinancials.value.map(e => {
      if (e.id === data.id) {
        return data
      }
      return e
    })
    _.set(rowData, 'changed.value', true)
    rowData.invoicefinancials.value = updatedData
    setAtualiza(!atualiza)
  }
  async function handleDeleteFinancial(data) {
    let rowDataAux = rowData.invoicefinancials.value.filter(function(row){ return row.id !== data.id; })
    rowData.invoicefinancials.value = rowDataAux
    _.set(rowData, 'changed.value', true)
    setAtualiza(!atualiza)
  }
  async function handleAddItem(data) {
    let dados = rowData.invoiceitems.value.map(e => { return e })
    let maior = Math.max.apply(Math, rowData.invoiceitems.value.map(function(e){return e.id}))
    if(maior === null || maior === undefined || rowData.invoiceitems.value.length ===0 ){
      maior = 0
    }
    data.id = maior + 10001
    data.licence_id = auth.login.licence_id
    data.invoice_id = props.idPai
    dados.push(data)
    rowData.invoiceitems.value = dados
    _.set(rowData, 'changed.value', true)
    setAtualiza(!atualiza)
  }
  async function handleUpdateItem(data) {
    let updatedData = rowData.invoiceitems.value.map(e => {
      if (e.id === data.id) {
        return data
      }
      return e
    })
    _.set(rowData, 'changed.value', true)
    rowData.invoiceitems.value = updatedData
    setAtualiza(!atualiza)
  }
  async function handleDeleteItem(data) {
    let rowDataAux = rowData.invoiceitems.value.filter(function(row){ return row.id !== data.id; })
    rowData.invoiceitems.value = rowDataAux
    _.set(rowData, 'changed.value', true)
    setAtualiza(!atualiza)
  }

  function toggleModalClose(status) {
    if(rowData.changed.value) {
      setShowModalClose(true)
    }
    else {
      props.handleSidebar(false)
    }
  }


  async function handleSubmit() {
    try {
      for(var row in rowData){
        rowData[row].invalid = false
        rowData[row].msg = ""
      }
      await schema.validate(
        {
          invoicetype_id: rowData.invoicetype_id.value,
          company_id: rowData.company_id.value,
          person_id: rowData.person_id.value,
          series: rowData.series.value,
          number: rowData.number.value,
          sequential: rowData.sequential.value,
          dtDocument: rowData.dtDocument.value,
          dtReceived: rowData.dtReceived.value,
          totalValue: rowData.totalValue.value
        },
        {
          abortEarly: false
        }
      )
      let data=null
      data = {

          invoicetype_id: rowData.invoicetype_id.value,
          company_id: rowData.company_id.value,
          person_id: rowData.person_id.value,
          series: rowData.series.value,
          number: rowData.number.value,
          sequential: rowData.sequential.value,
          dtDocument: rowData.dtDocument.value,
          dtReceived: rowData.dtReceived.value,
          totalValue: rowData.totalValue.value,
          type: 1,
          status: 10,
          admission: 0,
          userlog_id:   auth.login.values.loggedInUser.id,
          licence_id: auth.login.licence_id,
          invoiceitems: [],
          invoicefinancials: rowData.invoicefinancials.value
      }
      if (!edicao) {
        try {
          const response = await api.post(`/invoices`, data);
          rowData.id.value = response.data.id
          props.handleSidebar(false)
          props.handleAdd(response.data[0])
          setRowData(baseData)
          toast.success("Documento incluido com sucesso!", { transition: Flip });
        } catch (error) {
          if (typeof error.response !== 'undefined')
          {
            if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400 || error.response.status === 403  ))
            {
              if(error.response.data.message !== undefined) {
                toast.error(error.response.data.message, { transition: Flip });
              }
              else{
                toast.error(`Erro ao Incluir o Documento! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao Incluir o Documento! ${error.message}`, { transition: Flip });
          }
        }
      } else {
        try {
          data.id = rowData.id.value
          const response = await api.put(`/invoices`, data);
          props.handleSidebar(false)
          if(props.handleUpdate) {
            props.handleUpdate(response.data[0])
          }
          setRowData(baseData)
          toast.success("Documento atualizado com sucesso!", { transition: Flip });
        } catch (error) {
          if (typeof error.response !== 'undefined')
          {
            if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
            {
              if(error.response.data.message !== undefined) {
                toast.error(error.response.data.message, { transition: Flip });
              }
              else{
                toast.error(`Erro ao Incluir o Documento! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao atualizar o Documento! ${error.message}`, { transition: Flip });
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
            } o Documento.`
          , { transition: Flip });
        }
        toggle(tabAux)
        setAtualiza(!atualiza)
      } else {
        toast.error(
          `Não foi possível ${id === "0" ? "incluir" : "alterar"} o Documento. ${error.message}`
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
              <Col sm="5" lg="5">
                <FormGroup>
                  <Label>Empresa</Label>
                  <Select
                    getOptionLabel={option => `${option.id} - ${option.name}`}
                    getOptionValue={option => option.id}
                    className="React"
                    placeholder="selecionar empresa"
                    classNamePrefix="select"
                    isSearchable={true}
                    name="group"
                    options={props.companies}
                    defaultValue={props.companies.filter(option => option.id === rowData.company_id.value)}
                    onChange={e =>  handleChangeSelect("company_id.value","company_id.select", e === null ? null : e.id,e)}
                    isDisabled={!salvarPermission}
                  />
                  {rowData.company_id.invalid ? <div className="text-danger font-small-2">{rowData.company_id.msg}</div>: null }
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="5" lg="5">
                <FormGroup>
                  <Label>Fornecedor</Label>
                  <Select
                    getOptionLabel={option => `${option.id} - ${option.name}`}
                    getOptionValue={option => option.id}
                    className="React"
                    placeholder="selecionar fornecedor"
                    classNamePrefix="select"
                    isSearchable={true}
                    name="group"
                    options={props.persons}
                    defaultValue={props.persons.filter(option => option.id === rowData.person_id.value)}
                    onChange={e =>  handleChangeSelect("person_id.value","person_id.select", e === null ? null : e.id,e)}
                    isDisabled={!salvarPermission}
                  />
                  {rowData.person_id.invalid ? <div className="text-danger font-small-2">{rowData.person_id.msg}</div>: null }
                </FormGroup>
              </Col>
              <Col sm="3" lg="3">
                <FormGroup>
                  <Label>Tipo de Documento</Label>
                  <Select
                    getOptionLabel={option => `${option.id} - ${option.name}`}
                    getOptionValue={option => option.id}
                    className="React"
                    placeholder="selecionar tipo doc"
                    classNamePrefix="select"
                    isSearchable={true}
                    name="group"
                    options={props.invoicetypes}
                    defaultValue={props.invoicetypes.filter(option => option.id === rowData.invoicetype_id.value)}
                    onChange={e =>  handleChangeSelect("invoicetype_id.value","invoicetype_id.select", e === null ? null : e.id,e)}
                    isDisabled={!salvarPermission}
                  />
                  {rowData.invoicetype_id.invalid ? <div className="text-danger font-small-2">{rowData.invoicetype_id.msg}</div>: null }
                </FormGroup>
              </Col>
              <Col sm="1" lg="1">
                <FormGroup>
                  <Label>Série</Label>
                  <NumberFormat
                    format="#"
                    className="form-control"
                    placeholder="Série"
                    defaultValue={rowData.series.value}
                    onValueChange={e => handleChange("series.value",e.floatValue)}
                    invalid={rowData.series.invalid.toString()}
                    disabled={!salvarPermission}
                  />
                  <FormFeedback>{rowData.series.msg}</FormFeedback>
                </FormGroup>
              </Col>
              <Col sm="2" lg="2">
                <FormGroup>
                  <Label>Número</Label>
                  <NumberFormat
                    format="##########"
                    className="form-control"
                    placeholder="Número"
                    defaultValue={rowData.number.value}
                    onValueChange={e => handleChange("number.value",e.floatValue)}
                    invalid={rowData.number.invalid.toString()}
                    disabled={!salvarPermission}
                  />
                  <FormFeedback>{rowData.number.msg}</FormFeedback>
                </FormGroup>
              </Col>
              <Col sm="1" lg="1">
                <FormGroup>
                  <Label>Sequencia</Label>
                  <NumberFormat
                    format="#"
                    className="form-control"
                    placeholder="Sequencia"
                    defaultValue={rowData.sequential.value}
                    onValueChange={e => handleChange("sequential.value",e.floatValue)}
                    invalid={rowData.sequential.invalid.toString()}
                    disabled={!salvarPermission}
                  />
{/*
                  <InputMask
                    mask="9"
                    className="form-control"
                    id="sequential.value"
                    placeholder="Sequencia"
                    defaultValue={rowData.sequential.value}
                    onChange={e => handleChange(e.target.id,e.target.value)}
                    invalid={rowData.sequential.invalid}
                    disabled={!salvarPermission}
                    /> */}
                  {/* <Input
                    type="number"
                    id="sequential.value"
                    placeholder="Sequencia"
                    defaultValue={rowData.sequential.value}
                    onChange={e => handleChange(e.target.id,e.target.value)}
                    invalid={rowData.sequential.invalid}
                    disabled={!salvarPermission}
                    /> */}
                  <FormFeedback>{rowData.sequential.msg}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="2" lg="2">
                <FormGroup>
                  <Label>
                    Data do Documento
                  </Label>
                  <Flatpickr
                    id="dtDocument"
                    className="form-control"
                     // options={{ altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", }}
                    options={{ dateFormat: "d-m-Y", enableTime: false }}
                    value={rowData.dtDocument.value}
                    onChange={date => handleChange("dtDocument.value", date[0].toJSON())}
                    disabled={!salvarPermission}
                    // onChange={date => this.handledob(date)}
                  />
                </FormGroup>
              </Col>
              <Col sm="2" lg="2">
                <FormGroup>
                  <Label>
                    Data do Recebimento
                  </Label>
                  <Flatpickr
                    id="dobR"
                    className="form-control"
                    options={{ dateFormat: "d-m-Y" }}
                    value={rowData.dtReceived.value}
                    onChange={date => handleChange("dtReceived.value", date[0].toJSON())}
                    disabled={!salvarPermission}
                    // onChange={date => this.handledob(date)}
                  />
                </FormGroup>
              </Col>
              <Col sm="1" lg="1">

              </Col>
              <Col sm="2" lg="2">
                <FormGroup>
                  <Label>Valor total</Label>
                  <NumberFormat
                    // displayType={'text'}
                    prefix={'R$'}
                    decimalScale={2}
                    decimalSeparator={','}
                    thousandSeparator={'.'}
                    className="form-control"
                    placeholder="Valor Total"
                    value={rowData.totalValue.value}
                    onValueChange={e => handleChange("totalValue.value",e.floatValue)}
                    invalid={rowData.totalValue.invalid.toString()}
                    disabled={!salvarPermission}
                  />
                  {/* <InputMask
                  mask="999999999.99"
                  className="form-control"
                  id="totalValue.value"
                  placeholder="Valor Total"
                  defaultValue={rowData.totalValue.value}
                  onChange={e => handleChange(e.target.id,e.target.value)}
                  invalid={rowData.totalValue.invalid}
                  disabled={!salvarPermission}

                    /> */}
                  {/* <Input
                    type="number"
                    id="totalValue.value"
                    placeholder="Valor Total"
                    defaultValue={rowData.totalValue.value}
                    onChange={e => handleChange(e.target.id,e.target.value)}
                    invalid={rowData.totalValue.invalid}
                    disabled={!salvarPermission}
                    /> */}
                  <FormFeedback>{rowData.totalValue.msg}</FormFeedback>
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
        className="modal-dialog-centered"
        style={{minWidth: '1100px', width: '100%'}}
        // toggle={() => props.handleSidebar(false)}
        toggle={() => toggleModalClose(false)}
        // style={{minWidth: '1200px', minHeight: '900px', width: '80%', height: '808px', margin: '10px auto'}}

      >
      {/* <ModalHeader toggle={() => toggleModalDelete(null,false)} className="bg-danger">
        Exclusão
      </ModalHeader> */}
      <ModalBody  className="mh-700">
      <div>
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
                    <User size={16} />
                    <span className="align-middle ml-50">Dados Gerais</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === "2"
                    })}
                    onClick={() => {
                      toggle("2")
                    }}
                  >
                    <Info size={16} />
                    <span className="align-middle ml-50">Financeiro</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === "3"
                    })}
                    onClick={() => {
                      toggle("3")
                    }}
                  >
                    <Share size={16} />
                    <span className="align-middle ml-50">Itens</span>
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <ToolBar toolBarList={toolBarList} typeBar="1"/>
          </div>
        </div>
        {loaded === true ?
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <FormTab1 />
            </TabPane>
            <TabPane tabId="2">
              <InvoiceFinancialList
                rowData={rowData.invoicefinancials.value}
                permission={permission}
                idPai={id}
                handleAdd={handleAddFinancial}
                handleUpdate={handleUpdateFinancial}
                handleDelete={handleDeleteFinancial}
              />
            </TabPane>
            <TabPane tabId="3">
            <InvoiceItemList
                rowData={rowData.invoiceitems.value}
                permission={permission}
                idPai={id}
                handleAdd={handleAddItem}
                handleUpdate={handleUpdateItem}
                handleDelete={handleDeleteItem}
              />
            </TabPane>
          </TabContent>
        :
            <Spinner color="primary" className="reload-spinner" />
        }
        <Modal
          isOpen={showModalClose}
          toggle={() => setShowModalClose(false)}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setShowModalClose(false)} className="bg-warning">
            Perda Alterações
          </ModalHeader>
          <ModalBody>
            Foram alterados dados no Documento. Confirma perda das alterações? <br></br><br></br>
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={() => { setShowModalClose(false); props.handleSidebar(false); }}>
              Confirmar
            </Button>{" "}
          </ModalFooter>
        </Modal>
      </ModalBody>
      {/* <ModalFooter>
        <Button color="danger" onClick={() => handleDelete()}>
          Confirmar
        </Button>{" "}
      </ModalFooter> */}
    </Modal>

  )
}
