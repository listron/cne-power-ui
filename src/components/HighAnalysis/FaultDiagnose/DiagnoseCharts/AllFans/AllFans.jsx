import React from "react";
import PropTypes from "prop-types";
import eCharts from "echarts";
import { allFansOptions } from "../chartsConfig/chartsConfig";
import styles from "./allFans.scss";

export default class AllFans extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    getAllFanResultList: PropTypes.func,
    allFanResultList: PropTypes.object,
    faultInfo: PropTypes.object,
    allLoading: PropTypes.bool,
    allTimeCompare: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const  {
      allFansCharts,
      props: {
        allFanResultList,
        faultInfo: {
          endTime
        },
        allLoading
      }
    } = this;
    const myChart = eCharts.init(allFansCharts);
    if (allLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!allLoading) {
      myChart.hideLoading();
    }
    myChart.setOption(allFansOptions(allFanResultList, endTime));
  }

  componentDidUpdate(prevProps) {
    const  {
      allFansCharts,
      props: {
        allFanResultList,
        allLoading,
        faultInfo: {
          endTime
        },
        allTimeCompare: currentAllTimeCompare
      }
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
      myChart.setOption(allFansOptions(allFanResultList, endTime));
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
