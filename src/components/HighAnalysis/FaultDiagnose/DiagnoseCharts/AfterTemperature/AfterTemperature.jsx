import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import eCharts from 'echarts';
import moment from 'moment';
import { afterTemperatureOptions } from '../chartsConfig/chartsConfig';
import DataZoom from '../../../../../components/Common/DataZoom/DataZoom';

import styles from './afterTemperature.scss';

const { RangePicker } = DatePicker;

export default class AfterTemperature extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    tenMinutesAfterList: PropTypes.array,
    getTenMinutesAfter: PropTypes.func,
    match: PropTypes.object,
    deviceName: PropTypes.string,
    faultInfo: PropTypes.object,
    onChangeFilter: PropTypes.func,
    afterDate: PropTypes.array,
    afterLoading: PropTypes.bool,
    afterTimeCompare: PropTypes.number,
    afterTimeData: PropTypes.array,
    afterDataZoomStart: PropTypes.number,
    afterDataZoomEnd: PropTypes.number,
  };

  componentDidUpdate(prevProps) {
    const {
      afterChart,
      props: {
        tenMinutesAfterList,
        deviceName,
        afterLoading,
        afterTimeCompare: currentAfterTimeCompare,
      },
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
    if (currentAfterTimeCompare && afterTimeCompare !== currentAfterTimeCompare) {
      eCharts.init(afterChart).clear();//清除
      const myChart = eCharts.init(afterChart); //构建下一个实例
      myChart.setOption(afterTemperatureOptions(tenMinutesAfterList, deviceName));
    }
  }

  changeAfterDate = (date) => {
    const {
      faultInfo: {
        stationCode,
      },
      onChangeFilter,
      getTenMinutesAfter,
    } = this.props;
    const params = {
      stationCode,
      pointCode: 'GN011', //后驱测点-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: moment(date[0]).utc().format(),
      endTime: moment(date[1]).add(1, 'days').utc().format(),
      queryFlag: true, // 判断是否重新存贮时间轴
    };
    onChangeFilter({
      afterDate: date,
      afterDataZoomStart: 0,
      afterDataZoomEnd: 100,
    });
    // 接口
    getTenMinutesAfter(params);
  };

  // dataZoom滑块
  dataZoomFunc = (start, end, startZoom, endZoom) => {
    const {
      getTenMinutesAfter,
      faultInfo: {
        stationCode,
      },
      onChangeFilter,
    } = this.props;
    const afterParams = {
      stationCode,
      pointCode: 'GN011', //后驱测点-固定字段
      deviceFullcodes: [], // 默认传空代表所有风机
      startTime: moment(start).utc().format(),
      endTime: moment(end).utc().format(),
      queryFlag: false, // 判断是否重新存贮时间轴
    };
    onChangeFilter({
      afterDataZoomStart: startZoom,
      afterDataZoomEnd: endZoom,
    });
    // 接口
    getTenMinutesAfter(afterParams);

  };

  render() {
    const {
      faultInfo: {
        endTime,
      },
      afterDate,
      afterDataZoomStart,
      afterDataZoomEnd,
      afterTimeData,
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
                allowClear={false}
                onChange={this.changeAfterDate}
                value={afterDate.length === 0 ? [
                  moment(endTime, 'YYYY/MM/DD').subtract(1, 'months'),
                  moment(endTime, 'YYYY/MM/DD'),
                ] : afterDate}
              />
            )}
          </div>
        </div>
        <div className={styles.afterChartBox}>
          <div ref={(ref) => {
            this.afterChart = ref;
          }} className={styles.afterCharts} />
          <DataZoom
            styleData={{top: '220px'}}
            paramsStart={afterDataZoomStart}
            paramsEnd={afterDataZoomEnd}
            onChange={this.dataZoomFunc}
            xAxisData={afterTimeData}
          />
        </div>
      </div>
    );
  }
}
