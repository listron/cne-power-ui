import React, { Component } from 'react';
import { Checkbox, message } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';

class ProvinceItem extends Component {
  static propTypes = {
    checkStation: PropTypes.func,
    multiple: PropTypes.bool,
    oneStyleOnly: PropTypes.bool,
    provinceInfo: PropTypes.object,
    selectedStation: PropTypes.array,
    disabledStation: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }
  checkStation = (station) => {
    const { selectedStation, multiple, oneStyleOnly } = this.props;
    const cancelCheck = selectedStation.some(e => e.stationCode === station.stationCode);
    let newStations = [];
    if (cancelCheck) {
      newStations = selectedStation.filter(e => e.stationCode !== station.stationCode);
    } else {
      const hasMultipleStyle = multiple && oneStyleOnly && selectedStation.find(e => e.reportType !== station.reportType);
      if (hasMultipleStyle) { // 选中了多种电站
        message.error('请选择同为集中式或分布式的电站!');
        return;
      }
      newStations = multiple ? [station, ...selectedStation] : [station];
    }
    this.props.checkStation(newStations);
  }
  checkProvince = (e) => {
    const { checked } = e.target;
    const { selectedStation, provinceInfo, oneStyleOnly } = this.props;
    let newSelectedStation = [];
    if (checked) {
      const tmpStations = selectedStation.filter(e => e.provinceCode !== provinceInfo.provinceCode);
      newSelectedStation = [...tmpStations, ...provinceInfo.stations];
      if (oneStyleOnly) { // 只能选一种类型电站
        const stationTypeSet = new Set();
        newSelectedStation.forEach(e => { stationTypeSet.add(e.reportType); });
        if (stationTypeSet.size > 1) { // 选择了多种类型电站
          message.error('请选择同为集中式或分布式的电站!');
          return;
        }
      }
    } else {
      newSelectedStation = selectedStation.filter(e => e.provinceCode !== provinceInfo.provinceCode);
    }
    this.props.checkStation(newSelectedStation);
  }

  render() {
    const { provinceInfo, selectedStation, multiple, disabledStation } = this.props;
    // console.log(selectedStation)
    const filterdStations = selectedStation.filter(e => e.provinceCode === provinceInfo.provinceCode);
    let provinceChecked = false, indeterminate = false;
    if (filterdStations.length > 0 && filterdStations.length < provinceInfo.stations.length) {
      indeterminate = true;
    } else if (filterdStations.length === provinceInfo.stations.length) {
      provinceChecked = true;
    }
    return (
      <div className={styles.provinceItem}>
        {multiple ?
          <Checkbox
            style={{ marginBottom: 10 }}
            onChange={this.checkProvince}
            checked={provinceChecked}
            indeterminate={indeterminate}>
            {provinceInfo.provinceName}
          </Checkbox> :
          <span className={styles.name} title={provinceInfo.provinceName} >{provinceInfo.provinceName}</span>
        }
        <div className={styles.stationList}>
          {provinceInfo.stations.map(m => {
            const checked = selectedStation.some(e => e.stationCode === m.stationCode);
            const disableCheck = disabledStation.includes(m.stationCode);
            return (
              multiple ?
                <div
                  // onClick={()=>this.checkStation(m)} 
                  key={m.stationCode}
                  title={m.stationName}
                  className={`${styles.eachStation} ${checked ? styles.checked : styles.disabled} `}>
                  <Checkbox
                    // style={{ color: checked ? '#fff' : '#353535' }}
                    onChange={() => this.checkStation(m)}
                    checked={checked}
                    disabled={disableCheck}
                  >
                    {m.stationName}
                  </Checkbox>
                </div> :
                <div
                  onClick={disableCheck ? null : () => this.checkStation(m)}
                  key={m.stationCode}
                  style={{ cursor: disableCheck ? 'not-allowed' : 'pointer' }}
                  className={`${styles.eachStation} ${checked ? styles.checked : styles.disabled} `}>
                  <span title={m.stationName} className={styles.eachStationName}>{m.stationName}</span>
                </div>
            );
          })}
        </div>
      </div>
    );
  }
}
export default ProvinceItem;
