import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from 'antd';
import eCharts from "echarts";
import { diffTemperatureOptions } from "../chartsConfig/chartsConfig";
import styles from "./differenceTemperature.scss";
import moment from "moment";

const { RangePicker } =  DatePicker;
//默认保存echarts dataZoom滑块位置
let paramsStart = 0;
let paramsEnd = 100;

export default class DifferenceTemperature extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    tenMinutesDiffList: PropTypes.array,
    match: PropTypes.object,
    faultInfo: PropTypes.object,
    getTenMinutesDiff: PropTypes.func,
    deviceName: PropTypes.string,
    diffDate: PropTypes.array,
    onChangeFilter: PropTypes.func,
    diffLoading: PropTypes.bool,
    diffTimeCompare: PropTypes.number,
    diffTimeData: PropTypes.array,
  };

  componentDidUpdate(prevProps) {
    const  {
      diffChart,
      props: {
        tenMinutesDiffList,
        deviceName,
        diffLoading,
        getTenMinutesDiff,
        diffTimeCompare: currentDiffTimeCompare,
        faultInfo: {
          stationCode
        },
        diffTimeData
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
    // 设备名称
    if (currentDiffTimeCompare && diffTimeCompare !== currentDiffTimeCompare) {
      eCharts.init(diffChart).dispose();//销毁前一个实例
      const myChart = eCharts.init(diffChart); //构建下一个实例
      myChart.setOption(diffTemperatureOptions(tenMinutesDiffList, deviceName, paramsStart, paramsEnd, diffTimeData));
      myChart.on('datazoom', function (params){
        const opt = myChart.getOption();
        const dz = opt.dataZoom[0];
        const start = opt.xAxis[0].data[dz.startValue];
        const end = opt.xAxis[0].data[dz.endValue];
        const preParams = {
          stationCode,
          pointCode: "GN010-GN011", //温度差-固定字段
          deviceFullcodes: [], // 默认传空代表所有风机
          startTime: moment(start).utc().format(),
          endTime: moment(end).add(1, "days").utc().format()
        };
        if (paramsStart !== params.start || paramsEnd !== params.end) {
          // 每次保存变量
          paramsStart = params.start;
          paramsEnd = params.end;
          // 接口
          getTenMinutesDiff(preParams);
        }
      })
    }
  }

  componentWillUnmount() {
    paramsStart = 0;
    paramsEnd = 100;
  }

  changeAfterDate = (date) => {
    const {
      faultInfo: {
        stationCode
      },
      onChangeFilter,
      getTenMinutesDiff
    } = this.props;
    const params = {
      stationCode,
      pointCode: "GN010-GN011", //温度差-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: moment(date[0]).utc().format(),
      endTime: moment(date[1]).add(1, "days").utc().format()
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
