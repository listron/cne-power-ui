
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

class ReportEdit extends Component {
  static propTypes = {
    onSidePageChange: PropTypes.func,
    toChangeDayReportStore: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  backToDetail = () => {
    this.props.onSidePageChange({ sidePage : 'detail'});
    this.props.toChangeDayReportStore({
      showPage: 'detail'
    })
  }

  render(){
    return (
      <div>
        <div>
          <span>日报编辑</span>
          <Button>保存--注意，保存应该在这里</Button>
          <Button onClick={this.backToDetail}>返回</Button>
        </div>
        
      </div>
    )
  }
}

export default ReportEdit;
