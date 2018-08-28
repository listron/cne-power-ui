

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
    deviceTypeCode: PropTypes.number,
  }

  constructor(props){
    super(props);
  }
  
  render(){
    const { deviceTypeCode } = this.props;
    return (
      <div>
        {deviceTypeCode===509 && <PvmoduleList {...this.props} />}
        {deviceTypeCode===206 && <InverterList {...this.props} />}
        {deviceTypeCode===202 && <ConfluenceBoxList {...this.props} />}
        {deviceTypeCode===304 && <BoxTransformerList {...this.props} />}
      </div>
    )
  }
}

export default DeviceList;
