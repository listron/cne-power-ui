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
    tenMinutesAfterList: PropTypes.array,
    getTenMinutesAfter: PropTypes.func,
    match: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const  {
      afterChart,
      props: {
        tenMinutesAfterList,
        getTenMinutesAfter,
        match:{
          params: {
            stationCode
          }
        },
      }
    } = this;
    const myChart = eCharts.init(afterChart);
    const params = {
      stationCode,
      pointCode: "GN011", //后驱测点-固定字段
      deviceFullCodes: ["82M101M39M1","82M101M39M2"],
      startTime: "2019-04-22T01:00:00Z",
      endTime: "2019-04-22T02:37:05Z"
    };
    const name = "F02";
    // 接口
    getTenMinutesAfter(params);
    myChart.setOption(AfterTemperatureOptions(tenMinutesAfterList, name));
  }

  componentDidUpdate() {
    const  {
      afterChart,
      props: {
        tenMinutesAfterList,
      }
    } = this;
    const name = "F02";
    const myChart = eCharts.init(afterChart);
    myChart.setOption(AfterTemperatureOptions(tenMinutesAfterList, name));
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
