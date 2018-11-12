





import React, { Component } from 'react';
import { Input } from 'antd';
import styles from '../stationSide.scss';
import PropTypes from 'prop-types';

class StationMapPosition extends Component{
  static propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
  }

  changeLongitude = (e)=>{
    const { onChange, value } = this.props;
    onChange([e.target.value, value[1]])
  }

  changeLatitude = (e)=>{
    const { onChange, value } = this.props;
    onChange([value[0], e.target.value])
  }

  render(){
    const [longitude, latitude] = this.props.value;
    return (<div className={styles.mapPosition}>
      <Input onChange={this.changeLongitude} value={longitude} />
      <span className={styles.sign}>°</span>
      <Input onChange={this.changeLatitude} value={latitude} />
      <span className={styles.sign}>°</span>
    </div>)
  }
}

// const StationMapPosition = ({ onChange, value }) => { // 经纬度input封装。
//   console.log(value);
//   const changeLongitude = (e)=>{
//     onChange([e.target.value, value[1]])
//   }
//   const changeLatitude = (e)=>{
//     onChange([value[0], e.target.value])
//   }
//   const longitude = value[0];
//   const latitude = value[1];
//   return (<div style={{display: 'flex'}}>
//     <Input onChange={changeLongitude} value={longitude} />
//     <span>°</span>
//     <Input onChange={changeLatitude} value={latitude} />
//     <span>°</span>
//   </div>)
// }

export default StationMapPosition;
