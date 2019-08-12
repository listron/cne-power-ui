import React from 'react';
import PropTypes from 'prop-types';
import styles from './allStation.scss';
import AllStationHeader from './AllStationHeader.jsx'
import Map from './Map.jsx'
class Allstation extends React.Component {
  static propTypes = {
    allMonitorStation: PropTypes.object,
    monitorPvUnit: PropTypes.object,
    getRealMonitorData: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    this.props.getRealMonitorData({ stationType: '2' })
  }

  render() {
    const { monitorPvUnit, allMonitorStation } = this.props;
    const { realTimePowerUnit, realCapacityUnit, realTimePowerPoint, realCapacityPoint, } = monitorPvUnit;
    const stationDataList = allMonitorStation.stationDataList || [];
    let iconArray = [
      {
        "400": ['image:///img/wind01.png', 'image:///img/wind02.png'],
        "500": 'image:///img/cutdown.png',
        "900": 'image:///img/wind04.png'
      },
      {
        "400": ['image:///img/pv01.png', 'image:///img/pv02.png'],
        "500": 'image:///img/pv03.png',
        "900": 'image:///img/pv04.png'
      },
    ]
    let data = [];
    stationDataList.forEach((item, index) => {
      let stationStatusAll = item.stationStatus || {};
      let stationStatus = stationStatusAll.stationStatus || "";
      const stationType = item.stationType || "";
      const currentStationType = iconArray[item.stationType] || {};
      const currentStationStatus = currentStationType[stationStatus] || '';
      data.push({
        name: item.stationName,
        value: [item.longitude, item.latitude, stationType, stationStatus],
        symbol: stationStatus === "400" ? currentStationStatus[item.alarmNum ? 1 : 0] : currentStationStatus,
        symbolSize: stationType > 0 ? [30, 20] : [31, 36],
        alarmNum: item.alarmNum,
        stationPower: (realTimePowerUnit === 'MW' ? (+item.stationPower) : (+item.stationPower * 1000)).toFixed(realTimePowerPoint),
        stationCapacity: (realCapacityUnit === 'MW' ? (+item.stationCapacity) : (+item.stationCapacity * 1000)).toFixed(realCapacityPoint),
        instantaneous: item.instantaneous,
        stationCode: item.stationCode,
        realTimePowerUnit,
        realCapacityUnit
      })
    })

    return (
      <div className={styles.allStationContainer}>
        <AllStationHeader {...this.props} />
        <Map testId="allstation_bmap_station" {...this.props} stationDataList={data} />
      </div>
    )
  }
}
export default Allstation

