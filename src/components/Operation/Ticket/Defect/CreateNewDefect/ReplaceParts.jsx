import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Input } from 'antd';

class ReplaceParts extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
  };
  constructor(props){
    super(props);
    this.state = {
      checked: false
    }
  }
  onCheckChange = (checked) => {
    console.log(checked);
    this.setState({
      checked
    })
    if(!checked){
      this.props.onChange('');
    }
  }
  onPartsChange = (e) => {
    this.props.onChange(e.target.value);
  }
  
  render() {
    const { value } = this.props;
    let { checked } = this.state;
    if( value && value.length > 0 ){
      checked = true
    }
    return (
      <div>
        <Switch onChange={this.onCheckChange} checked={checked} />
        <Input onChange={this.onPartsChange} placeholder={'备件名称+型号'} value={value} disabled={!checked} />
      </div>
    );
  }
}

export default ReplaceParts;