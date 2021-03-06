

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PvmoduleList from './PvmoduleList';
import InverterList from './InverterList';
import ConfluenceBoxList from './ConfluenceBoxList';
import BoxTransformerList from './BoxTransformerList';
import IntegrateList from './IntegrateList';
import Boosterstation from './Boosterstation';
import PowerNet from './PowerNet';
import WeatherStation from './WeatherStation';
import Schematic from './SchematicMap';
import styles from './deviceList.scss';

class DeviceList extends Component {
  static propTypes = {
    deviceTypeCode: PropTypes.string,
    location: PropTypes.object,
    changeSingleStationStore: PropTypes.func,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { deviceTypeCode, theme } = this.props;
    //  207 为交流汇流箱 暂时已经舍去了
    return (
      <div className={`${styles.deviceListBox} ${styles[theme]}`} >
        {/* 1 示意图 509 光伏组件 206(组串) ／201(集中) 逆变器  202/207(交流) 汇流箱  304 箱变 */}
        {`${deviceTypeCode}` === '1' && <Schematic {...this.props} theme={theme} />}
        {`${deviceTypeCode}` === '509' && <PvmoduleList {...this.props} />}
        {`${deviceTypeCode}` === '206' && <InverterList {...this.props} />}
        {`${deviceTypeCode}` === '201' && <InverterList {...this.props} />}
        {`${deviceTypeCode}` === '202' && <ConfluenceBoxList {...this.props} />}
        {`${deviceTypeCode}` === '207' && <ConfluenceBoxList {...this.props} />}
        {`${deviceTypeCode}` === '304' && <BoxTransformerList {...this.props} />}
        {/* 以下两个是风电站设备101风电机组 302集电线路 201集中式逆变器 301升压站 0电网  203 气象站*/}
        {`${deviceTypeCode}` === '101' && <div></div>}
        {`${deviceTypeCode}` === '302' && <IntegrateList {...this.props} />}
        {`${deviceTypeCode}` === '301' && <Boosterstation {...this.props} />}
        {`${deviceTypeCode}` === '0' && <PowerNet {...this.props} />}
        {`${deviceTypeCode}` === '203' && <WeatherStation {...this.props} />}
      </div>
    );
  }
}

export default DeviceList;
