import React from "react";
import PropTypes from "prop-types";
import eCharts from "echarts";
import { heatTemperatureOptions } from "../../../../../utils/chartsConfig/diagnoseConfig";
import styles from "./heatMap.scss";



export default class HeatMap extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const  { heatChart } = this;
    const myChart = eCharts.init(heatChart);
    myChart.setOption(heatTemperatureOptions());
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
