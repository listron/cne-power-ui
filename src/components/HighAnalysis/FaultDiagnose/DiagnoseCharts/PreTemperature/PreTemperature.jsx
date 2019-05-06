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
    preTimeCompare: PropTypes.number,
    warnId: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const  {
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
    myChart.setOption(PreTemperatureOptions(tenMinutesBeforeList, deviceName));
  }

  componentDidUpdate(prevProps) {
    const  {
      tenMinutesBeforeList,
      deviceName,
      stationDeviceList,
      preLoading,
      preTimeCompare: currentPreTimeCompare
    } = this.props;
    const { preTimeCompare } = prevProps;
    const { preChart } = this;
    const myChart = eCharts.init(preChart);
    if (preLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!preLoading) {
      myChart.hideLoading();
    }
    // 单风机的时候需要从这里获取
    const defaultName = localStorage.getItem("deviceName");
    // 设备名称
    const name = deviceName ? deviceName : stationDeviceList[0].deviceName;
    if (currentPreTimeCompare && preTimeCompare !== currentPreTimeCompare) {
      myChart.setOption(PreTemperatureOptions(tenMinutesBeforeList, name || defaultName));
    }
  }

  changeFaultDate = (date, dateString) => {
    const {
      onChangeFilter,
      getSimilarityList,
      getAllFanResultList,
      warnId
    } = this.props;
    onChangeFilter({
      faultDate: dateString
    });
    const taskId = localStorage.getItem("taskId");
    // 相似性热图和所有风机
    const heatAndAllFansParams = {
      taskId,
      date: dateString
    };
    // 有故障
    if (warnId === 1) {
      getSimilarityList(heatAndAllFansParams);
      getAllFanResultList(heatAndAllFansParams);
    }
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
