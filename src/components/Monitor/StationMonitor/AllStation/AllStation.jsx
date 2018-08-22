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
    if(allMonitorStation===null||'')return '';
    const stationDataList = allMonitorStation.stationDataList || [];
    console.log(stationDataList);
  
    let iconArray = [
      //{400:'image://./img/wind-normal.png',500:'image://./img/wind-alert.png',900:'/img/wind-normal.png'},//这是测试用的图标
       {400:['image://./img/wind-normal.png','image://./img/wind-alert.png'],500:'image://./img/wind-normal.png',900:'image://./img/wind-normal.png'},
      //{400:'image://./img/pv-normal.png',500:'/img/wind-normal.png',900:'image://./img/pv-alert.png'},
       {400:['image://./img/pv-normal.png','image://./img/pv-alert.png'],500:'image://./img/pv-normal.png',900:'image://./img/pv-alert.png'},
 
    ]
    let data = [];
    stationDataList.forEach((item, index) => {
      data.push({
        name: item.stationName,
        value: [item.longitude, item.latitude, item.stationType, item.stationStatus.stationStatus],
        //symbol: [iconArray[item.stationType][item.stationStatus.stationStatus]][0],
        symbol: [iconArray[item.stationType][item.stationStatus.stationStatus===400?item.stationStatus.stationStatus[item.alarmNum?1:0]:item.stationStatus.stationStatus]][0]||'image://./img/pv-normal.png',
       
        alarmNum: item.alarmNum,
        stationPower: item.stationPower,
        stationCapacity: item.stationCapacity,
        instantaneous: item.instantaneous
      })
    })
    console.log(data);

    return (
      <div className={styles.allStationContainer}>
        <AllStationHeader {...this.props} />
        <Map testId="allstation_bmap_station" {...this.props} stationDataList={data} />
      </div>
    )
  }
}
export default Allstation

