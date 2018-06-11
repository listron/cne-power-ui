import React, { Component } from 'react';
import InspectionList from '../../../../components/Operation/Ticket/Inspection/InspectionList';


class Inspection extends Component {
  constructor(props,context) {
    super(props);
    this.state = {};
  }

  render() {   
    return (
        <div>
          <div>巡检处理页面</div>
          <InspectionList />
        </div>
    );
  }
}

export default Inspection;