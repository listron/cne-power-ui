import React, { Component } from 'react';
import StationTypeTag from './StationTypeTag';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';

class StationGeneral extends Component{
  static propTypes = {
    hasMultipleType: PropTypes.bool,
    stations: PropTypes.array,
  }

  constructor(props){
    super(props);
    this.state = {
      generalType: 'all'
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
      const intPart = parseInt(data/1000);
      const demicalPart = data%1000 || '000';
      outputArr.unshift(demicalPart);
      this.numFormat(intPart, outputArr);
    }else{
      outputArr.unshift(data);
    }
    return outputArr;
  }

  render(){
    const generalArr = [
      {value: 30000, name: '装机容量', unit: 'MW'},
      {value: 2354, name: '今日发电量', unit: '万kWh'},
      {value: 88, name: '电站数', unit: '个'},
      {value: 2333, name: '月累计发电量', unit: '万kWh'},
      {value: 6000, name: '装机台数', unit: '台'},
      {value: 90000, name: '年累计发电量', unit: '万kWh'},
    ];
    const { hasMultipleType } = this.props;
    const { generalType } = this.state;
    return (<section className={styles.stationGeneral}>
      <h3>电站概况</h3>
      {hasMultipleType && <div className={styles.checkTags}>
        <StationTypeTag showTotal activeType={generalType} onChange={this.changeGeneralType} />
      </div>}
      {generalArr.map(e => {
        const dataValue = this.numFormat(e.value).join(',');
        return (
          <div key={e.name} className={styles.eachGeneral}>
            <div>
              <span className={styles.value}>{dataValue}</span>
              <span className={styles.unit}>{e.unit}</span>
            </div>
            <div className={styles.name}>{e.name}</div>
          </div>
        )
      })}
    </section>)
  }
}

export default StationGeneral;
