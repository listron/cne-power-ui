import React, { Component } from 'react';
import { Checkbox, Button  } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';

class ProvinceItem extends Component {
  static propTypes = {
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
    const { provinceInfo, disableStation } = this.props;
    return (
      <div className={styles.provinceItem}>
        <span className={styles.name}>{provinceInfo.provinceName}</span>
        <div className={styles.stationList}>
          {provinceInfo.stations.map(m=>{
            const buttonDisable = disableStation.some(e=>e.stationCode === m.stationCode);
            return (<Button 
              disabled={buttonDisable}
              key={m.stationCode} 
              onClick={()=>this.checkStation(m)}
              className={styles.eachStation}
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