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
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Collapse,
  Spinner
} from "reactstrap"
import { useSelector } from "react-redux";
import api from "../../../../services/api"
import { ContextLayout } from "../../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  Edit,
  Trash2,
  ChevronDown,
  Clipboard,
  Printer,
  Download,
  RotateCw,
  Filter,
  X
} from "react-feather"
import classnames from "classnames"
import { history } from "../../../../history"
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import { dicalogin } from "../../../../shared/geral"
import { Container, Content  } from "./styles";

export default function UserList() {
  const auth = useSelector(state => state.auth);
  const [gridApi, setgridApi] = useState(null)
  // const [gridColumnApi, setgridColumnApi] = useState(null)
  const [rowData, setrowData] = useState(null)
  const [pageSize, setpageSize] = useState(20)
  const [isVisible, setisVisible] = useState(true)
  const [reload, setreload] = useState(false)
  const [collapse, setcollapse] = useState(false)
  const [agFilter, setagFilter] = useState(false)
  const [status, setstatus] = useState("Opened")
  const [role, setrole] = useState("All")
  const [selectStatus, setselectStatus] = useState("All")
  const [verified, setverified] = useState("All")
  const [department, setdepartment] = useState("0")
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
      checkboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      headerCheckboxSelection: true
    },
    {
      headerName: "Usuário",
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
      headerName: "E-mail",
      field: "email",
      filter: true,
      width: 250
    },
    // {
    //   headerName: "Perfil",
    //   field: "profiles.name",
    //   filter: true,
    //   width: 150
    // },
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
              onClick={() => history.push("/app/user/edit")}
            />
            <Trash2
              size={15}
              onClick={() => {
                let selectedData = gridApi.getSelectedRows()
                gridApi.updateRowData({ remove: selectedData })
              }}
            />
          </div>
        )
      }
    }
  ]

  // useEffect(() => {
  //   async function loadDados() {
  //     const headers = {
  //       licence_id: 1,
  //     };
  //     const response = await api.get("/users", {
  //       headers
  //     });
  //     let rowData = response.data;
  //     setrowData(rowData)

  //   }
  //   loadDados();
  // }, []);
  useEffect(() =>
  {
     async function loadDados() {
      if (auth.login !== undefined) {
        if (auth.login.licence_id !== undefined) {
          const body = {
            licence_id: auth.login.licence_id,
            id: 0
          };
          const response = await api.post("/users.list",
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
      setagFilter(!agFilter, gridApi.refreshHeader())
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
      setrole('All')
      setselectStatus('All')
      setverified('All')
      setdepartment('All')
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
                    <Label for="role">Role</Label>
                    <Input
                      type="select"
                      name="role"
                      id="role"
                      value={role}
                      onChange={e => {
                        setrole(e.target.value,
                          () =>
                            filterData(
                              "role",
                              role.toLowerCase()
                            )
                        )
                      }}
                    >
                      <option value="All">All</option>
                      <option value="User">User</option>
                      <option value="Staff">Staff</option>
                      <option value="Admin">Admin</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col lg="3" md="6" sm="12">
                  <FormGroup className="mb-0">
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
                  </FormGroup>
                </Col>
                <Col lg="3" md="6" sm="12">
                  <FormGroup className="mb-0">
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
                  </FormGroup>
                </Col>
                <Col lg="3" md="6" sm="12">
                  <FormGroup className="mb-0">
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
                  </FormGroup>
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
                  <div className="dropdown actions-dropdown">
                    <UncontrolledButtonDropdown>
                      <DropdownToggle className="px-2 py-75" color="white">
                        Actions
                        <ChevronDown className="ml-50" size={15} />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem tag="a">
                          <Trash2 size={15} />
                          <span className="align-middle ml-50">Delete</span>
                        </DropdownItem>
                        <DropdownItem tag="a">
                          <Clipboard size={15} />
                          <span className="align-middle ml-50">Archive</span>
                        </DropdownItem>
                        <DropdownItem tag="a">
                          <Printer size={15} />
                          <span className="align-middle ml-50">Print</span>
                        </DropdownItem>
                        <DropdownItem tag="a">
                          <Download size={15} />
                          <span className="align-middle ml-50">CSV</span>
                        </DropdownItem>
                        <DropdownItem tag="a" onClick={() => filterGrid()}>
                          <Filter size={15} />
                          <span className="align-middle ml-50">Filtro</span>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledButtonDropdown>
                  </div>
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
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}
