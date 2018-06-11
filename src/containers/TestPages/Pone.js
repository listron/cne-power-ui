import React, { Component } from 'react';
import InputLimit from '../../components/Common/InputLimit/index';
import PropTypes from 'prop-types';
// import TimeLines from '../../components/Common/TimeLines';
class Pone extends Component {
  static propTypes = {
      placeHolder : PropTypes.string,
      size : PropTypes.number,
      value : PropTypes.string,
      status : PropTypes.number,
      processData : PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      placeHolder:'请输入处理过程，不超过80个汉字',
      size:80,
      value: '',
      status: 4,
      processData : [{
        "flowID": 1,
        "flowName": "发现缺陷",
        "operateTime": "2018-03-12 12:00",
        "operateUser": "李丽",
        "processResult": "创建",
        "defectProposal": "来源于创建缺陷的描述来源于创建缺陷的描述",
        "photoAddress": ["", "", ""]
      },
      {
        "flowID": 2,
        "flowName": "审核工单",
        "operateTime": "2018-03-12 12:00",
        "operateUser": "李丽",
        "processResult": "下发",
        "defectProposal": "来源于创建缺陷的描述来源于创建缺陷的描述",
        "photoAddress": ["", "", ""]
      },
      {
        "flowID": 3,
        "flowName": "执行工单",
        "operateTime": "2018-03-12 12:00",
        "operateUser": "李丽",
        "processResult": "已解决",
        "defectProposal": "来源于创建缺陷的描述来源于创建缺陷的描述",
        "photoAddress": ["", "", ""]
      },
      {
        "flowID": 4,
        "flowName": "验收工单",
        "operateTime": "2018-03-12 12:00",
        "operateUser": "李丽",
        "processResult": "不合格",
        "defectProposal": "来源于创建缺陷的描述来源于创建缺陷的描述",
        "photoAddress": ["", "", ""]
      }],

    };
    this.handleInput=this.handleInput.bind(this);
  }

  handleInput(value){
    this.setState({
      value: value,
    })
  }

  render() {
    return (
      
      <div style={{width:'80%',margin:'0 auto',}} >
        <InputLimit placeHolder={this.state.placeHolder} width={this.state.width} handleInput={this.handleInput} size={this.state.size}  />
        <p>{this.state.value}</p>
        {/* <TimeLines status={this.state.status} processData={this.state.processData} />  */}
      </div>
    );
  }
}

export default Pone;