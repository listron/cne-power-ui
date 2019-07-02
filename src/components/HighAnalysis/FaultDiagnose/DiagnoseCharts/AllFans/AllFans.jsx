import React from 'react';
import PropTypes from 'prop-types';
import eCharts from 'echarts';
import { allFansOptions } from '../chartsConfig/chartsConfig';

import styles from './allFans.scss';

export default class AllFans extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    getAllFanResultList: PropTypes.func,
    allFanResultList: PropTypes.object,
    faultInfo: PropTypes.object,
    allLoading: PropTypes.bool,
    allTimeCompare: PropTypes.number,
    faultDate: PropTypes.string,
  };

  componentDidUpdate(prevProps) {
    const {
      allFansCharts,
      props: {
        allFanResultList,
        allLoading,
        faultInfo: {
          endTime,
        },
        faultDate,
        allTimeCompare: currentAllTimeCompare,
      },
    } = this;
    const { allTimeCompare } = prevProps;
    const myChart = eCharts.init(allFansCharts);
    if (allLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!allLoading) {
      myChart.hideLoading();
    }
    if (currentAllTimeCompare && allTimeCompare !== currentAllTimeCompare) {
      eCharts.init(allFansCharts).dispose();//销毁前一个实例
      const myChart = eCharts.init(allFansCharts); //构建下一个实例
      myChart.setOption(allFansOptions(allFanResultList, faultDate || endTime));
    }
  }


  render() {
    return (
      <div className={styles.allFansChartsBox}>
        <div className={styles.allFansChartsDiff}>
          <div>
            严重程度及识别（所有风机）
          </div>
        </div>
        <div ref={(ref) => {
          this.allFansCharts = ref;
        }} className={styles.allFansCharts} />
      </div>
    );
  }
}
