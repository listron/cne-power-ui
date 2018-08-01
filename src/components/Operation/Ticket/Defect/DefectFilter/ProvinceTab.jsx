import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectFilter.scss';
import { Tabs, Checkbox } from 'antd';
const { TabPane } = Tabs;
const CheckboxGroup = Checkbox.Group;

class ProvinceTab extends Component {
  static propTypes = {
    stationCodes: PropTypes.string,
    stations: PropTypes.array,
    changeDefectStore: PropTypes.func,
    provinceCode : PropTypes.number,
    provinceName : PropTypes.string,
    childrenStations: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    const { provinceCode, provinceName, childrenStations, stationCodes } = this.props;
    const stationOptions = childrenStations.map(e=>({
      label: e.stationName,
      value: e.stationCode
    }));
    let checkedStations = stationCodes.split(',').filter(e=>!!e).map(e=>+e);

    let isAllChecked = false;//checkedStations.length === stationCodes.length;

    return (
      <TabPane tab={provinceName} key={provinceCode}>
        <Checkbox onChange={this.checkAll} checked={isAllChecked}>不限</Checkbox>
        <CheckboxGroup options={stationOptions} value={checkedStations} onChange={this.onStationCheck} />
      </TabPane>
    );
  }

}

export default ProvinceTab;