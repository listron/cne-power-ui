import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from 'antd';
import eCharts from "echarts";
import { PreTemperatureOptions } from "../chartsConfig/chartsConfig";
import styles from "./preTemperature.scss";
import moment from "moment";

const { RangePicker } =  DatePicker;


export default class PreTemperature extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    getTenMinutesBefore: PropTypes.func,
    match: PropTypes.object,
    tenMinutesBeforeList: PropTypes.array,
    faultInfo: PropTypes.object,
    deviceName: PropTypes.string,
    faultDate: PropTypes.string,
    onChangeFilter: PropTypes.func,
    getSimilarityList: PropTypes.func,
    getAllFanResultList: PropTypes.func,
    stationDeviceList: PropTypes.array,
    preDate: PropTypes.array,
    preLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const  {
      getTenMinutesBefore,
      match:{
        params: {
          stationCode,
        }
      },
      faultInfo: {
        endTime
      },
      deviceName,
      tenMinutesBeforeList,
      preLoading
    } = this.props;
    const { preChart } = this;
    const myChart = eCharts.init(preChart);
    if (preLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!preLoading) {
      myChart.hideLoading();
    }
    const params = {
      stationCode,
      pointCode: "GN010", //前驱测点-固定字段
      deviceFullCodes: [], // 默认传空代表所有风机
      startTime: moment(endTime).subtract(1,'months').utc().format(),
      endTime: moment(endTime).utc().format()
    };
    // 接口
    getTenMinutesBefore(params);
    myChart.setOption(PreTemperatureOptions(tenMinutesBeforeList, deviceName));
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
      getTenMinutesBefore
    } = this.props;
    const {
      faultInfo: {
        endTime: nextEndTime
      },
    } = nextProps;
    const params = {
      stationCode,
      pointCode: "GN010", //前驱测点-固定字段
      deviceFullCodes: [], // 默认传空代表所有风机
      startTime: moment(nextEndTime).subtract(1,'months').utc().format(),
      endTime: moment(nextEndTime).utc().format()
    };
    if (currentEndTime !== nextEndTime) {
      // 接口
      getTenMinutesBefore(params);
    }
  }

  componentDidUpdate() {
    const  {
      tenMinutesBeforeList,
      deviceName,
      stationDeviceList,
      preLoading
    } = this.props;
    const { preChart } = this;
    const myChart = eCharts.init(preChart);
    if (preLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!preLoading) {
      myChart.hideLoading();
    }
    // 设备名称
    const name = deviceName ? deviceName : stationDeviceList[0].deviceName;
    myChart.setOption(PreTemperatureOptions(tenMinutesBeforeList, name));

  }

  changeFaultDate = (date, dateString) => {
    const {
      onChangeFilter,
      getSimilarityList,
      getAllFanResultList
    } = this.props;
    onChangeFilter({
      faultDate: dateString
    });
    const taskId = localStorage.getItem("taskId");
    // 相似性热图
    const heatAndAllFansParams = {
      taskId,
      date: dateString
    };
    getSimilarityList(heatAndAllFansParams);
    getAllFanResultList(heatAndAllFansParams);
  };

  changePreDate = (date) => {
    const {
      match:{
        params: {
          stationCode,
        }
      },
      onChangeFilter,
      getTenMinutesBefore
    } = this.props;
    const params = {
      stationCode,
      pointCode: "GN010", //前驱测点-固定字段
      deviceFullCodes: [], // 默认传空代表所有风机
      startTime: moment(date[0]).utc().format(),
      endTime: moment(date[1]).utc().format()
    };
    onChangeFilter({
      preDate: date
    });
    // 接口
    getTenMinutesBefore(params);
  };


  render() {
    const {
      faultInfo: {
        endTime
      },
      faultDate,
      preDate,
    } = this.props;
    return (
      <div className={styles.preChartsBox}>
        <div className={styles.preChartsDate}>
          <span>选择日期</span>
          {(endTime) && (
            <DatePicker
              onChange={this.changeFaultDate}
              value={moment(faultDate || endTime, "YYYY-MM-DD")}
            />
          )}
        </div>
        <div className={styles.preChartsDiff}>
          <div>
            发电机前驱温度
          </div>
          <div>
            {(endTime) && (
              <RangePicker
                onChange={this.changePreDate}
                value={preDate.length === 0 ? [
                  moment(endTime, "YYYY/MM/DD").subtract(1,'months'),
                  moment(endTime, "YYYY/MM/DD")
                ] : preDate}
              />
            )}
          </div>
        </div>
        <div ref={(ref) => {
          this.preChart = ref;
        }} className={styles.preCharts} />
      </div>
    );
  }
}
