

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './windStation.scss';
import { Tabs, Radio } from 'antd';
import { Link } from 'react-router-dom';
import WindStationTop from './WindStationTop';
import OutputTenMin from '../SingleStationCommon/OutputTenMin';
import PowerDiagramTenMin from '../SingleStationCommon/PowerDiagramTenMin';
import CardSection from '../SingleStationCommon/CardSection';
const { TabPane } = Tabs;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class PvStation extends Component {
  static propTypes = {
    stationCode: PropTypes.string,
    match: PropTypes.object,
    changeSingleStationStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      hiddenStationList: false,
    }
  }
  
  componentWillUnmount(){
    
  }

  onSelectedDeviceType = (e) => {
    const deviceTypeCode = parseInt(e.target.value);
    this.props.changeSingleStationStore({ deviceTypeCode });
  }

  getDeviceTypeIcon = (e) => {
    switch (e) {
      case 509:
        return 'iconfont icon-pvs';
      case 206:
      case 201:
        return 'iconfont icon-nb';
      case 202:
      case 207:
        return 'iconfont icon-hl';
      case 304:
        return 'iconfont icon-xb';
      case 302:
        return 'iconfont icon-jidian';
      default:
        return;
    }
  }

  
 

  render() {
    const { stationCode } = this.props.match.params;
    return (
      <div className={styles.windStation} >
         <WindStationTop {...this.props} stationCode={stationCode} hiddenStationList={this.state.hiddenStationList} />
         <div className={styles.outputPowerDiagram}>
          <OutputTenMin {...this.props} yXaisName={'风速(m/s)'} />
          <PowerDiagramTenMin {...this.props} />
        </div>
        <CardSection {...this.props} stationCode={stationCode} />
      </div>
    )
  }
}

export default PvStation;
