
import React, { Component } from 'react';
import { Cascader } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';

class StationCascader extends Component {
  static propTypes = {
    holderText: PropTypes.string,
    data: PropTypes.array,
    value: PropTypes.array,
    onChange: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps){
    const { value } = this.props;
    const nextValue = nextProps.value;
    (value[1] !== nextValue[1]) && this.setState({ // value变化时, state同步
      value: nextValue,
    });
  }

  dataToOption = (data) => data.map(e => {
    const { stations = [] } = e || {};
    return {
      value: e.regionName,
      label: e.regionName,
      children: stations.map(m => ({
        value: m.stationCode,
        label: m.stationName,
      })),
    };
  });

  checkStation = (selectedValue, selectedOption) => {
    const value = [...selectedValue, selectedOption[1].label];
    this.setState({ value });
    this.props.onChange(value);
  }

  render() {
    const { data, holderText } = this.props;
    const { value } = this.state;
    const options = this.dataToOption(data);
    return (
      <Cascader
        placeholder={holderText}
        options={options}
        onChange={this.checkStation}
        value={(data && data.length > 0 && value && value.length > 1) ? [value[0], value[1]] : []}
      />
    );
  }
}
export default StationCascader;
