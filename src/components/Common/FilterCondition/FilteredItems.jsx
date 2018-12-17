import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './filterCondition.scss';

class FilteredItems extends Component {
  static propTypes = {
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
    defectTypes: PropTypes.array,
    stationType: PropTypes.string,
    stationCodes: PropTypes.array,
    defectLevel: PropTypes.array,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    deviceTypeCode: PropTypes.array,
    defectTypeCode: PropTypes.array,
    defectSource: PropTypes.array,
    defectSourceName: PropTypes.array,
    belongMatrixs: PropTypes.array,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      visiable: false
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
    onChangeFilter({
      stationCodes: stationCodes.filter(code => !cancelStations.some(staionCode => staionCode === code)),
    });
  }

  onCancelDeviceType = (cancelCode) => {//删除某设备类型
    const { deviceTypeCode, onChangeFilter } = this.props;
    onChangeFilter({
      deviceTypeCode: deviceTypeCode.filter(e => e !== cancelCode)
    });
  }

  onCancelDefectLevel = (level) => {//删除某缺陷级别
    const { defectLevel, onChangeFilter } = this.props;
    onChangeFilter({
      defectLevel: defectLevel.filter(e => e !== level),
    });
  }

  onCancelDefectSource = (source) => { // 删除某缺陷来源
    const { defectSource, onChangeFilter } = this.props;
    onChangeFilter({
      defectSource: defectSource.filter(e => e !== source),
    });
  }

  onCancelDefectType = (cancelId) => { // 删除某缺陷类型
    const { defectTypeCode, onChangeFilter } = this.props;
    onChangeFilter({ defectTypeCode: defectTypeCode.filter(e => e !== cancelId), });
  }

  onCancelBelongMatrixs = (matrixs) => { // 删除所属方阵
    const { defectTypeCode, onChangeFilter } = this.props;
    onChangeFilter({ defectTypeCode: defectTypeCode.filter(e => e !== matrixs), });
  }

  getDefectInfoArr = (defectTypes, selectedTypes) => {
    let defectInfoArr = [];
    defectTypes.forEach(e => {
      if (e.list && e.list.length > 0) {
        defectInfoArr.push(...this.getDefectInfoArr(e.list, selectedTypes));
      }
      if (selectedTypes.includes(e.id)) {
        defectInfoArr.push({
          name: e.name,
          id: e.id
        })
      }
    })
    return defectInfoArr;
  }

  resetAll = () => {//删除所有筛选条件
    const { onChangeFilter, createTimeEnd, createTimeStart, stationType, stationCodes, defectLevel, defectSource, deviceTypeCode, defectTypeCode,belongMatrixs } = this.props;
    const prams = {};
    createTimeEnd !== '' ? prams.createTimeEnd = '' : null;
    createTimeStart !== '' ? prams.createTimeStart = '' : null;
    stationType !== '2' ? prams.stationType = '2' : null;
    stationCodes.length>0? prams.stationCodes = [] : null;
    defectLevel.length>0? prams.defectLevel = [] : null;
    defectSource.length>0? prams.defectSource = [] : null;
    deviceTypeCode.length>0? prams.deviceTypeCode = [] : null;
    defectTypeCode.length>0? prams.defectTypeCode = [] : null;
    belongMatrixs.length>0? prams.belongMatrixs = [] : null;
    onChangeFilter(prams);
  }

  dealStations = () => {
    const { stations, stationCodes } = this.props;
    const selectedStation = stations.filter((e) => {
      if (stationCodes.some(m => m === e.stationCode)) { return e }
    })
    let provinceCode = [...new Set(selectedStation.map(e => e.provinceCode))]
    let selectedStationArr = [];
    let provinceStation = provinceCode.map(e => {
      return selectedStation.filter(item => item.provinceCode === e)
    })
    provinceStation.forEach((item, index) => {
      let stationCode = [];
      item.forEach((list) => {
        stationCode.push(list.stationCode)
      })
      selectedStationArr.push({
        stationCode,
        provinceName: item[0].provinceName
      })
    })
    return selectedStationArr
  }

  render() {
    const { createTimeStart, createTimeEnd, stationType, stationCodes, deviceTypeCode, defectTypeCode, defectLevel, stations, deviceTypes, defectTypes, defectSource, defectSourceName ,belongMatrixs} = this.props;

    const levels = ['一级', '二级', '三级', '四级'];
    let defectSourceNames = defectSourceName ? defectSourceName : ['告警','上报','巡检', '预警',];
    const defectLevelArray = defectLevel.map(e => ({
      label: levels[+e - 1],
      value: e,
    })) || [];
    const defectSourceArray = defectSource.map(e => ({
      label: defectSourceNames[+e - 1],
      value: e,
    })) || [];
    const selectedStationArr = this.dealStations()
    const selectedDeviceType = deviceTypes.filter(e => deviceTypeCode.some(m => m === e.deviceTypeCode));
    const defectInfoArr = this.getDefectInfoArr(defectTypes, defectTypeCode); //选中的缺陷类型数组
    if (createTimeStart === '' && createTimeEnd === '' && stationType === '2' && stationCodes.length === 0 && defectLevel.length === 0 && defectSource.length === 0 && deviceTypeCode.length === 0 && defectTypeCode.length === 0 && belongMatrixs.length===0) {
      return null;
    }

    return (
      <div className={styles.filteredItems}>
        <span>已选条件</span>
        {createTimeStart !== '' && <Tag className={styles.tag} closable onClose={this.onCancelStartTime}>开始 {createTimeStart}</Tag>}
        {createTimeEnd !== '' && <Tag className={styles.tag} closable onClose={this.onCancelEndTime}>结束 {createTimeEnd}</Tag>}
        {stationType !== '2' && <Tag className={styles.tag} closable onClose={this.onCancelStationType}>{stationType === '0' ? '风电' : '光伏'}</Tag>}
        {stationCodes.length > 0 && selectedStationArr.map(e => {// 电站名称
          return (<Tag className={styles.tag} closable onClose={() => this.onCancelProvince(e.stationCode)} key={e.provinceName} >
            {`${e.provinceName} ${e.stationCode.length}`}
          </Tag>)
        })}
        {defectLevel.length > 0 && defectLevelArray.map(e => ( // 缺陷级别
          <Tag className={styles.tag} key={e.value} closable onClose={() => this.onCancelDefectLevel(e.value)}>{e.label}</Tag>
        ))}
        {defectSource.length > 0 && defectSourceArray.map(e => ( // 缺陷来源
          <Tag className={styles.tag} key={e.value} closable onClose={() => this.onCancelDefectSource(e.value)}>{e.label}</Tag>
        ))}
        {deviceTypeCode.length > 0 && selectedDeviceType.map(e => ( // 设备类型
          <Tag className={styles.tag} closable onClose={() => this.onCancelDeviceType(e.deviceTypeCode)} key={e.getdeviceTypeCode}>
            {e.deviceTypeName}
          </Tag>
        ))}

        {defectInfoArr.length > 0 && defectInfoArr.map(e => (//  缺陷类型
          <Tag className={styles.tag} closable onClose={() => this.onCancelDefectType(e.id)} key={e.id}>
            {e.name}
          </Tag>
        ))}

        {belongMatrixs.length > 0 && belongMatrixs.map(e => (//  所属方阵
          <Tag className={styles.tag} closable onClose={() => this.onCancelBelongMatrixs(e)} key={e}>
            {e}
          </Tag>
        ))}
        <span onClick={this.resetAll} className={styles.clearAll}>清空条件</span>
      </div>
    );
  }

}

export default FilteredItems;