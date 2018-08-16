// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { Tag } from 'antd';
// import styles from './defectFilter.scss';

// class FilteredItems extends Component {
//   static propTypes = {
//     stations: PropTypes.object,
//     deviceTypes: PropTypes.object,
//     deviceTypeCode: PropTypes.string,
//     warningLevel: PropTypes.string,
//     stationCode: PropTypes.string, 
//     warningConfigName: PropTypes.string,	  
//     startTime: PropTypes.string,
//     endTime: PropTypes.string, 
//     onChangeFilter: PropTypes.func,
//   }

//   constructor(props) {
//     super(props);
//   }
//   onCancelStartTime = () => {//取消开始时间
//     const { getDefectList, listQueryParams } = this.props;
//     getDefectList({
//       ...listQueryParams,
//       createTimeStart: '',
//     })
//   }
//   onCancelEndTime = () => { //取消结束时间
//     const { getDefectList, listQueryParams } = this.props;
//     getDefectList({
//       ...listQueryParams,
//       createTimeEnd: '',
//     })
//   }
//   onCancelStationType = () => {//取消电站类型
//     const { getDefectList, listQueryParams } = this.props;
//     getDefectList({
//       ...listQueryParams,
//       stationType: '2',
//     })
//   }
//   onCancelProvince = (cancelStations) => {//删除某省电站
//     const { stationCodes, getDefectList, listQueryParams } = this.props;
//     const tmpStations = stationCodes.split(',').filter(e=>!!e).map(e=>+e);
//     const newStationCodes = tmpStations.filter(e=>!cancelStations.some(m=>m===e));
//     getDefectList({
//       ...listQueryParams,
//       stationCodes: newStationCodes,
//     })
//   }
//   onCancelDeviceType = (cancelCode) => {//删除某设备类型
//     const { deviceTypeCode, getDefectList, listQueryParams } = this.props;
//     const newDeviceTypeCode = deviceTypeCode.split(',').filter(e=>!!e).map(e=>+e).filter(e=>e!==cancelCode);
//     getDefectList({
//       ...listQueryParams,
//       deviceTypeCode: newDeviceTypeCode,
//     })
//   } 
//   onCancelLevel = (level) => {//删除某级告警
//     const { defectLevel, getDefectList, listQueryParams } = this.props;
//     const levelCodes = defectLevel.split(',').filter(e=>!!e).map(e=>+e).filter(e=>e!==level);
//     getDefectList({
//       ...listQueryParams,
//       defectLevel: levelCodes,
//     })
//   }
//   resetAll = () => {//删除所有筛选条件
//     const { getDefectList, listQueryParams } = this.props;
//     getDefectList({
//       ...listQueryParams,
//       createTimeStart: '',
//       createTimeEnd: '',
//       stationType: '2',
//       stationCodes: '',
//       deviceTypeCode: '',
//       defectLevel: '0',
//     })
//   }

//   render() {
//     const {deviceTypeCode, warningLevel, stationCode, warningConfigName, startTime, endTime, stations, deviceTypes } = this.props;
//     const alarmLevel = ['一级','二级','三级','四级'];
//     const alarmType = [{label:'事件告警', value:'事件告警'}];
//     const tmpSelectedDeviceType = deviceTypeCode.split(',');//选中设备类型的数组
//     const tmpSelectedStation = stationCode.split(',');//选中电站的数组
//     const selectedStation = stations.filter(e=>tmpSelectedStation.some(m=>m === e.get('stationCode').toString()));//选中电站详情
//     const selectedDeviceType = deviceTypes.filter(e=>tmpSelectedDeviceType.some(m=>m===e.get('deviceTypeCode').toString()));//选中的设备类型详情
//     if(deviceTypeCode === '' && warningLevel === '' && stationCode === '' && warningConfigName === '' && startTime === '' && endTime === '') {
//       return null;
//     }
//     return (
//       <div className={styles.filteredItems}>
//         <span>已选条件</span>
//         {startTime!==''&&<Tag closable onClose={this.onCancelStartTime}>开始 {createTimeStart}</Tag>}
//         { createTimeStart && <Tag closable onClose={this.onCancelStartTime}>开始 {createTimeStart}</Tag>}
//         { createTimeEnd && <Tag closable onClose={this.onCancelEndTime}>结束 {createTimeEnd}</Tag>}
//         { (stationType === '0' || stationType === '1') &&  <Tag closable onClose={this.onCancelStationType}>{stationType === '0'?'风电':'光伏'}</Tag>}
//         {stationInforGroup.length > 0 && stationInforGroup.map(e=>(
//           <Tag closable onClose={()=>this.onCancelProvince(e.childrenStations)} key={e.provinceCode} >{`${e.provinceName} ${e.childrenStations.length}`}</Tag>
//         ))}
//         { selectedDeviceTypeArray.length > 0 && selectedDeviceTypeArray.map(e=>(
//           <Tag closable onClose={()=>this.onCancelDeviceType(e.deviceTypeCode)} key={e.deviceTypeCode} >{e.deviceTypeName}</Tag>
//         )) }
//         { defectLevelArray.length > 0 && defectLevelArray.map(e=>(
//           <Tag key={e.value} closable onClose={()=>this.onCancelLevel(e.value)} >{e.label}</Tag>
//         )) }
//         {resetAll && <Tag closable onClose={this.resetAll} >清空条件</Tag>}
//       </div>
//     );
//   }

// }

// export default FilteredItems;