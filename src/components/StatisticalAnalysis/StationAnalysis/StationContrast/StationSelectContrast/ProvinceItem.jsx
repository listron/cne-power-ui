import React, { Component } from 'react';
import { Checkbox } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';

class ProvinceItem extends Component {
  static propTypes = {
    checkStation: PropTypes.func,
    multiple: PropTypes.bool,
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
    const { selectedStation, multiple } = this.props;
    const cancelCheck = selectedStation.some(e => e.stationCode === station.stationCode);
    let newStations = [];
    if (cancelCheck) {
      newStations = selectedStation.filter(e => e.stationCode !== station.stationCode);
    } else {
      newStations = multiple ? [station, ...selectedStation] : [station];
    }
    this.props.checkStation(newStations);
  }
  checkProvince = (e) => {
    const { checked } = e.target;
    const { selectedStation, provinceInfo } = this.props;
    let newSelectedStation = [];
    if (checked) {
      const tmpStations = selectedStation.filter(e => e.provinceCode !== provinceInfo.provinceCode);
      newSelectedStation = [...tmpStations, ...provinceInfo.stations];
    } else {
      newSelectedStation = selectedStation.filter(e => e.provinceCode !== provinceInfo.provinceCode);
    }
    this.props.checkStation(newSelectedStation);
  }

  render() {
    const { provinceInfo, selectedStation, multiple, disabledStation } = this.props;
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
          {provinceInfo.stations.map((m, i) => {
            const checked = selectedStation.some(e => e.stationCode === m.stationCode);
            const disableCheck = disabledStation.includes(m.stationCode);
            return (
              multiple ?
                <div
                  key={m.stationCode}
                  title={m.stationName}
                  className={`${styles.eachStation} ${checked ? styles.checked : styles.disabled} `}>
                  <Checkbox
                    // style={{ color: checked ? '#fff' : '#666' }}
                    onChange={() => this.checkStation(m)}
                    checked={checked}
                    disabled={disableCheck}
                  >
                    {m.stationName}
                  </Checkbox>
                </div> :
                <div
                  onClick={disableCheck ? null : () => this.checkStation(m)}
                  key={i}
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
