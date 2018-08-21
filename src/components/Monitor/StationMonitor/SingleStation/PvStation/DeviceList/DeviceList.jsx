

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import {  } from 'antd';
import PvmoduleList from './PvmoduleList';
import InverterList from './InverterList';
import ConfluenceBoxList from './ConfluenceBoxList';
import BoxTransformerList from './BoxTransformerList';


class DeviceList extends Component {
  static propTypes = {
    deviceTypeCode: PropTypes.string,
  }

  constructor(props){
    super(props);
  }
  
  render(){
    const { deviceTypeCode } = this.props;
    return (
      <div>
        {deviceTypeCode==='10000' && <PvmoduleList {...this.props} />}
        {deviceTypeCode==='10001' && <InverterList {...this.props} />}
        {deviceTypeCode==='10002' && <ConfluenceBoxList {...this.props} />}
        {deviceTypeCode==='10003' && <BoxTransformerList {...this.props} />}
      </div>
    )
  }
}

export default DeviceList;
