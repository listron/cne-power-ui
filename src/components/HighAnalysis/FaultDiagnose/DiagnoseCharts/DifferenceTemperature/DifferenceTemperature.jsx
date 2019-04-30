import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from 'antd';
import eCharts from "echarts";
import { diffTemperatureOptions } from "../chartsConfig/chartsConfig";
import styles from "./differenceTemperature.scss";
import moment from "moment";

const { RangePicker } =  DatePicker;


export default class DifferenceTemperature extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    tenMinutesDiffList: PropTypes.array,
    match: PropTypes.object,
    faultInfo: PropTypes.object,
    getTenMinutesDiff: PropTypes.func,
    stationDeviceList: PropTypes.array,
    deviceName: PropTypes.string,
    diffDate: PropTypes.array,
    onChangeFilter: PropTypes.func,
    diffLoading: PropTypes.bool,
    diffTimeCompare: PropTypes.number,
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
        tenMinutesDiffList,
        faultInfo: {
          endTime
        },
        deviceName,
        diffLoading
      }
    } = this;
    const myChart = eCharts.init(diffChart);
    if (diffLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!diffLoading) {
      myChart.hideLoading();
    }
    const params = {
      stationCode,
      pointCode: "GN010-GN011", //温度差-固定字段
      deviceFullCodes: [], // 默认传空代表所有风机
      startTime: moment(endTime).subtract(1,'months').utc().format(),
      endTime: moment(endTime).utc().format()
    };
    // 接口
    getTenMinutesDiff(params);
    myChart.setOption(diffTemperatureOptions(tenMinutesDiffList, deviceName));
  }

  componentWillReceiveProps(nextProps) {
    const {
      faultInfo: {
        endTime: currentEndTime
      },
      match:{
        params: {
          stationCode,
        }
      },
      getTenMinutesDiff
    } = this.props;
    const {
      faultInfo: {
        endTime: nextEndTime
      },
    } = nextProps;
    const params = {
      stationCode,
      pointCode: "GN010-GN011", //温度差-固定字段
      deviceFullCodes: [], // 默认传空代表所有风机
      startTime: moment(nextEndTime).subtract(1,'months').utc().format(),
      endTime: moment(nextEndTime).utc().format()
    };
    if (currentEndTime !== nextEndTime) {
      // 接口
      getTenMinutesDiff(params);
    }
  }

  componentDidUpdate(prevProps) {
    const  {
      diffChart,
      props: {
        tenMinutesDiffList,
        deviceName,
        stationDeviceList,
        diffLoading,
        diffTimeCompare: currentDiffTimeCompare
      }
    } = this;
    const { diffTimeCompare } = prevProps;
    const myChart = eCharts.init(diffChart);
    if (diffLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!diffLoading) {
      myChart.hideLoading();
    }
    // 单风机的时候需要从这里获取
    const defaultName = localStorage.getItem("deviceName");
    // 设备名称
    const name = deviceName ? deviceName : stationDeviceList[0].deviceName;
    if (currentDiffTimeCompare && diffTimeCompare !== currentDiffTimeCompare) {
      myChart.setOption(diffTemperatureOptions(tenMinutesDiffList, name || defaultName));
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
      getTenMinutesDiff
    } = this.props;
    const params = {
      stationCode,
      pointCode: "GN010-GN011", //温度差-固定字段
      deviceFullCodes: [], // 默认传空代表所有风机
      startTime: moment(date[0]).utc().format(),
      endTime: moment(date[1]).utc().format()
    };
    onChangeFilter({
      diffDate: date
    });
    // 接口
    getTenMinutesDiff(params);
  };

  render() {
    const {
      faultInfo: {
        endTime
      },
      diffDate
    } = this.props;
    return (
      <div className={styles.diffChartsBox}>
        <div className={styles.diffChartsDiff}>
          <div>
            温度差
          </div>
          <div>
            {(endTime) && (
              <RangePicker
                onChange={this.changeAfterDate}
                value={diffDate.length === 0 ? [
                  moment(endTime, "YYYY-MM-DD").subtract(1,'months'),
                  moment(endTime, "YYYY-MM-DD")
                ] : diffDate}
              />
            )}
          </div>
        </div>
        <div ref={(ref) => {
          this.diffChart = ref;
        }} className={styles.diffCharts} />
      </div>
    );
  }
}
