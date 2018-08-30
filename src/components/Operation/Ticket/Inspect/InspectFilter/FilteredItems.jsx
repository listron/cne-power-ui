import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './inspectFilter.scss';

class FilteredItems extends Component {
  static propTypes = {
    listQueryParams: PropTypes.object,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
    stationType: PropTypes.string,
    stationCodes: PropTypes.string,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string, 
    deviceTypeCode: PropTypes.string,
    getInspectList: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }
  onCancelStartTime = () => {//取消开始时间
    const { getInspectList, listQueryParams } = this.props;
    getInspectList({
      ...listQueryParams,
      createTimeStart: '',
    })
  }
  onCancelEndTime = () => { //取消结束时间
    const { getInspectList, listQueryParams } = this.props;
    getInspectList({
      ...listQueryParams,
      createTimeEnd: '',
    })
  }
  onCancelStationType = () => {//取消电站类型
    const { getInspectList, listQueryParams } = this.props;
    getInspectList({
      ...listQueryParams,
      stationType: '2',
    })
  }
  onCancelProvince = (cancelStations) => {//删除某省电站
    const { stationCodes, getInspectList, listQueryParams } = this.props;
    const tmpStations = stationCodes.split(',').filter(e=>!!e).map(e=>+e);
    const newStationCodes = tmpStations.filter(e=>!cancelStations.some(m=>m===e));
    getInspectList({
      ...listQueryParams,
      stationCodes: newStationCodes,
    })
  }
  onCancelDeviceType = (cancelCode) => {//删除某设备类型
    const { deviceTypeCode, getInspectList, listQueryParams } = this.props;
    const newDeviceTypeCode = deviceTypeCode.split(',').filter(e=>!!e).map(e=>+e).filter(e=>e!==cancelCode);
    getInspectList({
      ...listQueryParams,
      deviceTypeCode: newDeviceTypeCode,
    })
  } 
  resetAll = () => {//删除所有筛选条件
    const { getInspectList, listQueryParams } = this.props;
    getInspectList({
      ...listQueryParams,
      createTimeStart: '',
      createTimeEnd: '',
      stationType: '2',
      stationCodes: '',
      deviceTypeCode: '',
    })
  }

  render() {
    const {createTimeStart, createTimeEnd, stationType, stationCodes, deviceTypeCode, stations, deviceTypes, } = this.props;
    // console.log(stationCodes)
    // console.log(stations)

    const tmpSelectedDeviceType = deviceTypeCode.split(',').filter(e=>!!e).map(e=>+e);
    const tmpSelectedStations = stationCodes.split(',').filter(e=>!!e).map(e=>+e);//选中电站的数组
    const tmpSelectedStationsInfor = stations.filter(e=>tmpSelectedStations.some(m=>m === e.stationCode));//选中电站详细信息
    let stationInforGroup = [];//根据省份分组
    tmpSelectedStationsInfor.length > 0 && tmpSelectedStationsInfor.forEach(e=>{//根据省份分组
      let getAccuacyProvice = false;
      stationInforGroup.length > 0 && stationInforGroup.forEach(m=>{
        if(m.provinceCode === e.provinceCode){
          getAccuacyProvice = true;
          m.childrenStations.push(e.stationCode)
        }
      })
      if(!getAccuacyProvice){
        stationInforGroup.push({
          provinceCode : e.provinceCode,
          provinceName : e.provinceName,
          childrenStations: [e.stationCode]
        })
      }
    })
    const selectedDeviceTypeArray = deviceTypes.filter(e=>tmpSelectedDeviceType.some(m=>m===e.deviceTypeCode));
    let resetAll = false;
    (createTimeStart || createTimeEnd || stationType === '0' || stationType === '1' || selectedDeviceTypeArray.length > 0 || tmpSelectedStations.length > 0 ) && (resetAll = true)
    return (
      <div className={styles.filteredItems}>
        <span>已选条件</span>
        { createTimeStart && <Tag closable onClose={this.onCancelStartTime}>开始 {createTimeStart}</Tag>}
        { createTimeEnd && <Tag closable onClose={this.onCancelEndTime}>结束 {createTimeEnd}</Tag>}
        { (stationType === '0' || stationType === '1') &&  <Tag closable onClose={this.onCancelStationType}>{stationType === '0'?'风电':'光伏'}</Tag>}
        {stationInforGroup.length > 0 && stationInforGroup.map(e=>(
          <Tag closable onClose={()=>this.onCancelProvince(e.childrenStations)} key={e.provinceCode} >{`${e.provinceName} ${e.childrenStations.length}`}</Tag>
        ))}
        { selectedDeviceTypeArray.length > 0 && selectedDeviceTypeArray.map(e=>(
          <Tag closable onClose={()=>this.onCancelDeviceType(e.deviceTypeCode)} key={e.deviceTypeCode} >{e.deviceTypeName}</Tag>
        )) }
        {resetAll && <Tag closable onClose={this.resetAll} >清空条件</Tag>}
      </div>
    );
  }

}

export default FilteredItems;