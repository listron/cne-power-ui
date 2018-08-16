import React from 'react';
import PropTypes from 'prop-types';
import styles from './allStation.scss';
import AllStationHeader from './allStationHeader.jsx'
import Map from './map.jsx'
class Allstation extends React.Component {
  static propTypes = {
    allMonitorStation:PropTypes.object,
    stationDataList:PropTypes.array,
  }
  constructor(props, context) {
    super(props, context)
  }
componentDidMount(){
   
}

  render() {
    const{allMonitorStation}=this.props;
    const stationDataList=allMonitorStation.stationDataList || [];
    console.log(stationDataList);
    const dataList=[];
    stationDataList.forEach((item,index)=>{
      dataList.push([item.longitude,item.latitude])
    })
    console.log(dataList,'处理的经纬度数据');
    

    return (
      <div className={styles.allStationContainer}>
        <AllStationHeader {...this.props} />
        <Map testId="allstation_bmap_station" {...this.props} stationDataList={dataList} />
      </div>
    )
  }
}


export default Allstation

