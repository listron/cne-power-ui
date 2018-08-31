import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './historyAlarm.scss';
import moment from 'moment';

class HistoryFilteredItems extends Component {
  static propTypes = {
    stations: PropTypes.object,
    deviceTypes: PropTypes.object,
    deviceTypeCode: PropTypes.array,
    warningLevel: PropTypes.array,
    stationType: PropTypes.string,
    stationCode: PropTypes.array, 
    warningConfigName: PropTypes.array,	  
    startTime: PropTypes.array,
    endTime: PropTypes.array,
    warningStatus: PropTypes.array,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onCancelStartTimeRange = () => {//取消发生时间
    this.props.onChangeFilter({
      startTime: [],
    });
  }

  onCancelEndTimeRange = () => {//取消结束时间
    this.props.onChangeFilter({
      endTime: [],
    });
  }

  onCancelDealResult = () => {//取消处理结果
    this.props.onChangeFilter({
      warningStatus: []
    });
  }

  onCancelStationType = () => {//取消电站类型
    this.props.onChangeFilter({
      stationType: '2'
    });
  }

  onCancelProvince = (cancelStations) => {//删除某省电站
    const { stationCode, onChangeFilter } = this.props;
    const newStationCode = stationCode.filter(code=>
      !cancelStations.some(station=>station.get('stationCode').toString()===code)
    );
    onChangeFilter({
      stationCode: newStationCode,
    });
  }
  onCancelDeviceType = (cancelCode) => {//删除某设备类型
    const { deviceTypeCode, onChangeFilter } = this.props;
    const newDeviceTypeCode = deviceTypeCode.filter(e=>e!==cancelCode);
    onChangeFilter({
      deviceTypeCode: newDeviceTypeCode
    });
  } 
  onCancelAlarmLevel = (level) => {//删除某级告警
    const { warningLevel, onChangeFilter } = this.props;
    const newWarningLevel = warningLevel.filter(e=>e!==level);
    onChangeFilter({
      warningLevel: newWarningLevel
    });
  }
  resetAll = () => {//删除所有筛选条件
    this.props.onChangeFilter({
      warningLevel: [],
      stationType: '2',
      stationCode: [],
      deviceTypeCode: [],
      warningConfigName: [],
      startTime: [],
      endTime: [],
      warningStatus: []
    });
  }

  render() {
    const {deviceTypeCode, warningLevel, stationType, stationCode, warningConfigName, startTime, endTime, warningStatus, stations, deviceTypes } = this.props;
    const alarmLevel = ['一级','二级','三级','四级'];
    const status = [
      {value:'0', label:'自动解除'},
      {value:'2', label:'手动解除'},
      {value:'3', label:'转工单'}
    ];
    const alarmLevelArray = warningLevel.map(item=>{
      return {
        value: item,
        label: alarmLevel[parseInt(item) - 1]
      }
    });
    const dealResultArray = warningStatus.map(item=> {
      return {
        value: item,
        label: status.find(e=>e.value===item).label
      };
    });
    const alarmTypeArray = warningConfigName.map(item=>{
      return {
        value: item,
        label: item
      }
    });
    const style = {
      background: '#fff', 
      borderStyle: 'dashed',
      padding: '0 10px',
      height: '30px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      marginRight: '16px',
    }
    const tmpSelectedDeviceType = deviceTypeCode;//选中设备类型的数组
    const tmpSelectedStation = stationCode;//选中电站的数组
    const selectedStation = stations.filter(e=>
      tmpSelectedStation.some(m=>
        m === e.get('stationCode').toString()
      )).groupBy(item=>item.get('provinceCode')).toList();//选中电站详情,按省分组
    const selectedDeviceType = deviceTypes.filter(e=>tmpSelectedDeviceType.some(m=>m===e.get('deviceTypeCode').toString()));//选中的设备类型详情
    if(deviceTypeCode.length === 0 && warningLevel.length === 0 && stationType === '2' && stationCode.length === 0 && warningConfigName.length === 0 && startTime.length === 0 && endTime.length === 0 && warningStatus.length === 0) {
      return null;
    }
    return (
      <div className={styles.filteredItems}>
        <span>已选条件</span>
        {warningLevel.length>0&&alarmLevelArray.map(e => (
          <Tag style={style} key={e.value} closable onClose={()=>this.onCancelAlarmLevel(e.value)}>{e.label}</Tag>
        ))}
        {(stationType !== '2') && 
          <Tag style={style} closable onClose={this.onCancelStationType}>{stationType === '0'?'风电':'光伏'}</Tag>}
        {selectedStation.size > 0 && selectedStation.map(e=>(
          <Tag style={style} closable onClose={()=>this.onCancelProvince(e)} key={e.getIn([0, 'provinceCode']).toString()} >
            {`${e.getIn([0, 'provinceName'])} ${e.size}`}
          </Tag>
        ))}
        {selectedDeviceType.size > 0 && selectedDeviceType.map(e=>(
          <Tag style={style} closable onClose={()=>this.onCancelDeviceType(e.get('deviceTypeCode').toString())} key={e.get('deviceTypeCode').toString()}>
            {e.get('deviceTypeName')}
          </Tag>
        ))}
        {warningConfigName.length>0&&alarmTypeArray.map(e=>(
          <Tag style={style} key={e.value} closable onClose={()=>this.onCancelAlarmType(e.value)}>{e.label}</Tag>
        ))}
        {startTime.length>0&&
          <Tag style={style} closable onClose={this.onCancelStartTimeRange}>
            发生时间{moment(startTime[0]).format('YYYY-MM-DD')}-{moment(startTime[1]).format('YYYY-MM-DD')}
          </Tag>
        }
        {endTime.length>0&&
          <Tag style={style} closable onClose={this.onCancelEndTimeRange}>
            结束时间{moment(endTime[0]).format('YYYY-MM-DD')}-{moment(endTime[1]).format('YYYY-MM-DD')}
          </Tag>
        }
        {warningStatus.length>0&&dealResultArray.map(e=>(
          <Tag style={style} key={e.value} closable onClose={()=>this.onCancelDealResult(e.value)}>{e.label}</Tag>
        ))}
        <span onClick={this.resetAll}>清空条件</span>
      </div>
    );
  }

}

export default HistoryFilteredItems;