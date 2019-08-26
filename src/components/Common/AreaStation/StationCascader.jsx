
import React, { Component } from 'react';
import { Cascader } from 'antd';
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
    const { value, data } = props;
    this.state = {
      value: (data.length > 0 && value.length > 0) ? this.getInfoFromData(value[0], data) : [],
    };
  }

  componentWillReceiveProps(nextProps){
    const { value, data } = this.props;
    const nextValue = nextProps.value;
    const nextData = nextProps.data;
    const isGataGet = data.length === 0 && nextData.length > 0 && value[0];
    const isValueChange = nextData.length > 0 && value[0] !== nextValue[0];
    (isGataGet || isValueChange) && this.setState({
      value: this.getInfoFromData(nextValue[0], nextData),
    });
  }

  getInfoFromData = (value, data) => { // data中寻找stationCode匹配的信息
    let result = [];
    data.find(e => {
      const { stations = [], regionName } = e || {};
      return stations.some(m => {
        if(m.stationCode === value){
          result = [regionName, value, m.stationName];
          return true;
        }
        return false;
      });
    });
    return result;
  }

  dataToOption = (data) => data.map(e => {
    const { stations = [], regionName } = e || {};
    return {
      value: regionName,
      label: regionName,
      children: stations.map(m => ({
        value: m.stationCode,
        label: m.stationName,
      })),
    };
  });

  checkStation = (selectedValue, selectedOption) => {
    const value = selectedValue.length > 0 ? [...selectedValue, selectedOption[1].label] : [];
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
        value={[value[0], value[1]]}
        allowClear={false}
      />
    );
  }
}
export default StationCascader;
