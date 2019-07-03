import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import eCharts from 'echarts';
import { diffTemperatureOptions } from '../chartsConfig/chartsConfig';
import moment from 'moment';
import DataZoom from '../../../../../components/Common/DataZoom/DataZoom';

import styles from './differenceTemperature.scss';

const { RangePicker } = DatePicker;

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
    diffDataZoomStart: PropTypes.number,
    diffDataZoomEnd: PropTypes.number,
  };

  componentDidUpdate(prevProps) {
    const {
      diffChart,
      props: {
        tenMinutesDiffList,
        deviceName,
        diffLoading,
        diffTimeCompare: currentDiffTimeCompare,
      },
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
      eCharts.init(diffChart).clear();//清除
      const myChart = eCharts.init(diffChart); //构建下一个实例
      myChart.setOption(diffTemperatureOptions(tenMinutesDiffList, deviceName));
    }
  }

  changeAfterDate = (date) => {
    const {
      faultInfo: {
        stationCode,
      },
      onChangeFilter,
      getTenMinutesDiff,
    } = this.props;
    const params = {
      stationCode,
      pointCode: 'GN010-GN011', //温度差-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: moment(date[0]).utc().format(),
      endTime: moment(date[1]).add(1, 'days').utc().format(),
      queryFlag: true, // 判断是否重新存贮时间轴
    };
    onChangeFilter({
      diffDate: date,
      diffDataZoomStart: 0,
      diffDataZoomEnd: 100,
    });
    // 接口
    getTenMinutesDiff(params);
  };

  // dataZoom滑块
  dataZoomFunc = (start, end, startZoom, endZoom) => {
    const {
      getTenMinutesDiff,
      faultInfo: {
        stationCode,
      },
      onChangeFilter,
    } = this.props;
    const afterParams = {
      stationCode,
      pointCode: 'GN010-GN011', //温度差-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: moment(start).utc().format(),
      endTime: moment(end).utc().format(),
      queryFlag: false, // 判断是否重新存贮时间轴
    };
    onChangeFilter({
      diffDataZoomStart: startZoom,
      diffDataZoomEnd: endZoom,
    });
    // 接口
    getTenMinutesDiff(afterParams);

  };

  render() {
    const {
      faultInfo: {
        endTime,
      },
      diffDate,
      diffDataZoomStart,
      diffDataZoomEnd,
      diffTimeData,
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
                allowClear={false}
                onChange={this.changeAfterDate}
                value={diffDate.length === 0 ? [
                  moment(endTime, 'YYYY-MM-DD').subtract(1, 'months'),
                  moment(endTime, 'YYYY-MM-DD'),
                ] : diffDate}
              />
            )}
          </div>
        </div>
        <div className={styles.afterChartBox}>
          <div ref={(ref) => {
            this.diffChart = ref;
          }} className={styles.diffCharts} />
          <DataZoom
            styleData={{top: '220px'}}
            paramsStart={diffDataZoomStart}
            paramsEnd={diffDataZoomEnd}
            onChange={this.dataZoomFunc}
            xAxisData={diffTimeData}
          />
        </div>
      </div>
    );
  }
}
