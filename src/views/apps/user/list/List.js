import React, { useState, useEffect } from "react"
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  FormGroup,
  Label,
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
  Collapse,
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
  Trash2,
  ChevronDown,
  RotateCw,
  X
} from "react-feather"
import classnames from "classnames"
import Select from "react-select"

import { history } from "../../../../history"
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import { dicalogin } from "../../../../shared/geral"
import { Container, Content  } from "./styles";
import ToolBar from "../../../../components/especificos/toolbar"

export default function UserList() {
  const auth = useSelector(state => state.auth);
  const [gridApi, setgridApi] = useState(null)
  const [rowData, setrowData] = useState(null)
  const [pageSize, setpageSize] = useState(20)
  const [isVisible, setisVisible] = useState(true)
  const [reload, setreload] = useState(false)
  const [collapse, setcollapse] = useState(false)
  const [agFilter, setagFilter] = useState(false)
  const [status, setstatus] = useState("Opened")
  const [profile, setProfile] = useState(0)
  const [profiles, setProfiles] = useState([])
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalExport, setShowModalExport] = useState(false)
  const [userDelete, setUserDelete] = useState(null)
  const [fileName, setFileName] = useState("")
  const [fileFormat, setFileFormat] = useState("xlsx")
  const toolBarList = [
    {
      id: 'toolbar1',
      color: 'primary',
      buttomClassName: "border-primary text-success",
      icon: 'PlusCircle',
      size: 21,
      label: null,
      outline: false,
      tooltip: 'Incluir',
      action: () => history.push(`/app/user/cadastro/0`)
    },
    {
      id: 'toolbar2',
      color: 'primary',
      buttomClassName: "border-primary text-success",
      icon: 'Download',
      size: 21,
      label: null,
      outline: false,
      tooltip: 'Exportar',
      action: () => toggleModalExport()
    },
    {
      id: 'toolbar3',
      color: 'primary',
      buttomClassName: "border-primary text-success",
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
            onClick={() => history.push(`/app/user/cadastro/${params.data.id}`)}
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
      headerName: "Login",
      field: "login",
      filter: true,
      width: 250
    },
    {
      headerName: "E-mail",
      field: "email",
      filter: true,
      width: 250
    },
    // {
    //   headerName: "Ativo",
    //   field: "is_active",
    //   filter: true,
    //   width: 150
    // },
    {
      headerName: "Ativo",
      field: "is_active",
      filter: true,
      width: 120,
      cellRendererFramework: params => {
        return params.value === true ? (
          <div className="badge badge-pill badge-light-success">
            Sim
          </div>
          // <div className="bullet bullet-sm bullet-primary"></div>
        ) : params.value === false ? (
          // <div className="bullet bullet-sm bullet-secondary"></div>
          <div className="badge badge-pill badge-light-danger">
            Não
          </div>
        ) : null
      }
    },
    {
      headerName: "Perfil",
      field: "pivot.profile_id",
      filter: true,
      width: 280,
      cellRendererFramework: params => {
        return params.value !== null ? (
          getProfile(params.value)
          // <div className="bullet bullet-sm bullet-primary"></div>
        )
         : null
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
              onClick={() => history.push(`/app/user/cadastro/${params.data.id}`)}
            />
            <Trash2
              size={15}
              onClick={() =>
                {
                  toggleModalDelete(params.data,true)
                }

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
            id: 0
          };
          let response = await api.post("/profiles.list", {
            ...body
          });
          setProfiles(response.data)

          response = await api.post("/users.list",
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

  const filterData = (column, val) => {
    var filter = gridApi.getFilterInstance(column)
    var modelObj = null
    if (val !== "all") {
      modelObj = {
        type: "equals",
        filter: val
      }
    }
    filter.setModel(modelObj)
    gridApi.onFilterChanged()
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
      setreload(true)
      setTimeout(() => {
        setreload(false)
      }, 500)
      gridApi.refreshHeader()
    }
  }
  const updateSearchQuery = val => {
    gridApi.setQuickFilter(val)
    setsearchVal(val)
  }

  const refreshCard = () => {
    setreload(true)
    setTimeout(() => {
      setreload(false)
      setProfile(0)
    }, 500)
  }

  const toggleCollapse = () => {
    setcollapse(!collapse)
  }
  const onEntering = () => {
    setstatus("Opening...")
  }

  const onEntered = () => {
    setstatus("Opened")
  }
  const onExiting = () => {
    setstatus("Closing...")
  }
  const onExited = () => {
    setstatus("Closed")
  }
  const removeCard = () => {
    setisVisible(false)
  }
  function getProfile(id) {
    const profile = profiles.find(e => e.id === id)
    if(profile !== undefined) {
      return profile.name
    }
    return null
  }
  function handleFilter(id, value) {
    setProfile(value)
    filterData(id, value)
  }
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
        await api.delete("/users",
          { data }
        );
        setUserDelete(null)
        setShowModalDelete(false)
        let rowDataAux = rowData.filter(function(row){ return row.id !== userDelete.id; })
        setrowData(rowDataAux)
        toast.success("Usuário excluído com sucesso!", { transition: Flip });
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
            toast.error(`Erro ao Excluir o usuário! ${error.message}`, { transition: Flip });
          }
        }
      }
      else {
        toast.error(`Erro ao Excluir o usuário! ${error.message}`, { transition: Flip });
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
        <Card
          className={classnames("card-action card-reload", {
            "d-none": isVisible === false,
            "card-collapsed": status === "Closed",
            closing: status === "Closing...",
            opening: status === "Opening...",
            refreshing: reload
          })}
        >
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <div className="actions">
              <ChevronDown
                className="collapse-icon mr-50"
                size={15}
                onClick={toggleCollapse}
              />
              <RotateCw
                className="mr-50"
                size={15}
                onClick={() => {
                  refreshCard()
                  gridApi.setFilterModel(null)
                }}
              />
              <X size={15} onClick={removeCard} />
            </div>
          </CardHeader>
          <Collapse
            isOpen={collapse}
            onExited={onExited}
            onEntered={onEntered}
            onExiting={onExiting}
            onEntering={onEntering}
          >
            <CardBody>
              {reload ? (
                <Spinner color="primary" className="reload-spinner" />
              ) : (
                ""
              )}
              <Row>
                <Col lg="3" md="6" sm="12">
                  <FormGroup className="mb-0">
                    <Label for="role">Perfil</Label>
                    {/* <Input
                      type="select"
                      name="pivot.profile_id"
                      id="role"
                      value={role}
                      onChange={e => {
                        setrole(e.target.value,
                          () =>
                            filterData(
                              "pivot.profile_id",
                              role.toLowerCase()
                            )
                        )
                      }}
                    >
                      <option value="All">All</option>
                      <option value="User">User</option>
                      <option value="Staff">Staff</option>
                      <option value="Admin">Admin</option>
                    </Input> */}
                    <Select
                      getOptionLabel={option => option.name}
                      getOptionValue={option => option.id}
                      className="React"
                      classNamePrefix="select"
                      // isSearchable={false}
                      name="pivot.profile_id"
                      options={profiles}
                      value={profiles.filter(option => option.id === profile)}
                      onChange={e => handleFilter("pivot.profile_id",e.id)}
                    />
                  </FormGroup>
                </Col>
                <Col lg="3" md="6" sm="12">
                  {/* <FormGroup className="mb-0">
                    <Label for="status">Status</Label>
                    <Input
                      type="select"
                      name="status"
                      id="status"
                      value={selectStatus}
                      onChange={e => {
                        setstatus(e.target.value,
                          () =>
                            filterData(
                              "status",
                              selectStatus.toLowerCase()
                            )
                          )
                      }}
                    >
                      <option value="All">All</option>
                      <option value="Active">Active</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Deactivated">Deactivated</option>
                    </Input>
                  </FormGroup> */}
                </Col>
                <Col lg="3" md="6" sm="12">
                  {/* <FormGroup className="mb-0">
                    <Label for="verified">Verified</Label>
                    <Input
                      type="select"
                      name="verified"
                      id="verified"
                      value={verified}
                      onChange={e => {
                        setverified(e.target.value,
                          () =>
                            filterData(
                              "is_verified",
                              verified.toLowerCase()
                            )
                          )
                      }}
                    >
                      <option value="All">All</option>
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </Input>
                  </FormGroup> */}
                </Col>
                <Col lg="3" md="6" sm="12">
                  {/* <FormGroup className="mb-0">
                    <Label for="department">Department</Label>
                    <Input
                      type="select"
                      name="department"
                      id="department"
                      value={department}
                      onChange={e => {
                        setstatus(e.target.value,
                          () =>
                            filterData(
                              "department",
                              department.toLowerCase()
                            )
                          )
                      }}
                    >
                      <option value="All">All</option>
                      <option value="Sales">Sales</option>
                      <option value="Development">Development</option>
                      <option value="Management">Management</option>
                    </Input>
                  </FormGroup> */}
                </Col>
              </Row>
            </CardBody>
          </Collapse>
        </Card>
      </Col>
      <Col sm="12">
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
              ) : null}
              <Modal
                  isOpen={showModalDelete}
                  toggle={() => toggleModalDelete(null,false)}
                  className="modal-dialog-centered"
                >
                  <ModalHeader toggle={() => toggleModalDelete(null,false)} className="bg-warning">
                    Exclusão
                  </ModalHeader>
                  <ModalBody>
                    Confirma a exclusão do Usuário? <br></br><br></br>
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
                  <ModalHeader toggle={() => toggleModalExport()}>Exportar para Excel</ModalHeader>
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
