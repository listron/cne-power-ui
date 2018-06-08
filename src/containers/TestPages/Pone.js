import React, { Component } from 'react';
import InputLimit from '../../components/Common/InputLimit/index';
import PropTypes from 'prop-types';
import WorkListTimeLine from '../../components/Common/WorkListTimeLine';
class Pone extends Component {
  static propTypes = {
      placeHolder : PropTypes.string,
      size : PropTypes.number,
      value : PropTypes.string,
      status : PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      placeHolder:'请输入处理过程，不超过80个汉字',
      size:80,
      value: '',
      status: 4,

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
        <WorkListTimeLine status={this.state.status} /> 
      </div>
    );
  }
}

export default Pone;