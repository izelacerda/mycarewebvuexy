import React, { useState, useEffect } from "react"
import {
  Card,
  CardBody,
  FormGroup,
  Input,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  CustomInput
} from "reactstrap"
import { useSelector } from "react-redux";
import { toast, Flip } from "react-toastify"
import XLSX from "xlsx"

import api from "../../../../services/api"
import { ContextLayout } from "../../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  Edit,
  Trash2
} from "react-feather"

import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"

import "../../../../assets/scss/especificos/cadastros.scss"

import { dicalogin } from "../../../../shared/geral"
import { Container, Content  } from "./styles";
import ToolBar from "../../../../components/especificos/toolbar"
import UserCadastro from "../cadastro"

export default function ProviderList(props) {
  const auth = useSelector(state => state.auth);
  let insertPermission = props.userPermission.includes(26)
  let deletePermission = props.userPermission.includes(28)
  let reportPermission = props.userPermission.includes(29)
  let dadosdoCadastroPermission = props.userPermission.includes(30)

  const [gridApi, setGridApi] = useState(null)
  const [rowData, setRowData] = useState(null)
  const pageSize = useState(50)
  const [countries, setCountries] = useState([])
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalExport, setShowModalExport] = useState(false)
  const [itemDelete, setItemDelete] = useState(null)
  const [fileName, setFileName] = useState("")
  const [fileFormat, setFileFormat] = useState("xlsx")
  const [sidebar, setSidebar] = useState(false)
  const [id, setId] = useState(0)
  const [data, setData] = useState(null)

  const toolBarList = [
    {
      id: 'toolbar1',
      color: 'primary',
      buttomClassName: "btn-icon",
      icon: 'PlusCircle',
      size: 21,
      label: null,
      outline: false,
      tooltip: 'Incluir',
      disabled: !insertPermission,
      action: () => handleId(null,0,true)  //action: () => history.push(`/app/profile/cadastro/0`)
    },
    {
      id: 'toolbar2',
      color: 'primary',
      buttomClassName: "btn-icon",
      icon: 'Download',
      size: 21,
      label: null,
      outline: false,
      tooltip: 'Exportar',
      disabled: !reportPermission,
      action: () => toggleModalExport()
    }
  ]

  const defaultColDef  = useState({
     sortable: true
  })
  const [searchVal, setsearchVal] = useState("")
  const columnDefs = [
    {
      headerName: "ID",
      field: "id",
      width: 150,
      filter: true,
      checkboxSelection: false,
      headerCheckboxSelectionFilteredOnly: true,
      headerCheckboxSelection: false
    },
    {
      headerName: "Nome",
      field: "name",
      filter: true,
      width: 250,
      cellRendererFramework: params => {
        return (
          <div
            className="d-flex align-items-center cursor-pointer"
            onClick={() => dadosdoCadastroPermission ? handleId(params.data,params.data.id,true)  : null}
          >

            {params.data.files ? (
                <img
                className="rounded-circle mr-50"
                src={params.data.files.url}
                alt="user avatar"
                height="30"
                width="30"
              />
            ) : (
              <Container>
                <Content>
                  <span className="nome">{dicalogin(params.data.name)}</span>
                </Content>
              </Container>
            )}
            <span>{params.data.name}</span>
          </div>
        )
      }
    },
    {
      headerName: "E-mail",
      field: "email",
      filter: true,
      width: 250
    },
    {
      headerName: "Ativo",
      field: "is_active",
      filter: true,
      width: 120,
      cellRendererFramework: params => {
        return params.value === true ? (
          <div className="badge badge-pill badge-light-success">
            Ativo
          </div>
        ) : params.value === false ? (
          <div className="badge badge-pill badge-light-danger">
            Inativo
          </div>
        ) : null
      }
    },
    {
      headerName: "Ações",
      field: "transactions",
      width: 150,
      cellRendererFramework: params => {
        return (
          <div className="actions cursor-pointer">
            <Edit
              className="mr-50"
              size={15}
              onClick={() => dadosdoCadastroPermission ? handleId(params.data,params.data.id,true) : null}
            />
            <Trash2
              size={15}
              disabled={!deletePermission}
              onClick={() =>
                  deletePermission ? toggleModalDelete(params.data,true) : null
              }
            />
          </div>
        )
      }
    }
  ]

  useEffect(() =>
  {
     async function loadDados() {
      if (auth.login !== undefined) {
        if (auth.login.licence_id !== undefined) {

          let body = {
            id: 0
          };
          let response = await api.post("/countries.list", {
            ...body
          });
          setCountries(response.data)

          body = {
            licence_id: auth.login.licence_id,
            id: 0,
            active: 'all',
            userlog_id: auth.login.values.loggedInUser.id
          };
          response = await api.post("/providers.list",
            body
          );
          let rowData = response.data;
          setRowData(rowData)
        }
      }
     }
     if(auth !== undefined)
      {
        loadDados();
      }
  }, [auth]);

  const onGridReady = params => {
    setGridApi(params.api)
    // setgridColumnApi(params.columnApi)
  }

  const updateSearchQuery = val => {
    gridApi.setQuickFilter(val)
    setsearchVal(val)
  }

  function handleId(data, id, sidebar) {
    setData(data)
    setId(id)
    setSidebar(sidebar)
  }
  async function handleSidebar(sidebar) {
    setSidebar(sidebar)
    setId(0)
  }
  async function handleAdd(data) {
    const dados = rowData.map(e => { return e })
    dados.push(data)
    setRowData(dados)
  }

  async function handleUpdate(data) {
    let updatedData = rowData.map(e => {
      if (e.id === data.id) {
        return data
      }
      return e
    })
    setRowData(updatedData)
  }

  function toggleModalDelete(itemDelete, status) {
    setItemDelete(itemDelete)
    setShowModalDelete(status)
  }

  async function handleDelete() {
    try {
      if(itemDelete){
        let data = {
          licence_id: auth.login.licence_id,
          id: itemDelete.id,
          login: itemDelete.login,
          userlog_id: auth.login.values.loggedInUser.id
        };
        await api.delete("/providers",
          { data }
        );
        setItemDelete(null)
        setShowModalDelete(false)
        let rowDataAux = rowData.filter(function(row){ return row.id !== itemDelete.id; })
        setRowData(rowDataAux)
        toast.success("Profissional excluído com sucesso!", { transition: Flip });
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
            toast.error(`Erro ao Excluir o Profissional! ${error.message}`, { transition: Flip });
          }
        }
      }
      else {
        toast.error(`Erro ao Excluir o Profissional! ${error.message}`, { transition: Flip });
      }
      setShowModalDelete(false)

    }

  }
  function toggleModalExport() {
    setShowModalExport(!showModalExport)
  }

  function handleExport() {
    toggleModalExport()
    // let dataToExport = this.state.dataToExport
    // rowData.map(item => {
    //   if(this.state.selectedRows.includes(item.id)){
    //     return dataToExport.push(item)
    //   }else{
    //     return null
    //   }
    // })
    // this.setState({ dataToExport })
    let fileNameArq =
      fileName.length && fileFormat.length
        ? `${fileName}.${fileFormat}`
        : "excel-sheet.xlsx"
    let wb = XLSX.utils.json_to_sheet(rowData)
    let wbout = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wbout, wb, 'teste')
    XLSX.writeFile(wbout, fileNameArq);
  }

  return (
    <Row>
      <Col sm="12">
        <Card >
          <CardBody>
            <div className="app-cadastros position-relative">
              <div
                className={`app-content-overlay ${sidebar ? "show" : "hidden"}`}
                onClick={() => {
                  handleSidebar(false)
                }}
              ></div>
                <Col sm="12">
                  <Card className="overflow-hidden">
                    <CardBody>
                      <div className="ag-theme-material ag-grid-table">
                        <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                          <div className="sort-dropdown">
                            <h3 className="primary">
                              Profissionais
                            </h3>
                          </div>
                          <div className="d-flex justify-content-end">
                            <Input
                              className="w-50 mr-1 mb-1 mb-sm-0"
                              type="text"
                              placeholder="search..."
                              onChange={e => updateSearchQuery(e.target.value)}
                              value={searchVal}
                            />
                          <ToolBar toolBarList={toolBarList} typeBar="1"/>
                          </div>
                        </div>
                        {rowData !== null ? (
                          <ContextLayout.Consumer>
                            {context => (
                              <AgGridReact
                                gridOptions={{}}
                                rowSelection="multiple"
                                defaultColDef={defaultColDef}
                                columnDefs={columnDefs}
                                rowData={rowData}
                                onGridReady={onGridReady}
                                colResizeDefault={"shift"}
                                animateRows={true}
                                floatingFilter={false}
                                pagination={true}
                                pivotPanelShow="always"
                                paginationPageSize={pageSize}
                                resizable={true}
                                enableRtl={context.state.direction === "rtl"}
                              />
                            )}
                          </ContextLayout.Consumer>
                        ) :
                          <Spinner color="primary" className="reload-spinner" />
                        }
                        <Modal
                            isOpen={showModalDelete}
                            toggle={() => toggleModalDelete(null,false)}
                            className="modal-dialog-centered"
                          >
                          <ModalHeader toggle={() => toggleModalDelete(null,false)} className="bg-danger">
                            Exclusão
                          </ModalHeader>
                          <ModalBody>
                            Confirma a exclusão do Profissional? <br></br><br></br>
                            <span className="text-center">
                              {itemDelete ? itemDelete.name : null}
                            </span>
                          </ModalBody>
                          <ModalFooter>
                            <Button color="danger" onClick={() => handleDelete()}>
                              Confirmar
                            </Button>{" "}
                          </ModalFooter>
                        </Modal>
                        <Modal
                            isOpen={showModalExport}
                            toggle={() => toggleModalExport()}
                            className="modal-dialog-centered"
                          >
                          <ModalHeader toggle={() => toggleModalExport()}>Exportar</ModalHeader>
                          <ModalBody>
                            <FormGroup>
                              <Input
                                type="text"
                                value={fileName}
                                onChange={e => setFileName(e.target.value)}
                                placeholder="Entre com o Nome do Arquivo"
                              />
                            </FormGroup>
                            <FormGroup>
                              <CustomInput
                                type="select"
                                id="selectFileFormat"
                                name="customSelect"
                                value={fileFormat}
                                onChange={e => setFileFormat(e.target.value)}
                              >
                                <option>xlsx</option>
                                <option>csv</option>
                                <option>txt</option>
                              </CustomInput>
                            </FormGroup>
                          </ModalBody>
                          <ModalFooter>
                            <Button color="primary" onClick={() => handleExport()}>
                              Exportar
                            </Button>
                            <Button color="flat-danger" onClick={() => toggleModalExport()}>
                              Cancelar
                            </Button>
                          </ModalFooter>
                        </Modal>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <UserCadastro
                  sidebar={sidebar}
                  handleSidebar={handleSidebar}
                  handleUpdate={handleUpdate}
                  handleAdd={handleAdd}
                  id={id}
                  userPermission={props.userPermission}
                  data={data}
                  countries={countries}
                />
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}
