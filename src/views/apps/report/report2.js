import React, {PureComponent} from 'react'
const win = window;
let Stimulsoft;
let viewer=null;

class ReportViewerContainer extends PureComponent {

  componentWillMount() {
    Stimulsoft = win.Stimulsoft;
    const CampusReport = new Stimulsoft.Report.StiReport(),
      SummaryReport = new Stimulsoft.Report.StiReport();
    CampusReport.loadFile('Report.mrt');
    SummaryReport.loadFile('SimpleList.mrt');
    this.setState({
      summaryReport: SummaryReport,
      campusReport: CampusReport,
      currentReport: SummaryReport,
    })
  }

  componentDidMount() {
    this.setupViewer();
  }

  setupViewer = () => {
    const options = new Stimulsoft.Viewer.StiViewerOptions();
    viewer = new Stimulsoft.Viewer.StiViewer(options, 'viewer', false);
    viewer.report = this.state.currentReport;
    viewer.renderHtml('viewer');
  };

  renderReport = () => {
    viewer.report = this.state.currentReport;
  };

  // selectReport = (prop) => {
  //   return (e) => {
  //     e.preventDefault();
  //     if(this.state.currentReport === this.state[prop]){
  //       return Promise.resolve().then(this.closeMenu);
  //     }
  //     return this.closeMenu()
  //       .then(() => {
  //         return new Promise((resolve) => {
  //           this.setState({currentReport: this.state[prop]}, resolve)
  //         })
  //       })
  //       .then(this.renderReport)
  //   }
  // };

  // openMenu = (e) => {
  //   this.setState({anchorEl: e.currentTarget})
  // };

  render() {
    // const {anchorEl} = this.state,
    //   selectCampusReport = this.selectReport('Report'),
    //   selectSummaryReport = this.selectReport('SimpleReport');

    return (
      <div>
        <button
          onClick={() => this.renderReport()}
        >
          Report
        </button>
        <div id="viewer">&nbsp;</div>
      </div>
    );
  }
}

export default (ReportViewerContainer);
