import React from "react";
import PropTypes from "prop-types";
import { Table, Radio } from 'antd';

class RecordTable extends React.Component {
  static propTypes = {
    totalNum: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    onShowSideChange: PropTypes.func,
    changeDeviceManageStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
  }
  changeTableData=(e)=>{
    console.log('e: ', e.target.value);
    

  }
  render() {
    return (
      <div>
        <Radio.Group defaultValue="a" buttonStyle="solid" onChange={this.changeTableData}>
          <Radio.Button value="a">部件信息</Radio.Button>
          <Radio.Button value="b">检修记录</Radio.Button>
          <Radio.Button value="c">历史告警</Radio.Button>
        </Radio.Group>
        
      </div>
    )
  }
}
export default (RecordTable)