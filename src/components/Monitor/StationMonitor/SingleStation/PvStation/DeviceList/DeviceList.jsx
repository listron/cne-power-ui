

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import PvmoduleList from './PvmoduleList';
import InverterList from './InverterList';
import ConfluenceBoxList from './ConfluenceBoxList';
import BoxTransformerList from './BoxTransformerList';


class DeviceList extends Component {
  static propTypes = {
    deviceTypeCode: PropTypes.number,
    deviceTypeFlow: PropTypes.array,
    location: PropTypes.object,
    changeSingleStationStore: PropTypes.func,
  }

  constructor(props){
    super(props);
  }
  
  

  render(){
    const { deviceTypeCode } = this.props;
    
    return (
      <div >
        {deviceTypeCode===509 && <PvmoduleList {...this.props} />}
        {deviceTypeCode===206 && <InverterList {...this.props} />}
        {deviceTypeCode===202 && <ConfluenceBoxList {...this.props} />}
        {deviceTypeCode===304 && <BoxTransformerList {...this.props} />}
        {/* 以下两个是风电站设备101风电机组 302集电线路 */}
        {deviceTypeCode===101 && <div></div>}
        {deviceTypeCode===302 && <div></div>}
      </div>
    )
  }
}

export default DeviceList;
