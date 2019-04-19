import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from 'antd';
import eCharts from "echarts";
import { AfterTemperatureOptions } from "../chartsConfig/chartsConfig";
import styles from "./afterTemperature.scss";

const { RangePicker } =  DatePicker;


export default class AfterTemperature extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const  { afterChart } = this;
    const myChart = eCharts.init(afterChart);
    myChart.setOption(AfterTemperatureOptions());
  }

  render() {
    return (
      <div className={styles.afterChartsBox}>
        <div className={styles.afterChartsDiff}>
          <div>
            发电机后驱温度
          </div>
          <div>
            <RangePicker />
          </div>
        </div>
        <div ref={(ref) => {
          this.afterChart = ref;
        }} className={styles.afterCharts} />
      </div>
    );
  }
}
