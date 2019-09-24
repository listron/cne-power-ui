import React, { Component } from 'react';
import Frequency from './Frequency.jsx';
import WindRose from './WindRose/WindRose.jsx';
import PropTypes from 'prop-types';

import styles from './resources.scss';

class ResourcesTabs extends Component{
  static propTypes = {
    getStationDevice: PropTypes.func,
    changeWindResourcesStore: PropTypes.func,
    stationCode: PropTypes.number,
    activeKey: PropTypes.number,
  };

  checkType = (value) => {
    const { activeKey } = this.props;
    const {
      getStationDevice,
      stationCode,
      changeWindResourcesStore,
    } = this.props;
    if(activeKey !== value) {
      changeWindResourcesStore({
        frequencyData: [], // 频率图数据
        directionsData: [], // 玫瑰图数据
        curBigChartData: [], // 放大频率图数据
        bigWindRoseData: [], // 放大玫瑰图数据
        activeKey: value,
      });
      getStationDevice({stationCode, type: value});
    }
  };

  render(){
    const { activeKey } = this.props;
    return(
      <div className={styles.resourcesTabs}>
        <div className={styles.tabsBox}>
          <button className={activeKey === 1 ? styles.activeBtn : ''} onClick={() => {this.checkType(1);}}>风向&nbsp;&&nbsp;风能玫瑰图</button>
          <button className={activeKey === 2 ? styles.activeBtn : ''} onClick={() => {this.checkType(2);}}>风速&nbsp;&&nbsp;风能频率图</button>
        </div>
        {activeKey === 1 && <WindRose {...this.props} />}
        {activeKey === 2 && <Frequency {...this.props} />}
      </div>
    );
  }
}
export default ResourcesTabs;
