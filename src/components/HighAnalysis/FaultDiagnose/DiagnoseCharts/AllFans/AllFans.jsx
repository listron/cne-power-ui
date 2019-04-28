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
        allFanResultList
      }
    } = this;
    const taskId = localStorage.getItem("taskId");
    const params = {
      taskId,
      date: "2019-04-19"
    };
    const myChart = eCharts.init(allFansCharts);
    // 接口
    getAllFanResultList(params);
    myChart.setOption(allFansOptions(allFanResultList, params.date));
  }

  componentDidUpdate() {
    const  {
      allFansCharts,
      props: {
        allFanResultList
      }
    } = this;
    const taskId = localStorage.getItem("taskId");
    const params = {
      taskId,
      date: "2019-04-19"
    };
    const myChart = eCharts.init(allFansCharts);
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
