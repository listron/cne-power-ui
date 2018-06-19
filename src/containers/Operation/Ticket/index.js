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
    this.onShowDetail = this.onShowDetail.bind(this);
  }

  onChangeTab(tab) {
    this.setState({
      tab: tab
    });
  }

  onShowDetail() {
    this.setState({
      showDefectDetail: true
    });
  }

  render() {
    return (
      <div style={{display:"flex", flex: 1}}>
        {this.state.showDefectDetail && <DefectDetail />}
        {!this.state.showDefectDetail && !this.state.showDefectCreate && 
          !this.state.showInspectDetail && !this.state.showInspectCreate && (
          <Tabs activeKey={this.state.tab} onChange={this.onChangeTab}>
            <TabPane tab="缺陷" key="defect">
              <DefectList onShowDetail={this.onShowDetail} />
            </TabPane>
            <TabPane tab="巡检" key="inspection"><InspectList /></TabPane>
          </Tabs>
        )}
      </div>
    );
  }
}

export default Ticket;