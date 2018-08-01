import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './defectFilter.scss';

class FilteredItems extends Component {
  static propTypes = {
    listQueryParams: PropTypes.object,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
    stationType: PropTypes.string,
    stationCodes: PropTypes.string,
    // defectSource: PropTypes.string,   
    defectLevel: PropTypes.string,	  
    // timeInterval: PropTypes.string,
    // status: PropTypes.string, 
    // pageNum: PropTypes.number,
    // pageSize: PropTypes.number,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string, 
    deviceTypeCode: PropTypes.string,
    // defectTypeCode: PropTypes.string,
    // userName: PropTypes.string,
    // sort: PropTypes.string,
    getDefectList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  

  render() {
    // const listQueryParams = {
    //   stationType: this.props.stationType,
    //   stationCodes: this.props.stationCodes,
    //   defectSource: this.props.defectSource, 
    //   defectLevel: this.props.defectLevel,
    //   timeInterval: this.props.timeInterval,
    //   status: this.props.status,
    //   pageNum: this.props.pageNum + 1,
    //   pageSize: this.props.pageSize,
    //   createTimeStart: this.props.createTimeStart,
    //   createTimeEnd: this.props.createTimeEnd,
    //   deviceTypeCode: this.props.deviceTypeCode,
    //   defectTypeCode: this.props.defectTypeCode,
    //   handleUser: this.props.userName,
    //   sort: this.props.sort,
    // }
    const {createTimeStart, createTimeEnd, stationType, stationCodes, deviceTypeCode, defectLevel, stations, deviceTypes, } = this.props;
    // deviceTypeOptions = deviceTypes.map(e=>({
    //   label: e.deviceTypeName,
    //   value: e.deviceTypeCode
    // }))
    const tmpSelectedDeviceType = deviceTypeCode.split(',').filter(e=>!!e).map(e=>+e);
    const tmpSelectedStations = stationCodes.split(',').filter(e=>!!e).map(e=>+e);
    const selectedDeviceTypeArray = deviceTypes.filter(e=>tmpSelectedDeviceType.find(m=>m===e.deviceTypeCode));

    return (
      <div className={styles.filteredItems}>
        <span>已选条件</span>
        { createTimeStart && <Tag>开始 {createTimeStart}</Tag>}
        { createTimeEnd && <Tag>结束 {createTimeEnd}</Tag>}
        { (stationType === '0' || stationType === '1') &&  <Tag>{stationType === '0'?'风电':'光伏'}</Tag>}
        { selectedDeviceTypeArray.length > 0 && selectedDeviceTypeArray.map(e=>(
          <Tag key={e.deviceTypeCode} >{e.deviceTypeName}</Tag>
        )) }
      </div>
    );
  }

}

export default FilteredItems;