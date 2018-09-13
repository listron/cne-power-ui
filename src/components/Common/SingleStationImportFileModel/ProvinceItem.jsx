import React, { Component } from 'react';
import { Checkbox, Button  } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';

class ProvinceItem extends Component {
  static propTypes = {
    selectedStation: PropTypes.object,
    checkStation: PropTypes.func,
    provinceInfo: PropTypes.object,
    disableStation: PropTypes.array,
  }
  
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  checkStation = (station) => {
    this.props.checkStation(station)
  }

  render() {
    const { provinceInfo, disableStation, selectedStation } = this.props;
    return (
      <div className={styles.provinceItem}>
        <span className={styles.name}>{provinceInfo.provinceName}</span>
        <div className={styles.stationList}>
          {provinceInfo.stations.map(m=>{
            const buttonDisable = disableStation.some(e=>e.stationCode === m.stationCode);
            const selected = selectedStation.stationCode === m.stationCode;
            const selectedStyle = {color: '#fff', backgroundColor:'#199475'}
            return (<Button 
              disabled={buttonDisable}
              key={m.stationCode} 
              onClick={()=>this.checkStation(m)}
              className={styles.eachStation}
              style={selected?{...selectedStyle}:{}}
            >
              {m.stationName}
            </Button>)
          })}
        </div>  
      </div>
    )
  }
}
export default ProvinceItem;