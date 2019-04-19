import React from "react";
import PropTypes from "prop-types";
import eCharts from "echarts";
import { singleTemperatureOptions } from "../chartsConfig/chartsConfig";
import styles from "./singleResult.scss";



export default class SingleResult extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const  { singleChart } = this;
    const myChart = eCharts.init(singleChart);
    myChart.setOption(singleTemperatureOptions());
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
