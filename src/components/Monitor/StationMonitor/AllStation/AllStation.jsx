import React from 'react';
import PropTypes from 'prop-types';
import styles from './allStation.scss';
import AllStationHeader from './AllStationHeader.jsx'
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
    console.log(dataList);
    

    return (
      <div className={styles.allStationContainer}>
        <AllStationHeader {...this.props} />
        <Map testId="allstation_bmap_station" {...this.props} stationDataList={[]} />
      </div>
    )
  }
}


export default Allstation

