import React from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import { singleTemperatureOptions } from '../chartsConfig/chartsConfig';
import styles from './singleResult.scss';



export default class SingleResult extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    getStandAloneList: PropTypes.func,
    standAloneList: PropTypes.array,
    aloneLoading: PropTypes.bool,
    deviceFullCode: PropTypes.string,
    aloneTimeCompare: PropTypes.number,
    deviceName: PropTypes.string,
  };

  componentDidUpdate(prevProps) {
    const {
      singleChart,
      props: {
        standAloneList,
        aloneLoading,
        deviceName,
        aloneTimeCompare: currentAloneTimeCompare,
      },
    } = this;
    const { aloneTimeCompare } = prevProps;
    const name = localStorage.getItem('deviceName');
    // 设备全编码
    const myChart = eCharts.init(singleChart);
    if (aloneLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!aloneLoading) {
      myChart.hideLoading();
    }
    if (currentAloneTimeCompare && aloneTimeCompare !== currentAloneTimeCompare) {
      eCharts.init(singleChart).dispose();//销毁前一个实例
      const myChart = eCharts.init(singleChart); //构建下一个实例
      myChart.setOption(singleTemperatureOptions(standAloneList, deviceName ||name));
    }
  }


  render() {
    return (
      <div className={styles.singleChartsBox}>
        <div className={styles.singleChartsDiff}>
          <div>
            单机自适应模块的检测结果
          </div>
        </div>
        <div ref={(ref) => {
          this.singleChart = ref;
        }} className={styles.singleCharts} />
      </div>
    );
  }
}
