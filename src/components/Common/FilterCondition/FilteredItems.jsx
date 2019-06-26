import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './filterCondition.scss';
import moment from 'moment';
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
    docketTypes: PropTypes.array,
    warningLeveName: PropTypes.array,
    warningStatusName: PropTypes.array,
    warningLevel: PropTypes.array,
    warningStatus: PropTypes.array,
    warningConfigName: PropTypes.array,
    rangTime: PropTypes.array,
    endTime: PropTypes.array,
    onChangeFilter: PropTypes.func,
    defectLevelName: PropTypes.array,
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

  onCancelRangTime = () => { //取消发生时间
    const { onChangeFilter } = this.props;
    onChangeFilter({
      rangTime: [],
    })
  }
  onCancelRangEndTime = () => { //取消结束时间
    const { onChangeFilter } = this.props;
    onChangeFilter({
      endTime: [],
    })
  }


  onCancelStationType = () => {//取消电站类型
    const { onChangeFilter } = this.props;
    onChangeFilter({
      stationType: '', // 不选为全部
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
      deviceTypeCode: deviceTypeCode.filter(e => e !== `${cancelCode}`)
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
    const { belongMatrixs, onChangeFilter } = this.props;
    onChangeFilter({ belongMatrixs: belongMatrixs.filter(e => e !== matrixs), });
  }

  onCancelWarnLevel = (level) => {//删除某告警级别
    const { warningLevel, onChangeFilter } = this.props;
    onChangeFilter({
      warningLevel: warningLevel.filter(e => e !== level),
    });
  }
  onCancelWarnStatus = (status) => {//删除某告警状态类型
    const { warningStatus, onChangeFilter } = this.props;
    onChangeFilter({
      warningStatus: warningStatus.filter(e => e !== status),
    });
  }

  onCancelWarnType = (name) => { // 删除告警类型
    const { warningConfigName, onChangeFilter } = this.props;
    onChangeFilter({ warningConfigName: warningConfigName.filter(e => e !== name), });
  }

  onCancelDocketTypes = (types) => {
    const { docketTypes, onChangeFilter } = this.props;
    console.log('types', docketTypes, types)
    onChangeFilter({ docketTypes: docketTypes.filter(e => types.some(m => +m === e.code)) });
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
    const { onChangeFilter, createTimeEnd, createTimeStart, stationType, stationCodes, defectLevel, defectSource, deviceTypeCode, defectTypeCode, belongMatrixs, warningLevel, warningStatus, warningConfigName, rangTime, endTime, docketTypes } = this.props;
    const prams = {};
    createTimeEnd !== '' ? prams.createTimeEnd = '' : null;
    createTimeStart !== '' ? prams.createTimeStart = '' : null;
    stationType !== '' ? prams.stationType = '' : null;
    stationCodes.length > 0 ? prams.stationCodes = [] : null;
    defectLevel.length > 0 ? prams.defectLevel = [] : null;
    defectSource.length > 0 ? prams.defectSource = [] : null;
    deviceTypeCode.length > 0 ? prams.deviceTypeCode = [] : null;
    defectTypeCode.length > 0 ? prams.defectTypeCode = [] : null;
    belongMatrixs.length > 0 ? prams.belongMatrixs = [] : null;
    docketTypes.length > 0 ? prams.docketTypes = [] : null;
    warningLevel.length > 0 ? prams.warningLevel = [] : null;
    warningStatus.length > 0 ? prams.warningStatus = [] : null;
    warningConfigName.length > 0 ? prams.warningConfigName = [] : null;
    rangTime.length > 0 ? prams.rangTime = [] : null;
    endTime.length > 0 ? prams.endTime = [] : null;
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
    const { createTimeStart, createTimeEnd, stationType, stationCodes, deviceTypeCode, defectTypeCode, defectLevel, stations, defectSource, belongMatrixs, warningLevel, warningStatus, warningConfigName, rangTime, endTime, docketTypes } = this.props;
    const { docketTypeList, deviceTypes, defectTypes, defectSourceName, defectLevelName, warningLeveName, warningStatusName } = this.props;
    const levels = defectLevelName ? defectLevelName : ['A级', 'B级', 'C级'];
    let defectSourceNames = defectSourceName ? defectSourceName : ['告警', '上报', '巡检', '预警',];
    let warningLeveNames = warningLeveName ? warningLeveName : ['一级', '二级', '三级', '四级'];
    let warningStatusNames = warningStatusName ? warningStatusName : ['自动解除', '手动解除', '转工单'];
    const defectLevelArray = defectLevel.map(e => ({
      label: levels[+e - 1],
      value: e,
    })) || [];
    const defectSourceArray = defectSource.map(e => ({ // 缺陷来源
      label: defectSourceNames[+e],
      value: e,
    })) || [];

    const warningLevelArray = warningLevel.map(e => ({
      label: warningLeveNames[+e - 1],
      value: e,
    }))
    const warningStatusArray = warningStatus.map(e => ({
      label: warningStatusNames[+e > 0 ? +e - 1 : +e],
      value: e,
    }))

    const selectedStationArr = this.dealStations()
    const selectedDeviceType = deviceTypes.filter(e => deviceTypeCode.some(m => +m === e.deviceTypeCode));
    const selectedDocketType = docketTypeList.filter(e => docketTypes.some(m => `${m}` === `${e.code}`))
    const defectInfoArr = this.getDefectInfoArr(defectTypes, defectTypeCode); //选中的缺陷类型数组
    if (
      !createTimeStart &&
      !createTimeEnd &&
      (!stationType || +stationType === 2) &&
      stationCodes.length === 0 &&
      defectLevel.length === 0 &&
      defectSource.length === 0 &&
      deviceTypeCode.length === 0 &&
      defectTypeCode.length === 0 &&
      belongMatrixs.length === 0 &&
      docketTypes.length === 0 &&
      warningLevel.length === 0 &&
      warningStatus.length === 0 &&
      rangTime.length === 0 &&
      endTime.length === 0 &&
      warningConfigName.length === 0) {
      return null;
    }

    return (
      <div className={styles.filteredItems}>
        <span>已选条件</span>
        {createTimeStart && <Tag className={styles.tag} closable onClose={this.onCancelStartTime}>开始 {createTimeStart}</Tag>}
        {createTimeEnd && <Tag className={styles.tag} closable onClose={this.onCancelEndTime}>结束 {createTimeEnd}</Tag>}
        {rangTime.length > 0 && <Tag className={styles.tag} closable onClose={this.onCancelRangTime}>发生时间 {moment(rangTime[0]).format('YYYY-MM-DD')}~{moment(rangTime[1]).format('YYYY-MM-DD')}</Tag>}
        {endTime.length > 0 && <Tag className={styles.tag} closable onClose={this.onCancelRangEndTime}>结束时间 {moment(endTime[0]).format('YYYY-MM-DD')}~{moment(endTime[1]).format('YYYY-MM-DD')}</Tag>}
        {stationType && <Tag className={styles.tag} closable onClose={this.onCancelStationType}>{stationType === '0' ? '风电' : '光伏'}</Tag>}
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
        {deviceTypeCode.length > 0 && selectedDeviceType.map((e, index) => ( // 设备类型
          <Tag className={styles.tag} closable onClose={() => this.onCancelDeviceType(e.deviceTypeCode)} key={index}>
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

        {warningLevel.length > 0 && warningLevelArray.map(e => ( // 告警级别
          <Tag className={styles.tag} key={e.value} closable onClose={() => this.onCancelWarnLevel(e.value)}>{e.label}</Tag>
        ))}
        {warningStatus.length > 0 && warningStatusArray.map(e => ( // 告警状态的类型
          <Tag className={styles.tag} key={e.value} closable onClose={() => this.onCancelWarnStatus(e.value)}>{e.label}</Tag>
        ))}

        {warningConfigName.length > 0 && warningConfigName.map(e => ( // 告警类型
          <Tag className={styles.tag} key={e} closable onClose={() => this.onCancelWarnType(e)}>{e}</Tag>
        ))}

        {docketTypes.length > 0 && selectedDocketType.map(e => (//  两票类型
          <Tag className={styles.tag} closable onClose={() => this.onCancelDocketTypes(e)} key={e.id}>
            {e.name}
          </Tag>
        ))}
        <span onClick={this.resetAll} className={styles.clearAll}>清空条件</span>
      </div>
    );
  }

}

export default FilteredItems;