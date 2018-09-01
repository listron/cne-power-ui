

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
    deviceTypeFlow: PropTypes.array,
    location: PropTypes.object,
  }

  constructor(props){
    super(props);
  }
  
  render(){
    const { deviceTypeCode } = this.props;
    const locationSearch  = this.props.location.search;
    let appointDeviceCode = locationSearch.substr(locationSearch.indexOf('=')+1);
    if(appointDeviceCode && appointDeviceCode!=='undefined'){
      appointDeviceCode = parseInt(appointDeviceCode);
    }else{
      appointDeviceCode = deviceTypeCode || 509;
    }


    return (
      <div>
        {appointDeviceCode===509 && <PvmoduleList {...this.props} />}
        {appointDeviceCode===206 && <InverterList {...this.props} />}
        {appointDeviceCode===202 && <ConfluenceBoxList {...this.props} />}
        {appointDeviceCode===304 && <BoxTransformerList {...this.props} />}
      </div>
    )
  }
}

export default DeviceList;
