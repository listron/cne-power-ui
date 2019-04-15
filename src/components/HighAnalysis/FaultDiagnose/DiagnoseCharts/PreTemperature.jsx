import React from "react";
import PropTypes from "prop-types";
import { DatePicker, Switch } from 'antd';
import eCharts from "echarts";
import { PreTemperatureOptions } from "../../../../utils/chartsConfig/diagnoseConfig";
import styles from "./preTemperature.scss";

const { RangePicker } =  DatePicker;


export default class PreTemperature extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      allFlag: false
    };
  }

  componentDidMount() {
    const  { preChart } = this;
    const { allFlag } = this.state;
    const myChart = eCharts.init(preChart);
    myChart.setOption(PreTemperatureOptions(allFlag));
  }

  componentDidUpdate() {
    const  { preChart } = this;
    const { allFlag } = this.state;
    const myChart = eCharts.init(preChart);
    myChart.setOption(PreTemperatureOptions(allFlag));
  }

  onChangeSwitch = (checked) => {
    console.log(`switch to ${checked}`);
    this.setState({
      allFlag: checked
    });
  };


  render() {
    return (
      <div className={styles.preChartsBox}>
        <div className={styles.preChartsDate}>
          <span>选择日期</span>
          <DatePicker />
        </div>
        <div className={styles.preChartsDiff}>
          <div>
            发电机前驱温度
          </div>
          <div>
            <RangePicker />
          </div>
        </div>
        <div ref={(ref) => {
          this.preChart = ref;
        }} className={styles.preCharts} />
        <div className={styles.preSwitch}>
          <Switch defaultChecked onChange={this.onChangeSwitch} />
          <span>全部显示</span>
        </div>
      </div>
    );
  }
}
