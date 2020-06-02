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

import api from "../../../../../services/api"
import { ContextLayout } from "../../../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  Edit,
  Trash2
} from "react-feather"

import "../../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../../assets/scss/pages/users.scss"

import ToolBar from "../../../../../components/especificos/toolbar"


export default function CalendarList(props) {
  const auth = useSelector(state => state.auth);
  let insertPermission = props.userPermission ?  props.userPermission.includes(38) : false
  let deletePermission = props.userPermission ?  props.userPermission.includes(40) : false
  let reportPermission = props.userPermission ?  props.userPermission.includes(41) : false
  let dadosdoCadastroPermission =  props.userPermission ?  props.userPermission.includes(42) : false

  const [rowData, setrowData] = useState(null)
  const pageSize = useState(150)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalExport, setShowModalExport] = useState(false)
  const [itemDelete, setItemDelete] = useState(null)
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
      action: () =>  props.handleChangeScreen(2,0)
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
  const columnDefs = [

    {
      headerName: "Tipos",
      field: "name",
      filter: true,
      width: 120,
      cellRendererFramework: params => {
        return (
          <div
            className="d-flex align-items-center cursor-pointer"
            onClick={() => dadosdoCadastroPermission ?  props.handleChangeScreen(2, params.data.id) : null}
          >
            <span>{params.data.name}</span>
          </div>
        )
      }
    },
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
      headerName: "Ações",
      field: "transactions",
      width: 100,
      cellRendererFramework: params => {
        return (
          <div className="actions cursor-pointer">
            <Edit
              className="mr-50"
              size={15}
              onClick={() => dadosdoCadastroPermission ? props.handleChangeScreen(2,params.data.id) : null}
            />
            {/* history.push(`/app/calendar/cadastro/${params.data.id}`) */}
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
            active: 'all'
          };
          let response = await api.post("/calendars.list", {
            ...body
          });
          setrowData(response.data)
        }
      }
     }
     if(auth !== undefined)
      {
        loadDados();
      }
  }, [auth]);

  const onGridReady = params => {
    // setgridApi(params.api)
    // setgridColumnApi(params.columnApi)
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
        };
        await api.delete("/calendars",
          { data }
        );
        setItemDelete(null)
        setShowModalDelete(false)
        let rowDataAux = rowData.filter(function(row){ return row.id !== itemDelete.id; })
        setrowData(rowDataAux)
        toast.success("Tipo de Agenda excluído com sucesso!", { transition: Flip });
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
            toast.error(`Erro ao Excluir o Tipo de Agenda! ${error.message}`, { transition: Flip });
          }
        }
      }
      else {
        toast.error(`Erro ao Excluir o Tipo de Agenda! ${error.message}`, { transition: Flip });
      }
      setShowModalDelete(false)

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
  <>
    <Row className="app-user-list">
      <Col sm="12">
        <Card>
          <CardBody>
            <div className="ag-theme-material ag-grid-table">
              <div className="ag-grid-actions d-flex justify-content-end flex-wrap mb-1">
                <div className="sort-dropdown">
                  {/* <UncontrolledDropdown className="ag-dropdown p-1">
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
                  /> */}
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
                      suppressPaginationPanel={true}
                      pagination={false}
                      // pivotPanelShow="always"
                      paginationPageSize={pageSize}
                      // resizable={true}

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
                    Confirma a exclusão do Tipo de Agenda? <br></br><br></br>
                    <span className="text-center">
                      {itemDelete ? itemDelete.name : null}
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
  </>
  )
}
