import React, { useState, useEffect, useRef } from "react"
import {
  Row,
  Col,
  Form,
  Modal,
  ModalBody,
  Media,
  Button,
  Input,
  Label,
  FormGroup,
  FormFeedback,
  Spinner
} from "reactstrap"
import Select from "react-select"
import InputMask from "react-input-mask"

import _ from 'lodash';
import { useSelector } from "react-redux";
import { toast, Flip } from "react-toastify"
import * as Yup from "yup";

import "flatpickr/dist/themes/light.css";

import Chip from "../../../../components/@vuexy/chips/ChipComponent"
import "../../../../assets/scss/pages/users.scss"
import Radio from "../../../../components/@vuexy/radio/RadioVuexy"

import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import api from "../../../../services/api"
import ToolBar from "../../../../components/especificos/toolbar"
import { testaCPFCNPJ } from "../../../../shared/geral"
import { dicalogin } from "../../../../shared/geral"
import { ContainerAvatar } from "./styles";

const schema = Yup.object().shape({
  name: Yup.string()
  .required("O nome é obrigatório"),
  is_active: Yup
    .boolean(),
  documenttype: Yup.string()
    .required("CPF/CNPJ é obrigatório")
    .oneOf(["F","J"],"CPF/CNPJ é obrigatório"),
  document: Yup.string()
    // .nullable()
    .required("CPF/CNPJ é obrigatório")
    .min(11, "Mínimo 11 caracteres")
    .max(14, 'Máximo 14 caracteres')
    .test("test-name", "CPF/CNPJ inválido",
      function(value) {
        return testaCPFCNPJ(value,true)
    }),
  companygroup_id: Yup.number()
    .min(1,"O Perfil é obrigatório")
    .required("O Perfil é obrigatório"),
  // outros notOneof(['admin','teste'], 'este nome nao pode')
  // exemplos https://github.com/jquense/yup#usage
});

