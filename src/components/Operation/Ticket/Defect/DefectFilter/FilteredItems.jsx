import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './defectFilter.scss';

class FilteredItems extends Component {
  static propTypes = {
    stations: PropTypes.object,
    deviceTypes: PropTypes.object,
    defectTypes: PropTypes.object,
    stationType: PropTypes.string,
    stationCodes: PropTypes.string,  
    defectLevel: PropTypes.string, 
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string, 
    deviceTypeCode: PropTypes.string,
    defectTypeCode: PropTypes.string,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  onCancelStartTime = () => {//取消开始时间
    const { onChangeFilter } = this.props;
    onChangeFilter({
      createTimeStart: '',
    });
  }
  onCancelEndTime = () => { //取消结束时间
    const { onChangeFilter } = this.props;
    onChangeFilter({
      createTimeEnd: '',
    })
  }
  onCancelStationType = () => {//取消电站类型
    const { onChangeFilter } = this.props;
    onChangeFilter({
      stationType: '2',
    })
  }
  onCancelProvince = (cancelStations) => {//删除某省电站
    const { stationCodes, onChangeFilter } = this.props;
    const newStationCode = stationCodes.split(',').filter(code=>
      !cancelStations.some(station=>station.get('stationCode').toString()===code)
    );
    onChangeFilter({
      stationCodes: newStationCode,
    });

  }
  onCancelDeviceType = (cancelCode) => {//删除某设备类型
    const { deviceTypeCode, onChangeFilter } = this.props;
    const newDeviceTypeCode = deviceTypeCode.split(',').filter(e=>e!==cancelCode);
    onChangeFilter({
      deviceTypeCode: newDeviceTypeCode
    });
  } 
  onCancelLevel = (level) => {//删除某级告警
    const { defectLevel, onChangeFilter } = this.props;
    const levelCodes = defectLevel.split(',').filter(e=>e!==level);
    onChangeFilter({
      defectLevel: levelCodes,
    });
  }
  resetAll = () => {//删除所有筛选条件
    const { onChangeFilter } = this.props;
    onChangeFilter({
      createTimeStart: '',
      createTimeEnd: '',
      stationType: '2',
      stationCodes: '',
      deviceTypeCode: '',
      defectLevel: '0',
      defectTypeCode: '',
    })
  }

  render() {
    const {createTimeStart, createTimeEnd, stationType, stationCodes, deviceTypeCode, defectTypeCode, defectLevel, stations, deviceTypes, defectTypes } = this.props;
    const levels = ['一级','二级','三级','四级'];
    const defectLevelArray = defectLevel!=='0'?defectLevel.split(',').map(e=>({
      label: levels[parseInt(e)-1],
      value: e,
    })):[];
    const tmpSelectedDeviceType = deviceTypeCode.split(',');//选中设备类型的数组
    const tmpSelectedStation = stationCodes.split(',');//选中电站的数组
    const tmpSelectedDefectType = defectTypeCode.split(',')//选中缺陷类型的数组
    const selectedStation = stations.filter(e=>
      tmpSelectedStation.some(m=>
        m === e.get('stationCode').toString()
      )).groupBy(item=>item.get('provinceCode')).toList();//选中电站详情,按省分组
    const selectedDeviceType = deviceTypes.filter(e=>tmpSelectedDeviceType.some(m=>m===e.get('deviceTypeCode').toString()));//选中的设备类型详情
    const selectedDefectType = defectTypes.filter(e=>tmpSelectedDefectType.some(m=>m===e.get('defectTypeCode').toString()));//选中的缺陷类型详情
    if(createTimeStart===''&&createTimeEnd===''&&stationType==='2'&&stationCodes===''&&deviceTypeCode===''&&defectLevel==='0'&&defectTypeCode==='') {
      return null;
    }
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
    return (
      <div className={styles.filteredItems}>
        <span>已选条件</span>
        {createTimeStart !== '' && <Tag style={style} closable onClose={this.onCancelStartTime}>开始 {createTimeStart}</Tag>}
        {createTimeEnd !== '' && <Tag style={style} closable onClose={this.onCancelEndTime}>结束 {createTimeEnd}</Tag>}
        {stationType !== '2' && <Tag style={style} closable onClose={this.onCancelStationType}>{stationType === '0'?'风电':'光伏'}</Tag>}
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
        {defectLevelArray.length > 0 && defectLevelArray.map(e=>(
          <Tag style={style} key={e.value} closable onClose={()=>this.onCancelLevel(e.value)}>{e.label}</Tag>
        ))}
        {selectedDefectType.size > 0 && selectedDefectType.map(e=>(
          <Tag style={style} closable onClose={()=>this.onCancelDeviceType(e.get('defectTypeCode').toString())} key={e.get('defectTypeCode').toString()}>
            {e.get('defectTypeName')}
          </Tag>
        ))}
        <Tag closable onClose={this.resetAll} >清空条件</Tag>
      </div>
    );
  }

}

export default FilteredItems;