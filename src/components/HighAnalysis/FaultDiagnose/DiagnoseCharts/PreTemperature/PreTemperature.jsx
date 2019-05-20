import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from 'antd';
import eCharts from "echarts";
import { PreTemperatureOptions } from "../chartsConfig/chartsConfig";
import styles from "./preTemperature.scss";
import moment from "moment";

const { RangePicker } =  DatePicker;
//默认保存echarts dataZoom滑块位置
let paramsStart = 0;
let paramsEnd = 100;

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
    preDate: PropTypes.array,
    preLoading: PropTypes.bool,
    preTimeCompare: PropTypes.number,
    warnId: PropTypes.number,
    getTenMinutesAfter: PropTypes.func,
    getTenMinutesDiff: PropTypes.func,
    faultDateList: PropTypes.string,

  };

  componentDidUpdate(prevProps) {
    const  {
      tenMinutesBeforeList,
      deviceName,
      preLoading,
      faultInfo: {
        stationCode
      },
      getTenMinutesBefore,
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
    if (currentPreTimeCompare && preTimeCompare !== currentPreTimeCompare) {
      // 重新请求回到默认
      paramsStart = 0;
      paramsEnd = 100;
      eCharts.init(preChart).dispose();//销毁前一个实例
      const myChart = eCharts.init(preChart); //构建下一个实例
      myChart.setOption(PreTemperatureOptions(tenMinutesBeforeList, deviceName));
      myChart.on('datazoom', function (params){
        const opt = myChart.getOption();
        const dz = opt.dataZoom[0];
        const start = opt.xAxis[0].data[dz.startValue];
        const end = opt.xAxis[0].data[dz.endValue];
        const preParams = {
          stationCode,
          pointCode: "GN010", //前驱测点-固定字段
          deviceFullcodes: [], // 默认传空代表所有风机
          startTime: moment(start).utc().format(),
          endTime: moment(end).add(1, "days").utc().format()
        };
        if (paramsStart !== params.start || paramsEnd !== params.end) {
          // 每次保存变量
          paramsStart = params.start;
          paramsEnd = params.end;
          // 接口
          getTenMinutesBefore(preParams);
        }
      })
    }
  }

  componentWillUnmount() {
    paramsStart = 0;
    paramsEnd = 100;
  }

  changeFaultDate = (date, dateString) => {
    const {
      onChangeFilter,
      getSimilarityList,
      getAllFanResultList,
      warnId,
      faultInfo:{
        stationCode
      },
      getTenMinutesBefore,
      getTenMinutesAfter,
      getTenMinutesDiff
    } = this.props;
    onChangeFilter({
      faultDate: dateString,
      // 前驱温度时间选择
      preDate: [moment(date, "YYYY/MM/DD").subtract(1,'months'), moment(date, "YYYY/MM/DD")],
      // 后驱温度时间选择
      afterDate: [moment(date, "YYYY/MM/DD").subtract(1,'months'), moment(date, "YYYY/MM/DD")],
      // 后驱温度时间选择
      diffDate: [moment(date, "YYYY/MM/DD").subtract(1,'months'), moment(date, "YYYY/MM/DD")],
    });
    const taskId = localStorage.getItem("taskId");
    // 发电机前驱温度
    const preParams = {
      stationCode,
      pointCode: "GN010", //前驱测点-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: moment(date).subtract(1,'months').utc().format(),
      endTime: moment(date).add(1, "days").utc().format()
    };
    // 发电机后驱温度
    const afterParams = {
      stationCode,
      pointCode: "GN011", //后驱测点-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: moment(date).subtract(1,'months').utc().format(),
      endTime: moment(date).add(1, "days").utc().format()
    };
    // 发电机后驱温度
    const diffParams = {
      stationCode,
      pointCode: "GN010-GN011", //温度差-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: moment(date).subtract(1,'months').utc().format(),
      endTime: moment(date).add(1, "days").utc().format()
    };
    // 相似性热图和所有风机
    const heatAndAllFansParams = {
      taskId,
      date: dateString
    };
    // 调接口
    getTenMinutesBefore(preParams);
    getTenMinutesAfter(afterParams);
    getTenMinutesDiff(diffParams);
    // 有故障
    if (warnId === 1) {
      // 接口
      getSimilarityList(heatAndAllFansParams);
      getAllFanResultList(heatAndAllFansParams);
    }
  };

  changePreDate = (date) => {
    const {
      faultInfo:{
        stationCode
      },
      onChangeFilter,
      getTenMinutesBefore
    } = this.props;
    const params = {
      stationCode,
      pointCode: "GN010", //前驱测点-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: moment(date[0]).utc().format(),
      endTime: moment(date[1]).add(1, "days").utc().format()
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
      faultDateList
    } = this.props;
    return (
      <div className={styles.preChartsBox}>
        <div className={styles.preChartsDate}>
          <span>选择日期</span>
          {(endTime) && (
            <DatePicker
              dateRender={(current) => {
                const style = {};
                faultDateList && faultDateList.split(",").map(cur => {
                  if (moment(current).format('YYYY-MM-DD') === moment(cur).format('YYYY-MM-DD')) {
                    style.border = '1px solid #a42b2c';
                    style.borderRadius = '50%';
                    style.color = "#ffffff";
                    style.backgroundColor = "#a42b2c";
                  }
                });
                return (
                  <div className="ant-calendar-date" style={style}>
                    {current.date()}
                  </div>
                );
              }}
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
