import React, { useState, useEffect } from "react"
import {
  Row,
  Col,
  Form,
  Modal,
  ModalBody,
  Input,
  Label,
  FormGroup,
  FormFeedback,
  Spinner
} from "reactstrap"
import _ from 'lodash';
import { useSelector } from "react-redux";
import { toast, Flip } from "react-toastify"
import * as Yup from "yup";
import Select from "react-select"
import InputMask from "react-input-mask"

import { pad } from "../../../../shared/geral"

import Chip from "../../../../components/@vuexy/chips/ChipComponent"
import "../../../../assets/scss/pages/users.scss"
import Radio from "../../../../components/@vuexy/radio/RadioVuexy"

import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import api from "../../../../services/api"
import ToolBar from "../../../../components/especificos/toolbar"

const schema = Yup.object().shape({
  name: Yup.string()
  .required("O nome é obrigatório"),
  is_active: Yup
    .boolean(),
  structure: Yup.string()
    .required("Estruturado é obrigatório"),
  measurement_id: Yup.number()
    .min(1,"Unidade é obrigatório")
    .required("Unidade é obrigatório"),
  level: Yup.number()
    .min(0,"Nivel inválido")
    .required("Nivel inválido"),
  sequence: Yup.number()
    .min(0,"Sequencial inválido")
    .required("Sequencial inválido"),
  is_group: Yup
    .boolean(),
  // outros notOneof(['admin','teste'], 'este nome nao pode')
  // exemplos https://github.com/jquense/yup#usage
});

