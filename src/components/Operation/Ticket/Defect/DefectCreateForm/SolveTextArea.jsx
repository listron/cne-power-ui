import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
const { TextArea } = Input;

class SolveTextArea extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  };
  constructor(props){
    super(props);
    this.state = {
      keyWords:['设备已正常','缺少备件','已换光伏板','设备已清洗','鸟粪/障碍物已清除']
    }
  }
  changeText = (e) => {
    this.props.onChange(e.target.value)
  }
  selectText = (e)=>{
    this.props.onChange(e)
  }
  
  render() {
    const { value } = this.props;
    const { keyWords } = this.state;
    return (
      <div>
        <TextArea placeholder={'请描述处理过程，不超过80字'} onChange={this.changeText} value={value} />
        <div>
          {keyWords.map(e=>(<Button key={e} onClick={()=>this.selectText(e)}>{e}</Button>))}
        </div>
      </div>
    );
  }
}

export default SolveTextArea;