import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
const ButtonGroup = Button.Group;

class ProcessFormButtons extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  };
  constructor(props){
    super(props);
  }
  onNotSolve = () => {
    this.props.onChange('1');
  }
  onSolve = () => {
    this.props.onChange('0');
  }
  
  render() {
    const { value } = this.props;
    return (
      <ButtonGroup>
        <Button onClick={this.onNotSolve} type={value==='1'?'primary':null}>未解决</Button>
        <Button onClick={this.onSolve} type={value==='0'?'primary':null}>已解决</Button>
      </ButtonGroup>
    );
  }
}

export default ProcessFormButtons;