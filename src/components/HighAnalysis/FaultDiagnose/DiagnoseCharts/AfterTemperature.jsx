import React from "react";
import PropTypes from "prop-types";
import { DatePicker, Switch } from 'antd';
import eCharts from "echarts";
import { AfterTemperatureOptions } from "../../../../utils/chartsConfig/diagnoseConfig";
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

  onChangeSwitch = (checked) => {
    console.log(`switch to ${checked}`);
  };


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
        <div className={styles.afterSwitch}>
          <Switch defaultChecked onChange={this.onChangeSwitch} />
          <span>全部显示</span>
        </div>
      </div>
    );
  }
}
