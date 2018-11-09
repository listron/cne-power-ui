





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
    const { onChange, value, getStationTargetInfo } = this.props;
    getStationTargetInfo({
      params: {dictionaryType: 4, area: e},
      resultName: 'cityData'
    })
    onChange([e, value[1], value[2]]);
  }

  selectCity = (e)=>{
    const { onChange, value, getStationTargetInfo } = this.props;
    getStationTargetInfo({
      params: {dictionaryType: 4, area: e},
      resultName: 'countyData'
    })
    onChange([value[0], e, value[1] ]);
  }

  selectCounty = (e)=>{
    const { onChange, value } = this.props;
    onChange([value[0], value[1], e]);
  }

  render(){
    const {value, provinces, cityData, countyData } = this.props;
    const [province, city, county] = value;
    return (<div className={styles.stationArea}>
      <Select value={province} onChange={this.selectProvince} placeholder="省" dropdownClassName={styles.areaClass}>
        {provinces && provinces.map(e=>(
          <Option key={e.id} value={e.id}>{e.areaName}</Option>
        ))}
      </Select>
      <Select value={city} onChange={this.selectCity} placeholder="市" dropdownClassName={styles.areaClass} >
        {cityData.map(e=>(
          <Option key={e.id} key={e.id}>{e.areaName}</Option>
        ))}
      </Select>
      <Select value={county} onChange={this.selectCounty} placeholder="县" dropdownClassName={styles.areaClass}>
        {countyData.map(e=>(
          <Option key={e.id} key={e.id}>{e.areaName}</Option>
        ))}
      </Select>
    </div>)
  }
}

// const StationArea = ({ onChange, value, getCityData, getCountyData }) => { // 省市县3级联动。
//   console.log(value);
//   const changeLongitude = (e)=>{
//     onChange([e.target.value, value[1]])
//   }
//   const changeLatitude = (e)=>{
//     onChange([value[0], e.target.value])
//   }
//   const longitude = value[0] || '';
//   const latitude = value[1] || '';
//   return (<div style={{display: 'flex'}}>
//     <Input onChange={changeLongitude} value={longitude} />
//     <Input onChange={changeLatitude} value={latitude} />
//   </div>)
// }

export default StationArea;
