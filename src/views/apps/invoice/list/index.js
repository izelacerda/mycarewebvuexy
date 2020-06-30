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
// import XLSX from "xlsx"
import { saveAs } from 'file-saver'
import { AgGridReact } from "ag-grid-react"
import 'ag-grid-enterprise'
import * as Excel from "exceljs/dist/exceljs.min.js"
// import Select from "react-select"

import {
  Edit,
  Trash2
} from "react-feather"
import { FormattedMessage } from "react-intl"

import api from "../../../../services/api"
import { ContextLayout } from "../../../../utility/context/Layout"

import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import "../../../../assets/scss/especificos/cadastros.scss"

import ToolBar from "../../../../components/especificos/toolbar"
import CadastroData from "../cadastro"
// import "./styles.css"
// import { Content  } from "./styles.js";
import { currencyFormatter, dateFormatter } from "../../../../shared/geral"

export default function InvoiceList(props) {
  const auth = useSelector(state => state.auth);
  let insertPermission = props.userPermission.includes(94+1)
  let deletePermission = props.userPermission.includes(94+3)
  let reportPermission = props.userPermission.includes(94+4)
  let dadosdoCadastroPermission = props.userPermission.includes(94+5)


  const [gridApi, setGridApi] = useState(null)
  const [rowData, setRowData] = useState(null)
  const pageSize = useState(50)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalExport, setShowModalExport] = useState(false)
  const [itemDelete, setItemDelete] = useState(null)
  const [fileName, setFileName] = useState("")
  const [fileFormat, setFileFormat] = useState("xlsx")
  const [sidebar, setSidebar] = useState(false)
  const [id, setId] = useState(0)
  const [data, setData] = useState(null)
  // const [measures, setMeasures] = useState([])
  // const [groups, setGroups] = useState([])
  // const [config, setConfig] = useState(null)
  const [loadedGeral, setLoaded] = useState(false)
  const [loadedDados, setLoadedDados] = useState(false)
  // const [rowSelectTable, setRowSelectTable] = useState(null)
  const [language, setLanguage] = useState('pt-br')
  const [currency, setCurrency] = useState('BRL')
  const [invoicetypes, setInvoiceTypes]  = useState([])
  const [companies, setCompanies]  = useState([])
  const [persons, setPersons]  = useState([])

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
    // {
    //   headerName: "ID",
    //   field: "id",
    //   width: 150,
    //   filter: true,
    // },
    {
      headerName: "Grupo Emp",
      field: "company.companygroup.name",
      filter: true,
      width: 200,

    },
    {
      headerName: "Empresa",
      field: "company.name",
      filter: true,
      width: 200
    },
    {
      headerName: "Fornecedor",
      field: "person.name",
      filter: true,
      width: 200
    },
    {
      headerName: "Tipo",
      field: "invoicetype.name",
      filter: true,
      width: 150
    },
    {
      headerName: "Série",
      field: "series",
      filter: true,
      width: 100
    },
    {
      headerName: "Número",
      field: "number",
      filter: true,
      width: 120,
       cellRendererFramework: params => {
        return (
          <div
            className="d-flex align-items-center cursor-pointer"
            //onClick={() => dadosdoCadastroPermission ? history.push(`/app/profile/cadastro/${params.data.id}`) : null}
            onClick={() => dadosdoCadastroPermission ? handleId(params.data,params.data.id,true)  : null}
          >
            <span>{params.data.number}</span>
          </div>
        )
      }
    },
    {
      headerName: "#",
      field: "sequential",
      filter: true,
      width: 80
    },
    {
      headerName: "Data NF",
      field: "dtDocument",
      filter: true,
      width: 130,
      valueFormatter: dateFormat
    },
    {
      headerName: "Data Rec",
      field: "dtReceived",
      filter: true,
      width: 130,
      valueFormatter: dateFormat
    },
    {
      headerName: "Valor",
      field: "totalValue",
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
              //onClick={() => dadosdoCadastroPermission ? history.push(`/app/profile/cadastro/${params.data.id}`) : null}
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
            licence_id: auth.login.licence_id,
            id: 0,
            active: "all",
            userlog_id: auth.login.values.loggedInUser.id
          };

          let response = await api.post("/invoicetypes.list", {
            ...body
          });
          setInvoiceTypes(response.data)

          response = await api.post("/companies.list", {
            ...body
          });
          setCompanies(response.data)

          response = await api.post("/providers.list", {
            ...body
          });
          setPersons(response.data)
          // if(response.data.table_type==="G") {
          //   body = {
          //     licence_id: auth.login.licence_id,
          //     id: 0,
          //     active: "all",
          //     userlog_id: auth.login.values.loggedInUser.id
          //   };
          //   response = await api.post("/companygroups.list", {
          //     ...body
          //   });
          //   setRowSelectTable(response.data)
          // }
          // if(response.data.table_type==="C") {
          //   body = {
          //     licence_id: auth.login.licence_id,
          //     id: 0,
          //     active: "all",
          //     userlog_id: auth.login.values.loggedInUser.id
          //   };
          //   response = await api.post("/companies.list", {
          //     ...body
          //   });
          //   setRowSelectTable(response.data)
          // }
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
          // body = {
          //   licence_id: auth.login.licence_id,
          //   id: 0,
          //   active: "all",
          //   userlog_id: auth.login.values.loggedInUser.id
          // };
          // response = await api.post("/measurementunits.list", {
          //   ...body
          // });
          // setMeasures(response.data)
          setLoaded(true)

        }
      }
     }
     if(auth !== undefined && !loadedGeral)
      {
        loadDados();
      }
  }, [auth, loadedGeral]);

  useEffect(() =>
  {
     async function loadDados() {
      if (auth.login !== undefined) {
        if (auth.login.licence_id !== undefined) {
          let body = {
            licence_id: auth.login.licence_id,
            id: 0,
            active: 'all',
            userlog_id: auth.login.values.loggedInUser.id
          };
          let response = await api.post("/invoices.list", {
            ...body
          });
          setRowData(response.data)
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
  const onGridReady = params => {
    setGridApi(params.api)
    // setgridColumnApi(params.columnApi)
  }

  const updateSearchQuery = val => {
    gridApi.setQuickFilter(val)
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
    // if(sidebar && rowData) {
    //   let groups = rowData.filter(i => i.is_group) // && (id===0 || i.id !== id))
    //   setGroups(groups)
    // }
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

  async function handleDelete() {
    try {
      if(itemDelete){
        let data = {
          licence_id: auth.login.licence_id,
          id: itemDelete.id,
          userlog_id: auth.login.values.loggedInUser.id
        };
        await api.delete("/invoices",
          { data }
        );
        setItemDelete(null)
        setShowModalDelete(false)
        let rowDataAux = rowData.filter(function(row){ return row.id !== itemDelete.id; })
        setRowData(rowDataAux)
        toast.success("Documento excluído com sucesso!", { transition: Flip });
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
  function toggleModalExport() {
    setShowModalExport(!showModalExport)
  }

  // function handleExport() {
  //   toggleModalExport()
  //   let fileNameArq =
  //     fileName.length && fileFormat.length
  //       ? `${fileName}.${fileFormat}`
  //       : "excel-sheet.xlsx"
  //   let wb = XLSX.utils.json_to_sheet(rowData)
  //   let wbout = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wbout, wb, 'teste')
  //   XLSX.writeFile(wbout, fileNameArq);
  // }
  async function handleExport() {
    toggleModalExport()
    let fileNameArq =
        fileName.length && fileFormat.length
          ? `${fileName}.${fileFormat}`
          : "excel-sheet.xlsx"
    const workbook = new Excel.Workbook();
    workbook.creator = 'Me';
    workbook.lastModifiedBy = 'Her';
    workbook.created = new Date(1985, 8, 30);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2016, 9, 27);
    workbook.calcProperties.fullCalcOnLoad = true;

    const worksheet =  workbook.addWorksheet('sheet', {
      pageSetup:{paperSize: 9, orientation:'landscape'}
    });
    worksheet.pageSetup.margins = {
      left: 0.7, right: 0.7,
      top: 0.75, bottom: 0.75,
      header: 0.3, footer: 0.3
    };
    worksheet.pageSetup.printArea = 'A1:G20';
    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 32 },
      { header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1 }
    ];
    // const idCol = worksheet.getColumn('id');
    // const nameCol = worksheet.getColumn('B');
    const dobCol = worksheet.getColumn(3);

    // set column properties

    // Note: will overwrite cell value C1
    dobCol.header = 'Date of Birth';

    // Note: this will overwrite cell values C1:C2
    dobCol.header = ['Date of Birth', 'A.K.A. D.O.B.'];

    // from this point on, this column will be indexed by 'dob' and not 'DOB'
    dobCol.key = 'dob';

    dobCol.width = 15;

    // Hide the column if you'd like
    dobCol.hidden = true;

    // set an outline level for columns
    worksheet.getColumn(4).outlineLevel = 0;
    worksheet.getColumn(5).outlineLevel = 1;
    worksheet.getColumn(6).values = [1,2,3,4,5];
    worksheet.addRow({id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
    worksheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)});
    const row = worksheet.lastRow;

    // Set a specific row height
    row.height = 42.5;
    row.values = {
      id: 13,
      name: 'Thing 1',
      dob: new Date()
    };
    worksheet.getCell('A1').numFmt = '0.00%';

    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 32, style: { font: { name: 'Arial Black' } } },
      { header: 'D.O.B.', key: 'DOB', width: 10, style: { numFmt: 'dd/mm/yyyy' } }
    ];

    // Set Column 3 to Currency Format
    // worksheet.getColumn(3).numFmt = '"£"#,##0.00;[Red]\-"£"#,##0.00';

    // Set Row 2 to Comic Sans.
    worksheet.getRow(2).font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
    // await workbook.writeFile(fileNameArq);
    const buf = await workbook.xlsx.writeBuffer()

    saveAs(new Blob([buf]), fileNameArq)

  }

  return (
  <>

    <Row>
      <Col sm="12">
        <Card>
          <CardBody>
           <div className="app-cadastros position-relative">
              <div
                className={`app-content-overlay ${sidebar ? "show" : "hidden"}`}
                onClick={() => {
                  handleSidebar(false)
                }}
              ></div>
                <Col sm="12">
                  <Card>
                    <CardBody>
                      <div className="ag-theme-alpine ag-grid-table" >
                        <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                          <div className="sort-dropdown">
                            <h3 className="primary">
                              <FormattedMessage id="Invoice Providers"/>
                            </h3>
                          </div>

                          <div className="d-flex justify-content-end">
                          {/* { rowSelectTable && config && config.table_type !== "L"
                                ?
                                  <Content>
                                    <Select
                                      getOptionLabel={option => option.name}
                                      getOptionValue={option => option.id}
                                      className="React"
                                      classNamePrefix="select"
                                      isSearchable={true}
                                      name="rowSelectTable"
                                      options={rowSelectTable}
                                      value={rowSelectTable.filter(option => option.id === config.table_number)}
                                      onChange={e => handleChangeSelect("rowSelectTable", e)}
                                      // isDisabled={!salvarPermission}
                                      />
                                  </Content>
                                : null } */}

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
                              Confirma a exclusão do Documento? <br></br><br></br>
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
                <CadastroData
                  sidebar={sidebar}
                  handleSidebar={handleSidebar}
                  handleUpdate={handleUpdate}
                  handleAdd={handleAdd}
                  id={id}
                  userPermission={props.userPermission}
                  data={data}
                  invoicetypes={invoicetypes}
                  companies={companies}
                  persons={persons}
                />
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </>
  )
}
