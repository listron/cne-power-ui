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
      {400:'circle',500:'triangle',900:'roundRect'},
      {400:'arrow',500:'diamond',900:'diamond'}
 
    ]
    let data = [];
    stationDataList.forEach((item, index) => {
      data.push({
        name: item.stationName,
        value: [item.longitude, item.latitude, item.stationType, item.stationStatus.stationStatus],
        symbol: [iconArray[item.stationType][item.stationStatus.stationStatus?item.stationStatus.stationStatus:'500']],
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

