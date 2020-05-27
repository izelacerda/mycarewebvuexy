import React, { useState, useEffect } from "react"
import {
  Card,
  CardBody,
  FormGroup,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
  Spinner,
  CustomInput
} from "reactstrap"
import { useSelector } from "react-redux";
import { toast, Flip } from "react-toastify"
import XLSX from "xlsx"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import api from "../../../../services/api"
import { ContextLayout } from "../../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  Edit,
  Trash2,
  ChevronDown,
} from "react-feather"

import { history } from "../../../../history"
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"

import { dicalogin } from "../../../../shared/geral"
import { Container, Content  } from "./styles";
import ToolBar from "../../../../components/especificos/toolbar"

export default function CustomerList(props) {
  const auth = useSelector(state => state.auth);
  let insertPermission = props.userPermission.includes(32)
  let deletePermission = props.userPermission.includes(34)
  let reportPermission = props.userPermission.includes(35)
  let dadosdoCadastroPermission = props.userPermission.includes(36)

  const [gridApi, setgridApi] = useState(null)
  const [rowData, setrowData] = useState(null)
  const [pageSize, setpageSize] = useState(20)
  const [agFilter, setagFilter] = useState(false)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalExport, setShowModalExport] = useState(false)
  const [userDelete, setUserDelete] = useState(null)
  const [fileName, setFileName] = useState("")
  const [fileFormat, setFileFormat] = useState("xlsx")
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
      action: () => history.push(`/app/customer/cadastro/0`)
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
    },
    {
      id: 'toolbar3',
      color: 'primary',
      buttomClassName: "btn-icon",
      icon: 'Filter',
      size: 21,
      label: null,
      outline: false,
      tooltip: 'Filtrar',
      action: () => filterGrid()
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
      field: "username",
      filter: true,
      width: 250,
      cellRendererFramework: params => {
        return (
          <div
            className="d-flex align-items-center cursor-pointer"
            onClick={() => dadosdoCadastroPermission ? history.push(`/app/customer/cadastro/${params.data.id}`) : null}
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
                  <span className="nome">{dicalogin(params.data.username)}</span>
                </Content>
              </Container>
            )}
            <span>{params.data.username}</span>
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
          // <div className="bullet bullet-sm bullet-primary"></div>
        ) : params.value === false ? (
          // <div className="bullet bullet-sm bullet-secondary"></div>
          <div className="badge badge-pill badge-light-danger">
            Inativo
          </div>
        ) : null
      }
    },
    // {
    //   headerName: "Status",
    //   field: "status.name",
    //   filter: true,
    //   width: 150,
    //   cellRendererFramework: params => {
    //     return params.value === "active" ? (
    //       <div className="badge badge-pill badge-light-success">
    //         {params.value}
    //       </div>
    //     ) : params.value === "blocked" ? (
    //       <div className="badge badge-pill badge-light-danger">
    //         {params.value}
    //       </div>
    //     ) : params.value === "deactivated" ? (
    //       <div className="badge badge-pill badge-light-warning">
    //         {params.value}
    //       </div>
    //     ) : null
    //   }
    // },
    // {
    //   headerName: "Verificado",
    //   field: "is_verified",
    //   filter: true,
    //   width: 180,
    //   cellRendererFramework: params => {
    //     return params.value === true ? (
    //       <div className="bullet bullet-sm bullet-primary"></div>
    //     ) : params.value === false ? (
    //       <div className="bullet bullet-sm bullet-secondary"></div>
    //     ) : null
    //   }
    // },
    // {
    //   headerName: "Departamento",
    //   field: "departments.name",
    //   filter: true,
    //   width: 180
    // },
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
              onClick={() => dadosdoCadastroPermission ? history.push(`/app/customer/cadastro/${params.data.id}`) : null}
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
            licence_id: auth.login.licence_id,
            id: 0,
            active: "all"
          };
          let response = null
          response = await api.post("/customers.list",
            body
          );
          let rowData = response.data;
          setrowData(rowData)
        }
      }
     }
     if(auth !== undefined)
      {
        loadDados();
      }
  }, [auth]);

  const onGridReady = params => {
    setgridApi(params.api)
    // setgridColumnApi(params.columnApi)
  }

  const filterSize = val => {
    if (gridApi) {
      gridApi.paginationSetPageSize(Number(val))
      setpageSize(val)
    }
  }

  const filterGrid = () => {
    if (gridApi) {
      setagFilter(!agFilter)
      setTimeout(() => {
      }, 500)
      gridApi.refreshHeader()
    }
  }
  const updateSearchQuery = val => {
    gridApi.setQuickFilter(val)
    setsearchVal(val)
  }

  // const refreshCard = () => {
  //   setreload(true)
  //   setTimeout(() => {
  //     setreload(false)
  //   }, 500)
  // }

  // const toggleCollapse = () => {
  //   setcollapse(!collapse)
  // }
  // const onEntering = () => {
  //   setstatus("Opening...")
  // }

  // const onEntered = () => {
  //   setstatus("Opened")
  // }
  // const onExiting = () => {
  //   setstatus("Closing...")
  // }
  // const onExited = () => {
  //   setstatus("Closed")
  // }
  // const removeCard = () => {
  //   setisVisible(false)
  // }
  // function handleFilter(id, value) {
  //   filterData(id, value)
  // }
  function toggleModalDelete(userDelete, status) {
    setUserDelete(userDelete)
    setShowModalDelete(status)
  }

  async function handleDelete() {
    try {
      if(userDelete){
        let data = {
          user: {
            licence_id: auth.login.licence_id,
            id: userDelete.id,
            login: userDelete.login
          }
        };
        await api.delete("/customers",
          { data }
        );
        setUserDelete(null)
        setShowModalDelete(false)
        let rowDataAux = rowData.filter(function(row){ return row.id !== userDelete.id; })
        setrowData(rowDataAux)
        toast.success("Paciente excluído com sucesso!", { transition: Flip });
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
            toast.error(`Erro ao Excluir o paciente! ${error.message}`, { transition: Flip });
          }
        }
      }
      else {
        toast.error(`Erro ao Excluir o paciente! ${error.message}`, { transition: Flip });
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
    <Row className="app-user-list">
      <Col sm="12">
        <Breadcrumbs
          breadCrumbTitle="Pacientes"
          breadCrumbParent="Cadastros"
          breadCrumbActive="Pacientes"
        />
        <Card>
          <CardBody>
            <div className="ag-theme-material ag-grid-table">
              <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                <div className="sort-dropdown">
                  <UncontrolledDropdown className="ag-dropdown p-1">
                    <DropdownToggle tag="div">
                      1 - {pageSize} of 150
                      <ChevronDown className="ml-50" size={15} />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem
                        tag="div"
                        onClick={() => filterSize(20)}
                      >
                        20
                      </DropdownItem>
                      <DropdownItem
                        tag="div"
                        onClick={() => filterSize(50)}
                      >
                        50
                      </DropdownItem>
                      <DropdownItem
                        tag="div"
                        onClick={() => filterSize(100)}
                      >
                        100
                      </DropdownItem>
                      <DropdownItem
                        tag="div"
                        onClick={() => filterSize(150)}
                      >
                        150
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
                <div className="filter-actions d-flex">
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
                      floatingFilter={agFilter}
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
                  <ModalHeader toggle={() => toggleModalDelete(null,false)} className="bg-warning">
                    Exclusão
                  </ModalHeader>
                  <ModalBody>
                    Confirma a exclusão do Paciente? <br></br><br></br>
                    <span className="text-center">
                      {userDelete ? userDelete.username : null}
                    </span>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="warning" onClick={() => handleDelete()}>
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
    </Row>
  )
}
