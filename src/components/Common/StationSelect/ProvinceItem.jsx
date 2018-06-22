import React, { Component } from 'react';
import { Icon, Checkbox  } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';

class ProvinceItem extends Component {
  static propTypes = {
    checkStation: PropTypes.func,
    multiple: PropTypes.bool,
    provinceInfor: PropTypes.object,
    selectedStation: PropTypes.array,
  }
  
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  checkStation = (station) => {
    const { selectedStation, multiple } = this.props;
    let cancelCheck = selectedStation.some(e=>e.stationCode===station.stationCode)
    let newStations = [];
    if(cancelCheck){
      newStations = selectedStation.filter(e=>e.stationCode!==station.stationCode);
    }else{
      newStations = multiple?[station,...selectedStation]:[station];
    }
    this.props.checkStation(newStations)
  }
  checkProvince = (e) => {
    const { checked } = e.target;
    const { selectedStation, provinceInfor } = this.props;
    let newSelectedStation = [];
    if(checked){
      let tmpStations = selectedStation.filter(e=>e.provinceCode !== provinceInfor.provinceCode)
      newSelectedStation = [...tmpStations, ...provinceInfor.stations]
    }else{
      newSelectedStation = selectedStation.filter(e=>e.provinceCode !== provinceInfor.provinceCode)
    }
    this.props.checkStation(newSelectedStation)
  }

  render() {
    const { provinceInfor, selectedStation, multiple } = this.props;
    let filterdStations = selectedStation.filter(e=>e.provinceCode === provinceInfor.provinceCode)
    let provinceChecked = false, indeterminate = false;
    if(filterdStations.length > 0 && filterdStations.length < provinceInfor.stations.length ){
      indeterminate = true
    }else if(filterdStations.length === provinceInfor.stations.length ){
      provinceChecked = true;
    }
    return (
      <div className={styles.provinceItem}>
        {multiple ? <Checkbox onChange={this.checkProvince} checked={provinceChecked} indeterminate={indeterminate}>{provinceInfor.provinceName}</Checkbox>:<span>{provinceInfor.provinceName}</span>}
        <div className={styles.stationList}>
          {provinceInfor.stations.map(m=>{
            let checked = selectedStation.some(e=>e.stationCode===m.stationCode)
            return <div onClick={()=>this.checkStation(m)} key={m.stationCode} style={{'backgroundColor':checked?'yellowgreen':'transparent'}} className={styles.eachStation} > <span>{ m.stationName }</span> <Icon type="check-circle-o" /> </div>
          })}
        </div>
        
      </div>
    )
  }
}
export default ProvinceItem;