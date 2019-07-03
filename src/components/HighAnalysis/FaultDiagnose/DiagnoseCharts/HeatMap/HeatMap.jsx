import React from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import { heatTemperatureOptions } from '../chartsConfig/chartsConfig';

import styles from './heatMap.scss';



export default class HeatMap extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    similarityList: PropTypes.array,
    getSimilarityList: PropTypes.func,
    heatLoading: PropTypes.bool,
    faultInfo: PropTypes.object,
    heatTimeCompare: PropTypes.number,
    faultDate: PropTypes.string,
  };

  componentDidUpdate(prevProps) {
    const {
      heatChart,
      props: {
        similarityList,
        faultInfo: {
          endTime,
        },
        faultDate,
        heatLoading,
        heatTimeCompare: currentHeatTimeCompare,
      },
    } = this;
    const { heatTimeCompare } = prevProps;
    const myChart = eCharts.init(heatChart);
    if (heatLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!heatLoading) {
      myChart.hideLoading();
    }
    if (currentHeatTimeCompare && heatTimeCompare !== currentHeatTimeCompare) {
      eCharts.init(heatChart).dispose();//销毁前一个实例
      const myChart = eCharts.init(heatChart); //构建下一个实例
      myChart.setOption(heatTemperatureOptions(similarityList, faultDate || endTime));
    }
  }

  render() {
    return (
      <div className={styles.heatChartsBox}>
        <div className={styles.heatChartsDiff}>
          <div>
            相似性热图
          </div>
        </div>
        <div ref={(ref) => {
          this.heatChart = ref;
        }} className={styles.heatCharts} />
      </div>
    );
  }
}
