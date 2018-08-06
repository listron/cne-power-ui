import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './inspectFilter.scss';
import { Tabs, Checkbox } from 'antd';
const { TabPane } = Tabs;
const CheckboxGroup = Checkbox.Group;

class ProvinceTab extends Component {
  static propTypes = {
    stationCodes: PropTypes.string,
    stations: PropTypes.array,
    listQueryParams: PropTypes.object,
    getInspectList: PropTypes.func,
    provinceCode : PropTypes.number,
    provinceName : PropTypes.string,
    childrenStations: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  onAllCheck = () => {
    let { childrenStations, stationCodes,getInspectList,listQueryParams } = this.props;
    let stationArray = stationCodes.split(',').filter(e=>!!e).map(e=>+e).concat(childrenStations.map(e=>e.stationCode));
    stationCodes= Array.from(new Set(...stationArray));
    getInspectList({
      ...listQueryParams,
      stationCodes,
    })
  }

  onStationCheck = (checkedValue) => {
    let { stationCodes,getInspectList,listQueryParams } = this.props;
    let stationArray = stationCodes.split(',').filter(e=>!!e).map(e=>+e).concat(checkedValue);
    stationCodes= Array.from(new Set(...stationArray));
    getInspectList({
      ...listQueryParams,
      stationCodes,
    })
  }

  render() {
    const { provinceCode, provinceName, childrenStations, stationCodes } = this.props;
    const stationOptions = childrenStations.map(e=>({
      label: e.stationName,
      value: e.stationCode
    }));
    const checkedProvinceStationCodes = stationCodes.split(',').filter(e=>!!e).map(e=>+e);//所有选中电站
    const provincStationArray = childrenStations.filter(e=>{//选出属于当前省份的电站信息
      return checkedProvinceStationCodes.find(m=>m === e.stationCode)
    })
    const isAllChecked = provincStationArray.length === childrenStations.length;
    const checkedStations = provincStationArray.map(e=>e.stationCode)
    return (
      <TabPane tab={provinceName} key={provinceCode}>
        <Checkbox onChange={this.onAllCheck} checked={isAllChecked}>不限</Checkbox>
        <CheckboxGroup options={stationOptions} value={checkedStations} onChange={this.onStationCheck} />
      </TabPane>
    );
  }

}

export default ProvinceTab;