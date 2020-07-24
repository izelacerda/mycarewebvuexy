import React from "react"

class Report extends React.Component {
  // componentWillMount() {
  //   var Stimulsoft = window.Stimulsoft;
  //   var report = Stimulsoft.Report.StiReport.createNewReport();

  //   var options = new Stimulsoft.Viewer.StiViewerOptions();
  //   this.viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
  //   report.loadFile('SimpleList.mrt');
  //   this.viewer.report = report;
  // }

  componentDidMount() {
    // this.viewer.renderHtml("viewerContent");
    console.log('Loading Viewer view');

    console.log('Creating the report viewer with default options');
    var viewer = new window.Stimulsoft.Viewer.StiViewer(null, 'StiViewer', false);

    console.log('Creating a new report instance');
    var report = new window.Stimulsoft.Report.StiReport();

    console.log('Load report from url');
    report.loadFile('/SimpleList.mrt');

    console.log('Assigning report to the viewer, the report will be built automatically after rendering the viewer');
    viewer.report = report;

    console.log('Rendering the viewer to selected element');
    viewer.renderHtml('viewerContent');
  }

  render() {
    return <div id="viewerContent"></div>;
  }
}
export default Report

// import React  from 'react'
// // let Stimulsoft= null;

// class ReportViewerContainer extends React.Component {

//   componentDidMount() {

//     console.log('Loading Viewer view');

//     console.log('Creating the report viewer with default options');

//     var tste = window.Stimulsoft
//     console.log(tste)
//     if(tste!== null)
//     var viewer = new window.Stimulsoft.Viewer.StiViewer(null, 'StiViewer', false);

//     console.log('Creating a new report instance');

//     var report = new window.Stimulsoft.Report.StiReport();

//     console.log('Load report from url');
//     report.loadFile('Report.mrt');

//     console.log('Assigning report to the viewer, the report will be built automatically after rendering the viewer');
//     viewer.report = report;

//     console.log('Rendering the viewer to selected element');
//     viewer.renderHtml('viewer');

//   }

//   // componentDidMount() {
//   //   this.setupViewer();
//   // }

//   // setupViewer = () => {
//   //   const options = new Stimulsoft.Viewer.StiViewerOptions();
//   //   this.viewer = new Stimulsoft.Viewer.StiViewer(options, 'viewer', false);
//   //   this.viewer.report = this.state.currentReport;
//   //   this.viewer.renderHtml('viewer');
//   // };

//   // renderReport = () => {
//   //   this.viewer.report = this.state.currentReport;
//   // };

//   // selectReport = (prop: string) => {
//   //   return (e: any) => {
//   //     e.preventDefault();
//   //     if(this.state.currentReport === this.state[prop]){
//   //       return Promise.resolve().then(this.closeMenu);
//   //     }
//   //     return this.closeMenu()
//   //       .then(() => {
//   //         return new Promise((resolve) => {
//   //           this.setState({currentReport: this.state[prop]}, resolve)
//   //         })
//   //       })
//   //       .then(this.renderReport)
//   //   }
//   // };

//   // openMenu = (e: any) => {
//   //   this.setState({anchorEl: e.currentTarget})
//   // };

//   // closeMenu = () => {
//   //   return new Promise((resolve) => {
//   //     this.setState({anchorEl: undefined}, resolve)
//   //   })
//   // };

//   render() {
//     return (
//         <div id="viewer">&nbsp;</div>
//     );
//   }
// }

// export default ReportViewerContainer;
