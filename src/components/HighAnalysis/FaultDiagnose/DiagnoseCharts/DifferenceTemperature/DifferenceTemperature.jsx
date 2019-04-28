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
    tenMinutesDiffList: PropTypes.array,
    match: PropTypes.object,
    getTenMinutesDiff: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const  {
      diffChart,
      props: {
        getTenMinutesDiff,
        match:{
          params: {
            stationCode
          }
        },
        tenMinutesDiffList
      }
    } = this;
    const myChart = eCharts.init(diffChart);
    const params = {
      stationCode,
      pointCode: "GN010-GN011", //温度差-固定字段
      deviceFullCodes: ["82M101M39M1","82M101M39M2"],
      startTime: "2019-04-22T01:00:00Z",
      endTime: "2019-04-22T02:37:05Z"
    };
    const name = "F02";
    // 接口
    getTenMinutesDiff(params);
    myChart.setOption(diffTemperatureOptions(tenMinutesDiffList, name));
  }

  componentDidUpdate() {
    const  {
      diffChart,
      props: {
        tenMinutesDiffList
      }
    } = this;
    const myChart = eCharts.init(diffChart);
    const name = "F02";
    myChart.setOption(diffTemperatureOptions(tenMinutesDiffList, name));
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
