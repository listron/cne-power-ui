import React, { Component } from 'react';
import {Tabs} from 'antd';
import Defect from './Defect/DefectList';
import Inspection from './Inspect/InspectList';
const TabPane = Tabs.TabPane;


class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "defect"
    };
    this.onChangeTab = this.onChangeTab.bind(this);
  }

  onChangeTab(tab) {
    this.setState({
      tab: tab
    });
  }

  render() {
    return (
      <div style={{display:"flex", flex: 1}}>
        <Tabs activeKey={this.state.tab} onChange={this.onChangeTab}>
          <TabPane tab="缺陷" key="defect"><Defect /></TabPane>
          <TabPane tab="巡检" key="inspection"><Inspection /></TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Ticket;