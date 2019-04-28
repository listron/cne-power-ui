import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from 'antd';
import eCharts from "echarts";
import { PreTemperatureOptions } from "../chartsConfig/chartsConfig";
import styles from "./preTemperature.scss";

const { RangePicker } =  DatePicker;


export default class PreTemperature extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    getTenMinutesBefore: PropTypes.func,
    match: PropTypes.object,
    tenMinutesBeforeList: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const  {
      preChart,
      props: {
        getTenMinutesBefore,
        match:{
          params: {
            stationCode
          }
        },
        tenMinutesBeforeList
      },
    } = this;
    const myChart = eCharts.init(preChart);
    const params = {
      stationCode,
      pointCode: "GN010", //前驱测点-固定字段
      deviceFullCodes: ["82M101M39M1","82M101M39M2"],
      startTime: "2019-04-22T01:00:00Z",
      endTime: "2019-04-22T02:37:05Z"
    };
    const name = "F01";
    // 接口
    getTenMinutesBefore(params);
    myChart.setOption(PreTemperatureOptions(tenMinutesBeforeList, name));
  }

  componentDidUpdate() {
    const  {
      preChart,
      props: {
        tenMinutesBeforeList
      }
    } = this;
    const name = "F01";
    const myChart = eCharts.init(preChart);
    myChart.setOption(PreTemperatureOptions(tenMinutesBeforeList, name));
  }


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
      </div>
    );
  }
}