export default function AccountingAccountCadastro(props) {
  let listaPermission = props.userPermission.includes(82)
  let insertPermission = props.userPermission.includes(82+1)
  let updatePermission = props.userPermission.includes(82+2)
  let dadosdoCadastroPermission = props.userPermission.includes(82+5)
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
  // "licence_id": 1,
  //   "table_type": "L",
  //   "table_number": 1,
  //   "table_subnumber": 0,
  const baseData = {
    id: { value: 0,  invalid: false, tab: '1', msg:'' },
    name: { value: '',  invalid: false, tab: '1', msg:'' },
    is_active: { value: true, invalid: false, tab: '1', msg:'' },
    structure: { value: '',  invalid: false, tab: '1', msg:'' },
    measurement_id: { value: 0,  invalid: false, tab: '1', msg:'', select: { value: 0, label: ""} },
    group_id: { value: 0,  invalid: false, tab: '1', msg:'', select: { value: 0, label: ""} },
    level: { value: 0,  invalid: false, tab: '1', msg:'' },
    sequence: { value: '',  invalid: false, tab: '1', msg:'', mask: '999', valueMask:'', label: 'Sequencial' },
    is_group: { value: true, invalid: false, tab: '1', msg:'' },
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
      //acerto da mascara


      setId(props.id)
      setEdicao(props.id>0)

      if(props.id > 0 && props.data) {
        baseData.sequence.mask = props.config.mask[props.data.level].toString()
        rowData.sequence.mask = props.config.mask[props.data.level].toString()
        rowData.id.value = props.data.id
        rowData.name.value = props.data.name
        rowData.is_active.value = props.data.is_active
        rowData.structure.value = props.data.structure
        rowData.measurement_id.value= props.data.measurement_id
        rowData.group_id.value= props.data.group_id
        rowData.level.value= props.data.level
        rowData.sequence.value= props.data.sequence
        rowData.is_group.value= props.data.is_group
        if(props.data.group_id>0) {
          rowData.group_id.select = props.groups.find(option => option.id === rowData.group_id.value)
        }
      }
      else {
        if(props.config) {
          baseData.sequence.mask = props.config.mask[0].toString()
        }
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

  function handleChangeMask(id, idMask, valueMask,select) {
    let value = valueMask.replace(/\D/g, '')
    if(_.get(rowData,id) !== value) {
      _.set(rowData, idMask, valueMask);
      _.set(rowData, id, value)
      if (id === "sequence.value") {
        let level = rowData.level.value
        if(rowData.group_id.select && rowData.group_id.select.id !== null && rowData.group_id.select.id !== undefined) {
          rowData.structure.value = `${rowData.group_id.select.structure}.${pad(value,props.config.mask[level].toString().length)}`
        }
        else {
          rowData.structure.value = `${pad(value,props.config.mask[level].toString().length)}`
        }
        setAtualiza(!atualiza)
      }
    }
  }

  function handleChangeSelect(id, idSelect, value, select) {
    if (id === "group_id.value") {
      let level=0
      if(select !== null) {
        level = select.level + 1
      }
      if(level<=props.config.mask.length-1) {
        baseData.sequence.mask = props.config.mask[level].toString()
        rowData.sequence.mask = props.config.mask[level].toString()
        rowData.level.value = level
      }
      if(select !== null && select !== undefined) {
        rowData.structure.value = `${select.structure}.${pad(rowData.sequence.value,props.config.mask[level].toString().length)}`
      }
      else {
        rowData.structure.value = `${pad(rowData.sequence.value,props.config.mask[level].toString().length)}`
      }
    }
    _.set(rowData, id, value);
    if(select !== undefined) {
      _.set(rowData, idSelect, select)
    }
    setAtualiza(!atualiza)
  }

  async function handleSubmit() {
    try {
      for(var row in rowData){
        rowData[row].invalid = false
        rowData[row].msg = ""
      }
      if(rowData.sequence.value === "") {
        rowData.sequence.value = 0
      }
      if(rowData.level.value>=0 && rowData.level.value<=props.config.mask.length-1) {
        if(rowData.sequence.value>props.config.mask[rowData.level.value]) {
          rowData.sequence.invalid = true
          rowData.sequence.msg = "Sequencial Inválido"
          setAtualiza(!atualiza)
          return
        }
      }
      if(rowData.sequence.value === 0 && edicao) {
        rowData.sequence.invalid = true
        rowData.sequence.msg = "Sequencial Inválido"
        setAtualiza(!atualiza)
        return
      }
      if(rowData.id.value === rowData.group_id.value && edicao) {
        rowData.group_id.invalid = true
        rowData.group_id.msg = "Grupo Inválido"
        setAtualiza(!atualiza)
        return
      }

      await schema.validate(
        {
          name: rowData.name.value,
          is_active: rowData.is_active.value,
          structure: rowData.structure.value,
          measurement_id: rowData.measurement_id.value,
          group_id: rowData.group_id.value,
          level: rowData.level.value,
          sequence: rowData.sequence.value,
          is_group: rowData.is_group.value,
        },
        {
          abortEarly: false
        }
      );
      let data=null
      if(rowData.group_id.value === 0 ) {
        rowData.group_id.value = null
      }
      if (!edicao) {
        try {
          data = {
            licence_id: auth.login.licence_id,
            company_id: props.config.company_id,
            un_id: props.config.un_id,
            name: rowData.name.value,
            is_active: rowData.is_active.value,
            userlog_id: auth.login.values.loggedInUser.id,
            structure: rowData.structure.value,
            measurement_id: rowData.measurement_id.value,
            group_id: rowData.group_id.value,
            level: rowData.level.value,
            sequence: rowData.sequence.value,
            is_group: rowData.is_group.value,
            table_type: props.config.table_type,
            table_number: props.config.table_number,
            table_subnumber: props.config.table_subnumber,
          }
          const response = await api.post(`/accountingaccounts`, data);
          rowData.id.value = response.data.id
          props.handleSidebar(false)
          props.handleAdd(response.data)
          setRowData(baseData)
          toast.success("Conta incluída com sucesso!", { transition: Flip });
        } catch (error) {
          if (typeof error.response !== 'undefined')
          {
            if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
            {
              if(error.response.data.message !== undefined) {
                toast.error(error.response.data.message, { transition: Flip });
              }
              else{
                toast.error(`Erro ao Incluir a Conta! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao Incluir a Conta! ${error.message}`, { transition: Flip });
          }
        }
      } else {
        try {
          data = {
            licence_id: auth.login.licence_id,
            id: rowData.id.value,
            name: rowData.name.value,
            is_active: rowData.is_active.value,
            userlog_id: auth.login.values.loggedInUser.id,
            structure: rowData.structure.value,
            measurement_id: rowData.measurement_id.value,
            group_id: rowData.group_id.value,
            level: rowData.level.value,
            sequence: rowData.sequence.value,
            is_group: rowData.is_group.value,
          }
          await api.put(`/accountingaccounts`, data)
          props.handleSidebar(false)
          props.handleUpdate(data)
          setRowData(baseData)
          toast.success("Conta atualizada com sucesso!", { transition: Flip });
        } catch (error) {
          if (typeof error.response !== 'undefined')
          {
            if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
            {
              if(error.response.data.message !== undefined) {
                toast.error(error.response.data.message, { transition: Flip });
              }
              else{
                toast.error(`Erro ao Incluir a Conta! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao atualizar a Conta! ${error.message}`, { transition: Flip });
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
            } a Conta.`
          , { transition: Flip });
        }
        toggle(tabAux)
        setAtualiza(!atualiza)
      } else {
        toast.error(
          `Não foi possível ${id === "0" ? "incluir" : "alterar"} a Conta. ${error.message}`
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
              <Col>
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
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label className="d-block mb-50">Unidade</Label>
                  <Select
                    getOptionLabel={option => `${option.name} (${option.initials})`}
                    getOptionValue={option => option.id}
                    className="React"
                    classNamePrefix="select"
                    isSearchable={true}
                    name="measure"
                    options={props.measures}
                    defaultValue={props.measures.filter(option => option.id === rowData.measurement_id.value)}
                    onChange={e => handleChangeSelect("measurement_id.value","measurement_id.select",e.id,e)}
                    isDisabled={!salvarPermission}
                  />
                   {rowData.measurement_id.invalid ? <div className="text-danger font-small-2">{rowData.measurement_id.msg}</div>: null }
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="6" lg="6">
                <FormGroup>
                  <Label className="d-block mb-50">Grupo Pai</Label>
                  <Select
                    getOptionLabel={option => `${option.structure} - ${option.name}`}
                    getOptionValue={option => option.id}
                    className="React"
                    placeholder="sem grupo pai"
                    classNamePrefix="select"
                    isSearchable={true}
                    isClearable={true}
                    name="group"
                    options={props.groups}
                    defaultValue={props.groups.filter(option => option.id === rowData.group_id.value)}
                    onChange={e =>  handleChangeSelect("group_id.value","group_id.select", e === null ? null : e.id,e)}
                    isDisabled={!salvarPermission}
                  />
                  {rowData.group_id.invalid ? <div className="text-danger font-small-2">{rowData.group_id.msg}</div>: null }
                </FormGroup>
              </Col>
              <Col sm="3" lg="3">
                <FormGroup>
                  <Label className="d-block mb-50">{rowData.sequence.label}</Label>
                  <Input
                    type="text"
                    placeholder={rowData.sequence.label}
                    required
                    autoFocus
                    defaultValue={rowData.sequence.value}
                    mask={rowData.sequence.mask}
                    onChange={e => handleChangeMask("sequence.value",'sequence.valueMask',e.target.value)}
                    invalid={rowData.sequence.invalid}
                    disabled={!salvarPermission}
                    tag={InputMask}
                  />

                  <FormFeedback>{rowData.sequence.msg}</FormFeedback>
                </FormGroup>
              </Col>
              <Col sm="3" lg="3">
                <FormGroup>
                  <Label className="d-block mb-50">Estruturado</Label>
                  <Input
                    type="text"
                    defaultValue= {rowData.structure.value ? rowData.structure.value : null}
                    id="structure.value"
                    placeholder="estruturado"
                    onChange={e => handleChange(e.target.id,e.target.value)}
                    invalid={rowData.structure.invalid}
                    disabled
                  />
                  <FormFeedback>{rowData.structure.msg}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
              </Col>
              <Col>
                <FormGroup>
                  <Label className="d-block mb-50">Grupo</Label>
                  <div className="d-inline-block mr-1">
                    <Radio
                      label="Sim"
                      color="primary"
                      defaultChecked={rowData.is_group.value}
                      onChange={e => handleChange("is_group.value", true)}
                      name="is_group"
                      disabled={!salvarPermission}
                    />
                  </div>
                  <div className="d-inline-block mr-1">
                    <Radio
                      label="Não"
                      color="primary"
                      defaultChecked={!rowData.is_group.value}
                      onChange={e => handleChange("is_group.value",false)}
                      name="is_group"
                      disabled={!salvarPermission}
                    />
                  </div>
                </FormGroup>
              </Col>
              <Col>
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
