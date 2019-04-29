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
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const  {
      allFansCharts,
      props: {
        getAllFanResultList,
        allFanResultList,
        faultInfo: {
          endTime
        },
        allLoading
      }
    } = this;
    const taskId = localStorage.getItem("taskId");
    const params = {
      taskId,
      date: endTime
    };
    const myChart = eCharts.init(allFansCharts);
    if (allLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!allLoading) {
      myChart.hideLoading();
    }
    // 接口
    getAllFanResultList(params);
    myChart.setOption(allFansOptions(allFanResultList, params.date));
  }

  componentWillReceiveProps(nextProps) {
    const {
      faultInfo: {
        endTime: currentEndTime
      },
      getAllFanResultList
    } = this.props;
    const {
      faultInfo: {
        endTime: nextEndTime
      },
    } = nextProps;
    const taskId = localStorage.getItem("taskId");
    const params = {
      taskId,
      date: nextEndTime
    };
    if (currentEndTime !== nextEndTime) {
      // 接口
      getAllFanResultList(params);
    }
  }

  componentDidUpdate() {
    const  {
      allFansCharts,
      props: {
        allFanResultList,
        allLoading,
        faultInfo: {
          endTime
        },
      }
    } = this;
    const taskId = localStorage.getItem("taskId");
    const params = {
      taskId,
      date: endTime
    };
    const myChart = eCharts.init(allFansCharts);
    if (allLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!allLoading) {
      myChart.hideLoading();
    }
    myChart.setOption(allFansOptions(allFanResultList, params.date));
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
