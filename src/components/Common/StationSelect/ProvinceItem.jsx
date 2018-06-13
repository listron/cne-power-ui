import React, { Component } from 'react';
import { Icon, Modal, Button, Radio, Checkbox  } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';

class ProvinceItem extends Component {
  static propTypes = {
    checkStation: PropTypes.func,
    provinceInfor: PropTypes.object,
    selectedStation: PropTypes.array,
  }
  static defaultProps = {
  }
  constructor(props) {
    super(props);
    this.state = {
      provinceChecked: false,
      indeterminate: false,
    }
  }
  checkStation = (station) => {
    const { selectedStation, provinceInfor } = this.props;
    let cancelCheck = selectedStation.some(e=>e.stationCode===station.stationCode)
    let newStations = [];
    let indeterminate = false;
    let provinceChecked = false;
    let provinceIndeter = selectedStation.filter(e=>e.provinceCode===provinceInfor.provinceCode);
    if(cancelCheck){
      newStations = selectedStation.filter(e=>e.stationCode!==station.stationCode);
      (provinceIndeter.length > 1) && (indeterminate = true)
    }else{
      newStations = [station,...selectedStation];
      ( provinceIndeter.length < provinceInfor.stations.length - 1 ) && (indeterminate = true);
      ( provinceIndeter.length === provinceInfor.stations.length - 1 ) && (provinceChecked = true)
    }
    this.setState({
      indeterminate,
      provinceChecked
    })
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
    this.setState({
      provinceChecked: !!checked,
      indeterminate: false,
    })
    this.props.checkStation(newSelectedStation)
  }

  render() {
    const { provinceInfor, selectedStation } = this.props;
    const { provinceChecked, indeterminate } = this.state;
    return (
      <div>
        <Checkbox onChange={this.checkProvince} checked={provinceChecked} indeterminate={indeterminate}>{provinceInfor.provinceName}</Checkbox>
        {provinceInfor.stations.map(m=>{
          let checked = selectedStation.some(e=>e.stationCode===m.stationCode)
          return <div onClick={()=>this.checkStation(m)} key={m.stationCode} style={{'backgroundColor':checked?'yellowgreen':'transparent'}}> <span>{ m.stationName }</span> <Icon type="check-circle-o" /> </div>
        })}
      </div>
    )
  }
}
export default ProvinceItem;