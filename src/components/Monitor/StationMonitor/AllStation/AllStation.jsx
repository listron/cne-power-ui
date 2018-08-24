import React from 'react';
import PropTypes from 'prop-types';
import styles from './allStation.scss';
import AllStationHeader from './AllStationHeader.jsx'
import Map from './Map.jsx'
class Allstation extends React.Component {
  static propTypes = {
    allMonitorStation: PropTypes.object,
    stationDataList: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {

  }

  render() {
    const { allMonitorStation } = this.props;
    const stationDataList = allMonitorStation.stationDataList || [];
    //console.log(stationDataList);

    let iconArray = [
      {
        "400": ['image://./img/wind-normal.png', 'image://./img/wind-alert.png'],
        "500": 'image://./img/wind-cutdown.png',
        "900": 'image://./img/wind-unconnected.png'
      },
      {
        "400": ['image://./img/pv-normal.png', 'image://./img/pv-alert.png'],
        "500": 'image://./img/pv-cutdown.png',
        "900": 'image://./img/pv-unconnected.png'
      },

    ]
    let data = [];
    // console.log(stationDataList)
    stationDataList.forEach((item, index) => {
      let stationStatusAll = item.stationStatus || [];
      let stationStatus = stationStatusAll.stationStatus || "";
      //console.log(stationStatus)
      const stationType = item.stationType || "";
      const currentStationType=iconArray[item.stationType]||{};
      // console.log(currentStationType);
      const currentStationStatus=currentStationType[stationStatus]||'';
       //console.log(currentStationType[stationStatus]);


      //const num='400';
     
        data.push({
        name: item.stationName,
        value: [item.longitude, item.latitude, stationType, stationStatus],
        symbol: stationStatus === "400" ? currentStationStatus[item.alarmNum ? 1 : 0] : currentStationStatus,

        alarmNum: item.alarmNum,
        stationPower: item.stationPower,
        stationCapacity: item.stationCapacity,
        instantaneous: item.instantaneous
      })
    
    })
     //console.log(data);

    return (
      <div className={styles.allStationContainer}>
        <AllStationHeader {...this.props} />
        <Map testId="allstation_bmap_station" {...this.props} stationDataList={data} />
      </div>
    )
  }
}
export default Allstation

