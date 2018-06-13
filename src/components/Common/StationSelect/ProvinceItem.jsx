import React, { Component } from 'react';
import { Icon, Modal, Button, Radio, Checkbox  } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';

class ProvinceItem extends Component {
  static propTypes = {
    checkStation: PropTypes.func,
    provinceInfor: PropTypes.object,
  }
  static defaultProps = {
  }
  constructor(props) {
    super(props);
    this.state = {
      checkedStations: [],

    }
  }
  checkStation = (e) => {
    console.log(e)
    // const { stationInfo, checked } = this.props
    // this.props.onCheck({
    //   addStation: !checked,
    //   stationInfo
    // })
  }
  checkProvince = (e) => {
    console.log(e)
  }


  render() {
    const { provinceInfor } = this.props
    return (
      <div>
        <Checkbox onChange={this.checkProvince} provinceCode={provinceInfor.provinceCode}>{provinceInfor.provinceName}</Checkbox>
        {provinceInfor.stations.map(m=>{
          return <div onClick={this.checkStation} stationCode={m.stationCode}> <span>{ m.stationName }</span> <Icon type="check-circle-o" /> </div>
        })}
      </div>
    )
    
  }
}
export default ProvinceItem;