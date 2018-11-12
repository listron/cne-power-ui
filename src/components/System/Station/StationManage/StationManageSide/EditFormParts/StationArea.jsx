





import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd';
import PropTypes from 'prop-types';
import styles from '../stationSide.scss';
const { Option } = Select;

class StationArea extends Component{
  static propTypes = {
    value: PropTypes.array,
    provinces: PropTypes.array,
    cityData: PropTypes.array,
    countyData: PropTypes.array,
    onChange: PropTypes.func,
    getStationTargetInfo: PropTypes.func,
  }

  selectProvince = (e)=>{
    const { onChange, getStationTargetInfo } = this.props;
    getStationTargetInfo({
      params: {dictionaryType: 4, area: e},
      resultName: 'cityData'
    })
    onChange([e, null, null]);
  }

  selectCity = (e)=>{
    const { onChange, value, getStationTargetInfo } = this.props;
    getStationTargetInfo({
      params: {dictionaryType: 4, area: e},
      resultName: 'countyData'
    })
    onChange([value[0], e, null ]);
  }

  selectCounty = (e)=>{
    const { onChange, value } = this.props;
    onChange([value[0], value[1], e]);
  }

  render(){
    const {value, provinces, cityData, countyData } = this.props;
    const [province, city, county] = value;
    return (<div className={styles.stationArea}>
      <Select defaultValue={province} onChange={this.selectProvince} placeholder="省" dropdownClassName={styles.areaClass}>
        {provinces && provinces.map(e=>(
          <Option key={e.id} value={e.id}>{e.areaName}</Option>
        ))}
      </Select>
      <Select defaultValue={city} onChange={this.selectCity} placeholder="市" dropdownClassName={styles.areaClass} >
        {cityData.map(e=>(
          <Option key={e.id} value={e.id}>{e.areaName}</Option>
        ))}
      </Select>
      <Select defaultValue={county} onChange={this.selectCounty} placeholder="县" dropdownClassName={styles.areaClass}>
        {countyData.map(e=>(
          <Option key={e.id} value={e.id}>{e.areaName}</Option>
        ))}
      </Select>
    </div>)
  }
}

export default StationArea;
