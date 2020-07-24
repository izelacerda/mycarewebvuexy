import React, { useState, useEffect } from "react"
import {
  Input,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner
} from "reactstrap"
import { useSelector } from "react-redux";
import { toast, Flip } from "react-toastify"
// import XLSX from "xlsx"
import { AgGridReact } from "ag-grid-react"
import 'ag-grid-enterprise'

import {
  Edit,
  Trash2,
  PlusCircle
} from "react-feather"

import { ContextLayout } from "../../../../utility/context/Layout"

import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import "../../../../assets/scss/especificos/cadastros.scss"

import ToolBar from "../../../../components/especificos/toolbar"
import InvoiceFinancialCadastro from "./invoiceFinancialCadastro"
// import "./styles.css"
// import { Content  } from "./styles.js";
import { currencyFormatter, dateFormatter } from "../../../../shared/geral"

export default function InvoiceFinancialList(props) {
  const auth = useSelector(state => state.auth);
  let insertPermission = props.permission.insert
  let deletePermission = props.permission.delete
  let dadosdoCadastroPermission = props.permission.dadosdoCadastro

  // let [gridApi, setGridApi] = useState(null)
  let pageSize = useState(5)
  let [showModalDelete, setShowModalDelete] = useState(false)
  let [itemDelete, setItemDelete] = useState(null)
  let [sidebar, setSidebar] = useState(false)
  let [id, setId] = useState(0)
  let [data, setData] = useState(null)
  // const [measures, setMeasures] = useState([])
  // const [groups, setGroups] = useState([])
  // const [config, setConfig] = useState(null)
  let [loadedGeral, setLoaded] = useState(false)
  let [loadedDados, setLoadedDados] = useState(false)
  // const [rowSelectTable, setRowSelectTable] = useState(null)
  let [language, setLanguage] = useState('pt-br')
  let [currency, setCurrency] = useState('BRL')
  let toolBarList = [
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
    }
  ]

  const defaultColDef  = useState({
     sortable: true
  })
  const [searchVal, setsearchVal] = useState("")
  const columnDefs = [
    {
      headerName: "Vencimento",
      field: "dueDate",
      filter: true,
      width: 150,
      valueFormatter: dateFormat
    },
    {
      headerName: "Valor",
      field: "value",
      filter: true,
      width: 150,
      valueFormatter: currencyFormat
    },
    {
      headerName: "Saldo",
      field: "balance",
      filter: true,
      width: 150,
      valueFormatter: currencyFormat
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
              className="mr-50"
              size={15}
              disabled={!deletePermission}
              onClick={() =>
                  deletePermission ? toggleModalDelete(params.data,true) : null
              }
            />
            <PlusCircle
              size={15}
              disabled={!insertPermission}
              onClick={() =>
                insertPermission ? handleId(null,0,true) : null
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

          let lang =  localStorage.getItem("language")
          if(lang) {
            if(lang==='pt') {
              setLanguage('pt-br')
              setCurrency('BRL')
            }
            else {
              setLanguage('us')
              setCurrency('USD')
            }
          }

          setLoaded(true)

        }
      }
     }
     if(auth !== undefined && !loadedGeral)
      {
        loadDados();
      }
  }, [auth, loadedGeral ]);

  useEffect(() =>
  {
     async function loadDados() {
      if (auth.login !== undefined) {
        if (auth.login.licence_id !== undefined) {
          setLoadedDados(true)

        }
      }
     }
     if(loadedGeral && !loadedDados)
      {
        loadDados();
      }
  }, [loadedGeral, loadedDados]) // eslint-disable-line

  function currencyFormat(params) {
    return currencyFormatter(params.value,language,currency,2)
  }
  function dateFormat(params) {
    return dateFormatter(params.value,language)
  }
  // function handleChangeSelect(select, value) {
  //   if(select==="rowSelectTable") {
  //     let configatu = config
  //     configatu.table_number = value.id
  //     setConfig(configatu)
  //     setLoadedDados(false)
  //   }
  // }
  // const onGridReady = params => {
  //   setGridApi(params.api)
  //   // setgridColumnApi(params.columnApi)
  // }

  const updateSearchQuery = val => {
    // gridApi.setQuickFilter(val)
    setsearchVal(val)
  }


  function toggleModalDelete(itemDelete, status) {
    setItemDelete(itemDelete)
    setShowModalDelete(status)
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
    props.handleAdd(data)
  }

  async function handleUpdate(data) {
    props.handleUpdate(data)
  }

  async function handleDelete() {
    try {
      if(itemDelete){
        props.handleDelete(itemDelete)
        setItemDelete(null)
        setShowModalDelete(false)
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
            toast.error(`Erro ao Excluir o Documento! ${error.message}`, { transition: Flip });
          }
        }
      }
      else {
        toast.error(`Erro ao Excluir o Documento! ${error.message}`, { transition: Flip });
      }
      setShowModalDelete(false)

    }

  }

  return (
  <>

    <Row>
      <Col sm="12">
           <div className="app-cadastros position-relative">
              <div
                className={`app-content-overlay ${sidebar ? "show" : "hidden"}`}
                onClick={() => {
                  handleSidebar(false)
                }}
              ></div>
                <Col sm="12">
                      <div className="ag-theme-balham ag-grid-table" >
                        <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                          <div className="sort-dropdown">
                          </div>
                          <div className="d-flex justify-content-end">
                            <Input
                              className="w-50 ml-1 mr-1 mb-1 mb-sm-0"
                              type="text"
                              placeholder="search..."
                              onChange={e => updateSearchQuery(e.target.value)}
                              value={searchVal}
                            />
                          <ToolBar toolBarList={toolBarList} typeBar="1"/>
                          </div>
                        </div>
                        {loadedDados ? (
                              <ContextLayout.Consumer>
                                {context => (
                                  <div
                                    id="myGrid"
                                    style={{
                                      height: '70%',
                                      width: '100%',
                                    }}
                                    className="ag-theme-balham"
                                  >
                                    <AgGridReact
                                        gridOptions={{}}
                                        rowSelection="multiple"
                                        defaultColDef={defaultColDef}
                                        columnDefs={columnDefs}
                                        rowData={props.rowData}
                                        // onGridReady={onGridReady}
                                        colResizeDefault={"shift"}
                                        animateRows={true}
                                        floatingFilter={false}
                                        pagination={true}
                                        pivotPanelShow="always"
                                        paginationPageSize={pageSize}
                                        resizable={true}
                                        domLayout={"normal"}
                                        enableRtl={context.state.direction === "rtl"}
                                    />
                                  </div>
                                )}
                              </ContextLayout.Consumer>
                            )
                          :
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
                              Confirma a exclusão do Vencimento? <br></br><br></br>
                              <span className="text-center">
                                {itemDelete ? itemDelete.dueDate : null}
                              </span>
                            </ModalBody>
                            <ModalFooter>
                              <Button color="danger" onClick={() => handleDelete()}>
                                Confirmar
                              </Button>{" "}
                            </ModalFooter>
                        </Modal>
                      </div>
                </Col>
                <InvoiceFinancialCadastro
                  sidebar={sidebar}
                  handleSidebar={handleSidebar}
                  handleUpdate={handleUpdate}
                  handleAdd={handleAdd}
                  id={id}
                  data={data}
                />
            </div>
      </Col>
    </Row>
  </>
  )
}