export default function CompanyData(props) {
  let listaPermission = props.userPermission.includes(49)
  let insertPermission = props.userPermission.includes(49+1)
  let updatePermission = props.userPermission.includes(49+2)
  let dadosdoCadastroPermission = props.userPermission.includes(49+5)
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
  const [companygroups, setCompanyGroups] = useState([])

  const baseData =   {
    id: { value: 0,  invalid: false, tab: '1', msg:'' },
    name: { value: '',  invalid: false, tab: '1', msg:'' },
    is_active: { value: true, invalid: false, tab: '1', msg:'' },
    companygroup_id: { value: 0,  invalid: false, tab: '1', msg:'', select: { value: 0, label: ""} },
    document: { value: '',  invalid: false, tab: '2', msg:'', mask: '999-999-999-99', valueMask:'', label: 'CPF' },
    documenttype: { value: 'F', invalid: false, tab: '2', msg:'' },
    avatar: { value: null,  invalid: false, tab: '1', msg:'' },
    avatar_id: { value: null,  invalid: false, tab: '1', msg:'' },
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
  const [iniciais, setIniciais] = useState("")
  const [url, setUrl] = useState(null)

  const auth = useSelector(state => state.auth);

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
        props.handleSidebar(false)
        return
      }
      let body = {
        licence_id: auth.login.licence_id,
        id: 0,
        userlog_id: auth.login.values.loggedInUser.id
      };
      let response = await api.post("/companygroups.list", {
        ...body
      });
      setCompanyGroups(response.data)

      body = {
        licence_id: auth.login.licence_id,
        id: 0
      };
      setId(props.id)
      setEdicao(props.id>0)
      if(props.id > 0 && props.data) {
        // body = {
        //   licence_id: auth.login.licence_id,
        //   id: parseInt(id)
        // };
        // response = await api.post("/companies.list", {
        //   ...body
        // });
        // if(response.data !== undefined && response.data[0] !== undefined )
        // {
        //   let dados = response.data[0]

          // rowData.id.value = parseInt(id)
          // rowData.name.value = dados.name
          // rowData.is_active.value = dados.is_active
          // rowData.document.value = dados.document
          // rowData.documenttype.value = dados.documenttype
          // rowData.companygroup_id.value = dados.companygroup_id
        // }
        rowData.id.value = props.data.id
        rowData.name.value = props.data.name
        rowData.is_active.value = props.data.is_active
        rowData.document.value = props.data.document
        rowData.documenttype.value = props.data.documenttype
        rowData.companygroup_id.value = props.data.companygroup_id

        rowData.avatar_id.value = props.data.avatar_id
        rowData.is_active.value = props.data.is_active
        rowData.avatar.value = props.data.files
        setIniciais(dicalogin(props.data.name))
        setUrl(props.data.files ? props.data.files.url : null)

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

  function handleChangeMask(id, idMask, valueMask) {
    _.set(rowData, idMask, valueMask);
    let value = valueMask.replace(/\D/g, '')
    _.set(rowData, id, value)
  }
  function handleChangeSelect(id, idSelect, value, select) {
    _.set(rowData, id, value);
    if(select !== undefined) {
      _.set(rowData, idSelect, select)
    }
    setAtualiza(!atualiza)
  }
  function onChangeDocumentType(par) {
    // if (/^3[47]/.test(value)) {
    if (par==="F"){
      rowData.document.mask = "999-999-999-99"
      rowData.document.label = 'CPF'
      rowData.document.value = ''
    }
    else
    {
      rowData.document.mask = "99-999-999/9999-99"
      rowData.document.label = 'CNPJ'
      rowData.document.value = ''
    }
    handleChange("documenttype.value", par)
    setAtualiza(!atualiza)
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
          document: rowData.document.value,
          documenttype: rowData.documenttype.value,
          companygroup_id: rowData.companygroup_id.value,
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

      if (!edicao) {
        try {
          data = {
            licence_id: auth.login.licence_id,
            name: rowData.name.value,
            is_active: rowData.is_active.value,
            userlog_id: auth.login.values.loggedInUser.id,
            document: rowData.document.value,
            documenttype: rowData.documenttype.value,
            companygroup_id: rowData.companygroup_id.value,
            avatar_id: rowData.avatar_id.value,
          }
          const response = await api.post(`/companies`, data);
          props.handleSidebar(false)
          props.handleAdd(response.data[0])
          setRowData(baseData)
          setIniciais(dicalogin(response.data.name))
          toast.success("Empresa incluida com sucesso!", { transition: Flip });
        } catch (error) {
          if (typeof error.response !== 'undefined')
          {
            if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
            {
              if(error.response.data.message !== undefined) {
                toast.error(error.response.data.message, { transition: Flip });
              }
              else{
                toast.error(`Erro ao Incluir a Empresa! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao Incluir a Empresa! ${error.message}`, { transition: Flip });
          }
        }
      } else {
        try {
          data = {
            id: rowData.id.value,
            licence_id: auth.login.licence_id,
            name: rowData.name.value,
            is_active: rowData.is_active.value,
            userlog_id: auth.login.values.loggedInUser.id,
            document: rowData.document.value,
            documenttype: rowData.documenttype.value,
            companygroup_id: rowData.companygroup_id.value,
            avatar_id: rowData.avatar_id.value,
          }
          const response = await api.put(`/companies`, data);
          props.handleSidebar(false)
          props.handleUpdate(response.data[0])
          setRowData(baseData)
          toast.success("Empresa atualizada com sucesso!", { transition: Flip });
        } catch (error) {
          if (typeof error.response !== 'undefined')
          {
            if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
            {
              if(error.response.data.message !== undefined) {
                toast.error(error.response.data.message, { transition: Flip });
              }
              else{
                toast.error(`Erro ao Incluir a Empresa! ${error.message}`, { transition: Flip });
              }
            }
          }
          else {
            toast.error(`Erro ao atualizar a Empresa! ${error.message}`, { transition: Flip });
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
            } a Empresa.`
          , { transition: Flip });
        }
        toggle(tabAux)
        setAtualiza(!atualiza)
      } else {
        toast.error(
          `Não foi possível ${id === "0" ? "incluir" : "alterar"} a Empresa. ${error.message}`
        , { transition: Flip });
      }
    }
  }

  function FormTab1() {
    return (
      <Row>
        <Col sm="12">
          <Media className="mb-2">
            <Media className="mr-2 my-25" left href="#">
                <ContainerAvatar>
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
                </ContainerAvatar>
            </Media>
            <Media className="mt-2" body>
              <Media className="font-medium-1 text-bold-600" tag="p" heading>
                {rowData.name ? rowData.name.value : null}
              </Media>
              <div className="d-flex flex-wrap">
                <Button.Ripple className="mr-1" color="primary" disabled={!salvarPermission} outline onClick={() => handleImg(null)} size="sm" >
                 Remover Imagem
                </Button.Ripple>
                {/* <Button.Ripple color="flat-danger">Remover Imagem</Button.Ripple> */}
              </div>
            </Media>
          </Media>
        </Col>
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
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label className="d-block mb-50">Grupo Empresarial</Label>
                    <Select
                      getOptionLabel={option => option.name}
                      getOptionValue={option => option.id}
                      className="React"
                      classNamePrefix="select"
                      isSearchable={false}
                      name="profile"
                      options={companygroups}
                      value={companygroups.filter(option => option.id === rowData.companygroup_id.value)}
                      onChange={e => handleChangeSelect("companygroup_id.value","companygroup_id.select",e.id,e)}
                      isDisabled={!salvarPermission}
                    />
                    {rowData.companygroup_id.invalid ? <div className="text-danger font-small-2">{rowData.companygroup_id.msg}</div>: null }
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label className="d-block mb-50">Pessoa</Label>
                    <div className="d-inline-block mr-1">
                      <Radio
                        label="Física"
                        color="primary"
                        defaultChecked={rowData.documenttype.value==="F"}
                        name="documenttype.value"
                        onChange={e => onChangeDocumentType("F")}
                        disabled={!salvarPermission}
                      />
                    </div>
                    <div className="d-inline-block mr-1">
                      <Radio
                        label="Jurídica"
                        color="primary"
                        defaultChecked={rowData.documenttype.value==="J"}
                        name="documenttype.value"
                        onChange={e => onChangeDocumentType("J")}
                        disabled={!salvarPermission}
                      />
                    </div>
                    {rowData.documenttype.invalid ? <td className="text-danger font-small-2" >{rowData.documenttype.msg}</td>: null }
                  </FormGroup>
                  <FormGroup className="form-label-group">
                    <Input
                      type="text"
                      placeholder={rowData.document.label}
                      required
                      defaultValue={rowData.document.value}
                      mask={rowData.document.mask}
                      onChange={e => handleChangeMask("document.value",'document.valueMask',e.target.value)}
                      invalid={rowData.document.invalid}
                      disabled={!salvarPermission}
                      tag={InputMask}
                    />
                    <Label>{rowData.document.label}</Label>
                    <FormFeedback>{rowData.document.msg}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
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
      className="modal-dialog-centered"
      style={{minWidth: '1000px', width: '100%'}}
      toggle={() => props.handleSidebar(false)}
      // style={{minWidth: '1200px', minHeight: '900px', width: '80%', height: '808px', margin: '10px auto'}}

    >
    {/* <ModalHeader toggle={() => toggleModalDelete(null,false)} className="bg-danger">
      Exclusão
    </ModalHeader> */}
    <ModalBody  className="mh-700">

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
