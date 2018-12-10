

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PvmoduleList from './PvmoduleList';
import InverterList from './InverterList';
import ConfluenceBoxList from './ConfluenceBoxList';
import BoxTransformerList from './BoxTransformerList';
import IntegrateList from '../../SingleStationCommon/DeviceList/IntegrateList';
import Boosterstation from '../../SingleStationCommon/DeviceList/Boosterstation';

class DeviceList extends Component {
  static propTypes = {
    deviceTypeCode: PropTypes.number,
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
        {deviceTypeCode===201 && <InverterList {...this.props} />}
        {deviceTypeCode===202 && <ConfluenceBoxList {...this.props} />}
        {deviceTypeCode===207 && <ConfluenceBoxList {...this.props} />}
        {deviceTypeCode===304 && <BoxTransformerList {...this.props} />}
        {/* 以下两个是风电站设备101风电机组 302集电线路 201集中式逆变器 301升压站*/}
        {deviceTypeCode===101 && <div></div>}

        {/* {deviceTypeCode===302 && <IntegrateList {...this.props} />} */}
        {deviceTypeCode===302 && <Boosterstation {...this.props} />}
      </div>
    )
  }
}

export default DeviceList;
