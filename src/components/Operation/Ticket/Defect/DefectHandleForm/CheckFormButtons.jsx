import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
const ButtonGroup = Button.Group;

class FormHanleButtons extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  };
  constructor(props){
    super(props);
  }
  onOk = () => {
    this.props.onChange('0');
  }
  onNotOk = () => {
    this.props.onChange('1');
  }
  
  render() {
    const { value } = this.props;
    return (
      <ButtonGroup>
        <Button onClick={this.onOk} type={value==='0'?'primary':null}>合格</Button>
        <Button onClick={this.onNotOk} type={value==='1'?'primary':null}>不合格</Button>
      </ButtonGroup>
    );
  }
}

export default FormHanleButtons;