

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PvmoduleList from './PvmoduleList';
import InverterList from './InverterList';
import ConfluenceBoxList from './ConfluenceBoxList';
import BoxTransformerList from './BoxTransformerList';
import IntegrateList from './IntegrateList';
import Boosterstation from './Boosterstation';
import PowerNet from './PowerNet';

class DeviceList extends Component {
  static propTypes = {
    deviceTypeCode: PropTypes.number,
    location: PropTypes.object,
    changeSingleStationStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  render() {
    // const { deviceTypeCode } = this.props;
    const deviceTypeCode = 509
    //  207 为交流汇流箱 暂时已经舍去了
    return (
      <div >
        {/* <ConfluenceBoxList {...this.props} /> */}
        {/* <BoxTransformerList {...this.props} />   */}
        {/* <IntegrateList {...this.props} /> */}
        {/* <PvmoduleList {...this.props} /> */}
        {/* <Boosterstation {...this.props} /> */}
        <PowerNet {...this.props} />
        {/* {deviceTypeCode === 509 && <PvmoduleList {...this.props} />} */}
        {/* {deviceTypeCode === 206 && <InverterList {...this.props} />}
        {deviceTypeCode === 201 && <InverterList {...this.props} />}
        {deviceTypeCode === 202 && <ConfluenceBoxList {...this.props} />}
        {deviceTypeCode === 207 && <ConfluenceBoxList {...this.props} />}
        {deviceTypeCode === 304 && <BoxTransformerList {...this.props} />}
        以下两个是风电站设备101风电机组 302集电线路 201集中式逆变器 301升压站 0电网
        {deviceTypeCode === 101 && <div></div>}

        {deviceTypeCode === 302 && <IntegrateList {...this.props} />}
        {deviceTypeCode === 301 && <Boosterstation {...this.props} />}
        {deviceTypeCode === 0 && <PowerNet {...this.props} />} */}
      </div>
    )
  }
}

export default DeviceList;
