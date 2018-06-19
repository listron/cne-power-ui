import React, { Component } from 'react';
import {Tabs} from 'antd';
import DefectList from './Defect/DefectList';
import InspectList from './Inspect/InspectList';
import DefectDetail from './Defect/DefectDetail';
const TabPane = Tabs.TabPane;


class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "defect",
      showDefectDetail: false,
      showDefectCreate: false,
      showInspectDetail: false,
      showInspectCreate: false
    };
    this.onChangeTab = this.onChangeTab.bind(this);
    this.onShowDefectDetail = this.onShowDefectDetail.bind(this);
    this.onCLoseDefectDetail = this.onCLoseDefectDetail.bind(this);
  }

  onChangeTab(tab) {
    this.setState({
      tab: tab
    });
  }

  onShowDefectDetail() {
    this.setState({
      showDefectDetail: true
    });
  }

  onCLoseDefectDetail() {
    this.setState({
      showDefectDetail: false
    });
  }

  render() {
    return (
      <div style={{display:"flex", flex: 1}}>
        {this.state.showDefectDetail && (
          <DefectDetail onCloseDetail={this.onCLoseDefectDetail} />)}
        {!this.state.showDefectDetail && !this.state.showDefectCreate && 
          !this.state.showInspectDetail && !this.state.showInspectCreate && (
          <Tabs activeKey={this.state.tab} onChange={this.onChangeTab}>
            <TabPane tab="缺陷" key="defect">
              <DefectList onShowDetail={this.onShowDefectDetail} />
            </TabPane>
            <TabPane tab="巡检" key="inspection"><InspectList /></TabPane>
          </Tabs>
        )}
      </div>
    );
  }
}

export default Ticket;