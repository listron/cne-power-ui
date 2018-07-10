import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
const ButtonGroup = Button.Group;

class FormHanleButtons extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    onDefectFinishChange: PropTypes.func
  };
  constructor(props){
    super(props);
  }
  handleUnfinish = () => {
    this.props.onChange('1');
    this.props.onDefectFinishChange(false)
  }
  handleFinish = () => {
    this.props.onChange('0');
    this.props.onDefectFinishChange(true)
  }
  
  render() {
    const { value } = this.props;
    return (
      <ButtonGroup>
        <Button onClick={this.handleUnfinish} type={value==='1'?'primary':null}>未解决</Button>
        <Button onClick={this.handleFinish} type={value==='0'?'primary':null}>已解决</Button>
      </ButtonGroup>
    );
  }
}

export default FormHanleButtons;