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

import {
  Edit,
  Trash2
} from "react-feather"

import api from "../../../../services/api"
// import { ContextLayout } from "../../../../utility/context/Layout"

import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import "../../../../assets/scss/especificos/cadastros.scss"

import ToolBar from "../../../../components/especificos/toolbar"
import CadastroData from "../cadastro"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import "./styles.css"

export default function MaterialList(props) {
  const auth = useSelector(state => state.auth);
  let insertPermission = props.userPermission.includes(61+1)
  let deletePermission = props.userPermission.includes(61+3)
  let reportPermission = props.userPermission.includes(61+4)
  let dadosdoCadastroPermission = props.userPermission.includes(61+5)

  const [gridApi, setGridApi] = useState(null)
  const [rowData, setRowData] = useState(null)
  // const pageSize = useState(50)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalExport, setShowModalExport] = useState(false)
  const [itemDelete, setItemDelete] = useState(null)
  const [fileName, setFileName] = useState("")
  const [fileFormat, setFileFormat] = useState("xlsx")
  const [sidebar, setSidebar] = useState(false)
  const [id, setId] = useState(0)
  const [data, setData] = useState(null)
  const [measures, setMeasures] = useState([])
  const [groups, setGroups] = useState([])

  const [config, setConfig] = useState(null)
  const rowClassRules = {
    'rowColor_00': function(params) {
      if(params && params.data.structure) {
        let level = params.data.structure.split(".").length - 1
        return level===0 && params.data.is_group
      }
      return false
      // var numSickDays = params.data.sickDays;
      // return numSickDays > 5 && numSickDays <= 7;
    },
    'rowColor_01': function(params) {
      if(params && params.data.structure) {
        let level = params.data.structure.split(".").length - 1
        return level===1 && params.data.is_group
      }
      return false
    },
    'rowColor_02': function(params) {
      if(params && params.data.structure) {
        let level = params.data.structure.split(".").length - 1
        return level===2 && params.data.is_group
      }
      return false
    },
    'rowColor_03': function(params) {
      if(params && params.data.structure) {
        let level = params.data.structure.split(".").length - 1
        return level===3 && params.data.is_group
      }
      return false
    },
    'rowColor_04': function(params) {
      if(params && params.data.structure) {
        let level = params.data.structure.split(".").length - 1
        return level===4 && params.data.is_group
      }
      return false
    },
    'rowColor_05': function(params) {
      return params.data.is_group === false
    },
  }
  const icons =  {
    // menu: '<i class="fa fa-bath" style="width: 10px"/>',
    // filter: '<i class="fa fa-long-arrow-alt-down"/>',
    // columns: '<i class="fa fa-handshake"/>',
    // sortAscending: '<i class="fa fa-long-arrow-alt-down"/>',
    // sortDescending: '<i class="fa fa-long-arrow-alt-up"/>',
    // groupExpanded:'-',
    // groupContracted: '<span class="ag-icon ag-icon-closed">+</span>',
    //  groupContracted: '<span class="ag-iconAux">+</span>',
      // '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/javascript-grid-icons/plus.png" style="height: 12px; width: 12px;padding-right: 2px"/>',
    // columnMovePin: '<i class="far fa-hand-rock"/>',
    // columnMoveAdd: '<i class="fa fa-plus-square"/>',
    // columnMoveHide: '<i class="fa fa-times"/>',
    // columnMoveMove: '<i class="fa fa-link"/>',
    // columnMoveLeft: '<i class="fa fa-arrow-left"/>',
    // columnMoveRight: '<i class="fa fa-arrow-right"/>',
    // columnMoveGroup: '<i class="fa fa-users"/>',
    // rowGroupPanel: '<i class="fa fa-university"/>',
    // pivotPanel: '<i class="fa fa-magic"/>',
    // valuePanel: '<i class="fa fa-magnet"/>',
    // menuPin: 'P',
    // menuValue: 'V',
    // menuAddRowGroup: 'A',
    // menuRemoveRowGroup: 'R',
    // clipboardCopy: '>>',
    // clipboardPaste: '>>',
    // rowDrag: '<i class="fa fa-circle"/>',
  }
  const groupDefaultExpanded = 0
  function getDataPath(data) {
    if(data && data.structure) {
      return data.structure.split(".")
    }
    return data
  }
  function getRowNodeId(data) {
    return data.id
  }
  const autoGroupColumnDef = {
        headerName: "Estruturado",
        minwidth: 10,
        filter: true,
        valueGetter: params => params.data.structure,
        cellRendererParams: {
          checkbox: false,
          suppressCount: true
        }
      }

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
    //   headerName: "Estruturado",
    //   field: "structure",
    //   minwidth: 150,
    //   filter: true,
    //   visible: false,
    //   cellRendererFramework: params => {
    //     return (
    //       <div
    //         className="d-flex align-items-center cursor-pointer"
    //         //onClick={() => dadosdoCadastroPermission ? history.push(`/app/profile/cadastro/${params.data.id}`) : null}
    //         onClick={() => dadosdoCadastroPermission ? handleId(params.data,params.data.id,true)  : null}
    //       >
    //         <span>{params.data.structure}</span>
    //       </div>
    //     )
    //   }
    // },
    {
      headerName: "ID",
      field: "id",
      width: 150,
      filter: true,
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
            //onClick={() => dadosdoCadastroPermission ? history.push(`/app/profile/cadastro/${params.data.id}`) : null}
            onClick={() => dadosdoCadastroPermission ? handleId(params.data,params.data.id,true)  : null}
          >
            <span>{params.data.name}</span>
          </div>
        )
      }
    },
    {
      headerName: "Grupo",
      field: "is_group",
      filter: true,
      width: 120,
      cellRendererFramework: params => {
        return params.value === true ? (
          <div className="badge badge-pill badge-light">
            Sim
          </div>
          // <div className="bullet bullet-sm bullet-primary"></div>
        ) : params.value === false ? (
          // <div className="bullet bullet-sm bullet-secondary"></div>
          <div className="badge badge-pill badge-light">
            Não
          </div>
        ) : null
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
            company_id: 1,
	          un_id: 0
          };
          let response = await api.post("/materials.config", {
            ...body
          });
          setConfig(response.data)

          body = {
            licence_id: auth.login.licence_id,
            id: 0,
            active: "all"
          };
          response = await api.post("/measurements.list", {
            ...body
          });
          setMeasures(response.data)

          body = {
            licence_id: auth.login.licence_id,
            id: 0,
            active: 'all',
            company_id: 1,
	          un_id: 0
          };
          response = await api.post("/materials.list", {
            ...body
          });
          setRowData(response.data)


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


  function toggleModalDelete(itemDelete, status) {
    setItemDelete(itemDelete)
    setShowModalDelete(status)
  }

  function handleId(data, id, sidebar) {
    setData(data)
    setId(id)
    setSidebar(sidebar)
    if(sidebar) {
      let groups = rowData.filter(i => i.is_group) // && (id===0 || i.id !== id))
      setGroups(groups)
    }
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
        };
        await api.delete("/materials",
          { data }
        );
        setItemDelete(null)
        setShowModalDelete(false)
        let rowDataAux = rowData.filter(function(row){ return row.id !== itemDelete.id; })
        setRowData(rowDataAux)
        toast.success("Material excluído com sucesso!", { transition: Flip });
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
            toast.error(`Erro ao Excluir o Material! ${error.message}`, { transition: Flip });
          }
        }
      }
      else {
        toast.error(`Erro ao Excluir o Material! ${error.message}`, { transition: Flip });
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
    <Breadcrumbs
      breadCrumbTitle="Cadastros"
      breadCrumbParent="Geral"
      breadCrumbActive="Materiais"
    />
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
                        <div className="ag-grid-actions d-flex justify-content-end flex-wrap mb-1">
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
                              <AgGridReact
                                rowData={rowData}
                                columnDefs={columnDefs}
                                defaultColDef={defaultColDef}
                                autoGroupColumnDef={autoGroupColumnDef}
                                treeData={true}
                                animateRows={true}
                                groupDefaultExpanded={groupDefaultExpanded}
                                getDataPath={getDataPath}
                                onGridRead={onGridReady}
                                pagination={true}
                                floatingFilter={false}
                                rowClassRules={rowClassRules}
                                icons={icons}
                                // components={this.state.components}
                                getRowNodeId={getRowNodeId}
                              />

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
                              Confirma a exclusão do Material? <br></br><br></br>
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
                  groups={groups}
                  measures={measures}
                  config={config}
                />
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </>
  )
}
