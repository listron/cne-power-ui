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
    console.log(stationDataList);
    // const dataList=[];
    // stationDataList.forEach((item,index)=>{
    //   dataList.push([item.longitude,item.latitude])
    // })
    // console.log(dataList,'处理的经纬度数据');
    let iconArray = [
      'triangle',									//三角形
      'diamond',									//菱形									
      'arrow',                    //箭头

    ]
    let data = [];
    stationDataList.forEach((item, index) => {
      data.push({
        name: item.stationName,
        value: [item.longitude, item.latitude, item.stationType, item.stationStatus.stationStatus],
        symbol: [iconArray[item.stationType]],
        alarmNum: item.alarmNum,
        stationPower: item.stationPower,
        stationCapacity: item.stationCapacity,
        instantaneous: item.instantaneous
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

