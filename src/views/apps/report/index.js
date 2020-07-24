// import React from 'react';
// import Report from './report2.js'

// export default function Teste() {
//   return (<Report />)
// }
import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux";
import api from "../../../services/api"

export default function Viewer() {
  const [atualiza,setAtualiza] = useState(false)
  // const [report, setReport] = useState(null)
  // const [viewerAtual, setViewer] = useState(null)
  const auth = useSelector(state => state.auth);
  // const [rowData, setRowData] = useState(null)
  useEffect(() =>
  {
    async function loadDados() {
      let body = {
        licence_id: auth.login.licence_id,
        profile_id: 0,
        application_id: 1,
        userlog_id: auth.login.values.loggedInUser.id
      };
      let response = await api.post("/profilepermission.list",
        body
      );
      let rowData = response.data;
      // setRowData(rowData)
      console.log(rowData)
      console.log('Loading Viewer view');

          console.log('Creating the report viewer with default options');



          var report = new window.Stimulsoft.Report.StiReport();
           report.loadFile("/report/SimpleList.mrt");
          // var jsonString = report.saveToJsonString();
          // report.load(jsonString);
          // var stiImage = window.Stimulsoft.System.IO.Http.getFile("http://127.0.0.1:3333/files/21", true);
          // var resource = new window.Stimulsoft.Report.Dictionary.StiResource("Resource1", "Resource1", false, window.Stimulsoft.Report.Dictionary.StiResourceType.Image, stiImage);
          // report.dictionary.resources.add(resource);

          var stiImage = window.Stimulsoft.System.Drawing.Image.fromFile(auth.login.avatar_company);

               //create variable with type : image, create that variable on the report with name : var_image
          var var1 = report.dictionary.variables.getByName("image1");
          var1.valueObject = stiImage;
          var dataSet = new window.Stimulsoft.System.Data.DataSet("teste");
          dataSet.readJson(rowData);
          report.regData(dataSet.dataSetName, "", dataSet);

          //report.loadFile("e:/report.mrt");
               //create variable image and loadfile from local disk ex. location image on drive c:/
		//var stiImage = Stimulsoft.System.Drawing.Image.fromFile("c:/image.jpg");

               //create variable with type : image, create that variable on the report with name : var_image
		// var var1 = report.dictionary.variables.getByName("image1");
		// var1.valueObject = stiImage;
		// viewer.report = report;

          // Server=localhost;Database=MYCARE;User Id=sa; Password= reallyStrongPwd123;
      // console.log(report.dictionary.databases)
          // report.dictionary.databases.getByName("Connection").connectionString = "Data Source=localhost;User Id=sa; Password= reallyStrongPwd123;Initial Catalog=Mycare";
          // report.dictionary.dataSources.getByName("DataSourceName").sqlCommand = "select * from Table where Column = 100";
          // report.dictionary.dataSources.getByName("DataSourceName").commandTimeout = 1000;
          var options = new window.Stimulsoft.Viewer.StiViewerOptions();



          options.width = "1000px";

          options.height = "1000px";



          // options.appearance.scrollbarsMode = true;

          // options.appearance.backgroundColor = window.Stimulsoft.System.Drawing.Color.dodgerBlue;

          // options.appearance.showTooltips = false;



          // options.toolbar.showPrintButton = false;

          // options.toolbar.showDesignButton = false;

          // options.toolbar.showAboutButton = false;



          // options.exports.showExportToPdf = true;

          // options.exports.ShowExportToWord2007 = true;
          var viewer = new window.Stimulsoft.Viewer.StiViewer(null, 'viewer', false);

          console.log('Creating a new report instance');
          console.log('Assigning report to the viewer, the report will be built automatically after rendering the viewer');
          viewer.report = report;

          console.log('Rendering the viewer to selected element');
          await viewer.renderHtml('viewer');
          // setReport(report)
          // setViewer(viewer)
          setAtualiza(true)

    }
    if(!atualiza)
     {
       loadDados();
     }


        }, [atualiza, auth.login.avatar_company, auth.login.licence_id, auth.login.values.loggedInUser.id]);

  return (
    <div>
      <div id="viewer">

      </div>
    </div>
  )
}
