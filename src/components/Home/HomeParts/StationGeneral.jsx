import React, { Component } from 'react';
import StationTypeTag from './StationTypeTag';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';

class StationGeneral extends Component{
  static propTypes = {
    realTimeInfo: PropTypes.object,
    hasMultipleType: PropTypes.bool,
    stations: PropTypes.array,
  }

  constructor(props){
    super(props);
    this.state = {
      generalType: 'all',
    }
  }

  changeGeneralType = (generalType) => {
    this.setState({ generalType });
  }

  numFormat = (data, outputArr = []) => {
    if(isNaN(data) || (data !== 0 && !data)){
      return [];
    }
    if( data > 1000){
      const intPart = parseInt(data / 1000);
      const demicalPart = `${data % 1000}`.padStart(3, 0);
      outputArr.unshift(demicalPart);
      this.numFormat(intPart, outputArr);
    }else{
      outputArr.unshift(data);
    }
    return outputArr;
  }

  render(){
    const { hasMultipleType, realTimeInfo } = this.props;
    const { generalType } = this.state;
    let dataSummary;
    if(generalType === 'all'){
      dataSummary = realTimeInfo.allSummary || {};
    }else if(generalType === 'wind'){
      dataSummary = realTimeInfo.windSummary || {};
    }else if(generalType === 'pv'){
      dataSummary = realTimeInfo.pvSummary || {};
    }
    const generalArr = [
      {value: dataSummary.stationCapacity, name: '装机容量', unit: 'MW'},
      {value: dataSummary.dayPower, name: '今日发电量', unit: '万kWh'},
      {value: dataSummary.stationCount, name: '电站数', unit: '个'},
      {value: dataSummary.monthPower, name: '月累计发电量', unit: '万kWh'},
      {value: dataSummary.stationUnitCount, name: '装机台数', unit: '台'},
      {value: dataSummary.yearPower, name: '年累计发电量', unit: '万kWh'},
    ];
    return (<section className={styles.stationGeneral}>
      <h3>电站概况</h3>
      {hasMultipleType && <div className={styles.checkTags}>
        <StationTypeTag showTotal activeType={generalType} onChange={this.changeGeneralType} />
      </div>}
      <div className={styles.generalBox}>
        {generalArr.map(e => {
          const dataValue = this.numFormat(e.value).join(',');
          return (
            <div key={e.name} className={styles.eachGeneral}>
              <div>
                <span className={styles.value}>{dataValue || '--'}</span>
                <span className={styles.unit}>{e.unit}</span>
              </div>
              <div className={styles.name}>{e.name}</div>
            </div>
          )
        })}
      </div>
    </section>)
  }
}

export default StationGeneral;
