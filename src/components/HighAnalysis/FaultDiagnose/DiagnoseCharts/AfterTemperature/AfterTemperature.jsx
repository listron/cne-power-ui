import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from 'antd';
import eCharts from "echarts";
import { AfterTemperatureOptions } from "../chartsConfig/chartsConfig";
import styles from "./afterTemperature.scss";
import moment from "moment";

const { RangePicker } =  DatePicker;


export default class AfterTemperature extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    tenMinutesAfterList: PropTypes.array,
    stationDeviceList: PropTypes.array,
    getTenMinutesAfter: PropTypes.func,
    match: PropTypes.object,
    deviceName: PropTypes.string,
    faultInfo: PropTypes.object,
    onChangeFilter: PropTypes.func,
    afterDate: PropTypes.array,
    afterLoading: PropTypes.bool,
    afterTimeCompare: PropTypes.number,
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
        deviceName,
        afterLoading
      }
    } = this;
    const myChart = eCharts.init(afterChart);
    if (afterLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!afterLoading) {
      myChart.hideLoading();
    }
    myChart.setOption(AfterTemperatureOptions(tenMinutesAfterList, deviceName));
  }

  componentDidUpdate(prevProps) {
    const  {
      afterChart,
      props: {
        tenMinutesAfterList,
        stationDeviceList,
        deviceName,
        afterLoading,
        afterTimeCompare: currentAfterTimeCompare
      }
    } = this;
    const { afterTimeCompare } = prevProps;
    const myChart = eCharts.init(afterChart);
    if (afterLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!afterLoading) {
      myChart.hideLoading();
    }
    // 单风机的时候需要从这里获取
    const defaultName = localStorage.getItem("deviceName");
    // 设备名称
    const name = deviceName ? deviceName : stationDeviceList[0].deviceName;
    if (currentAfterTimeCompare && afterTimeCompare !== currentAfterTimeCompare) {
      myChart.setOption(AfterTemperatureOptions(tenMinutesAfterList, name || defaultName));
    }
  }

  changeAfterDate = (date) => {
    const {
      match:{
        params: {
          stationCode,
        }
      },
      onChangeFilter,
      getTenMinutesAfter
    } = this.props;
    const params = {
      stationCode,
      pointCode: "GN011", //后驱测点-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: moment(date[0]).utc().format(),
      endTime: moment(date[1]).utc().format()
    };
    onChangeFilter({
      afterDate: date
    });
    // 接口
    getTenMinutesAfter(params);
  };

  render() {
    const {
      faultInfo: {
        endTime
      },
      afterDate
    } = this.props;
    return (
      <div className={styles.afterChartsBox}>
        <div className={styles.afterChartsDiff}>
          <div>
            发电机后驱温度
          </div>
          <div>
            {(endTime) && (
              <RangePicker
                onChange={this.changeAfterDate}
                value={afterDate.length === 0 ? [
                  moment(endTime, "YYYY/MM/DD").subtract(1,'months'),
                  moment(endTime, "YYYY/MM/DD")
                ] : afterDate}
              />
            )}
          </div>
        </div>
        <div ref={(ref) => {
          this.afterChart = ref;
        }} className={styles.afterCharts} />
      </div>
    );
  }
}
