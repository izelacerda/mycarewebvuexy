import React, { useState, useEffect } from "react"
import {
  Card,
  CardBody,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormGroup,
  Spinner,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  CustomInput
} from "reactstrap"
import { useSelector } from "react-redux";
import XLSX from "xlsx"

import { ContextLayout } from "../../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  ChevronDown
} from "react-feather"
import { toast, Flip } from "react-toastify"

import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"

import "ag-grid-community/dist/styles/ag-theme-balham.css";
// import "../../../../assets/scss/pages/permissions.scss"
import "../../../../assets/scss/pages/users.scss"

import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import api from "../../../../services/api"
import ToolBar from "../../../../components/especificos/toolbar"

export default function UserPermission(props) {
  let updatePermission = props.userPermission.includes(14)
  let reportPermission = props.userPermission.includes(15)

  const [gridApi, setgridApi] = useState(null)
  const [rowData, setrowData] = useState(null)
  const [pageSize, setpageSize] = useState(20)
  const [showModalExport, setShowModalExport] = useState(false)
  const [fileName, setFileName] = useState("")
  const [fileFormat, setFileFormat] = useState("xlsx")

  const toolBarList = [
    {
      id: 'toolbar1',
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
      id: 'toolbar2',
      color: 'primary',
      buttomClassName: "btn-icon text-primary",
      icon: 'ThumbsUp',
      size: 21,
      label: null,
      outline: true,
      tooltip: null,
      disabled: !updatePermission,
      action: () => handleSaveSelect(true)
    },
    {
      id: 'toolbar3',
      color: 'primary',
      buttomClassName: "btn-icon text-danger",
      icon: 'ThumbsDown',
      size: 21,
      label: null,
      outline: true,
      tooltip: null,
      disabled: !updatePermission,
      action: () => handleSaveSelect(false)
    }
  ]
  const defaultColDef  = useState({
    sortable: true
 })
 const [searchVal, setsearchVal] = useState("")
 const columnDefs = [
   {
    headerName: "Usuário",
    field: "users_username",
    filter: true,
    width: 250,
    cellRendererFramework: params => {
      return (
        <span>
          {params.value}
        </span>
      )
    }
   },
   {
    headerName: "Modulo",
    field: "modules_name",
    filter: true,
    width: 250
   },
   {
    headerName: "Rotina",
    field: "routines_name",
    filter: true,
    width: 250
  },
   {
     headerName: "Funcionalidade",
     field: "functionalities_name",
     filter: true,
     width: 250
   },
   {
     headerName: "Permissão",
     field: "is_permission",
     filter: true,
     width: 120,
     cellRendererFramework: params => {
       return params.value === true ? (
         <div className="badge badge-pill badge-light-success"  onClick={() =>
          updatePermission ? handleSavePermission(params,false) : null
          }>
           Sim
         </div>
       ) : params.value === false ||  params.value === null ? (
         <div className="badge badge-pill badge-light-danger" onClick={() =>
          updatePermission ? handleSavePermission(params,true) : null
          }>
           Não
         </div>
       ) : null
     },
     headerCheckboxSelection: true,
     headerCheckboxSelectionFilteredOnly: true,
     checkboxSelection: true,
   }
 ]

  // const dispatch = useDispatch()

  const auth = useSelector(state => state.auth);

  useEffect(() =>
  {
     async function loadDados() {
      if (auth.login !== undefined) {
        if (auth.login.licence_id !== undefined) {
          let body = {
            application_id: 1,
            licence_id: auth.login.licence_id,
            id: 0,
            userlog_id: auth.login.values.loggedInUser.id
          };
          // let response = await api.post("/profiles.list", {
          //   ...body
          // });
          // setProfiles(response.data)

          let response = await api.post("/userpermission.list",
            body
          );
          let rowData = response.data;
          setrowData(rowData)
          // setLoad(false)
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
  }

  const filterSize = val => {
    if (gridApi) {
      gridApi.paginationSetPageSize(Number(val))
      setpageSize(val)
    }
  }

  const updateSearchQuery = val => {
    gridApi.setQuickFilter(val)
    setsearchVal(val)
  }

  async function handleSaveSelect(param) {
    let selecionados = []
    gridApi.getSelectedRows().forEach(element => {
      selecionados.push(
        {
          licence_id: auth.login.licence_id,
          user_id: element.users_id,
          functionality_id: element.functionalities_id,
          is_permission: param
        }
      )
    })
    try {
      let data =
      {
        permissions: selecionados
      }
      await handleSave(data)
      gridApi.getSelectedNodes().forEach(function(node) {
        node.setDataValue('is_permission', param);
        node.setSelected(false)
      })

    } catch (error) {
    }
  }

  async function handleSavePermission(param, value) {
    try {
      let data =
      {
        permissions: [
          {
            licence_id: auth.login.licence_id,
            user_id: param.data.users_id,
            functionality_id: param.data.functionalities_id,
            is_permission: value
          }
        ]
      }
      await handleSave(data)
      param.setValue(value)
    } catch (error) {
    }
  }
  async function handleSave(dados) {
    try {
      dados.licence_id = auth.login.licence_id
      dados.userlog_id=  auth.login.values.loggedInUser.id

      await api.put(`/userpermission`, dados);

    } catch (error) {
      if (typeof error.response !== 'undefined')
      {
        if(typeof error.response.status !== 'undefined' && (error.response.status === 401 || error.response.status === 400   ))
        {
          if(error.response.data.message !== undefined) {
            toast.error(error.response.data.message, { transition: Flip });
          }
          else{
            toast.error(`Erro ao alterar permissão! ${error.message}`, { transition: Flip });
          }
        }
      }
      else {
        toast.error(`Erro ao alterar permissão! ${error.message}`, { transition: Flip });
      }
    }
  }
  function toggleModalExport() {
    setShowModalExport(!showModalExport)
  }

  function handleExport() {
    toggleModalExport()
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
        <Card>
          <CardBody>
            <div className="ag-theme-balham ag-grid-table">
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
                      // rowHeight={30}
                      // floatingFilter={true}
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
