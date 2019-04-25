import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from 'antd';
import eCharts from "echarts";
import { diffTemperatureOptions } from "../chartsConfig/chartsConfig";
import styles from "./differenceTemperature.scss";

const { RangePicker } =  DatePicker;


export default class DifferenceTemperature extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const  { diffChart } = this;
    const myChart = eCharts.init(diffChart);
    myChart.setOption(diffTemperatureOptions());
  }

  render() {
    return (
      <div className={styles.diffChartsBox}>
        <div className={styles.diffChartsDiff}>
          <div>
            温度差
          </div>
          <div>
            <RangePicker />
          </div>
        </div>
        <div ref={(ref) => {
          this.diffChart = ref;
        }} className={styles.diffCharts} />
      </div>
    );
  }
}
