import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './realtimeStyle.scss';
import path from '../../../../constants/path';
import { message } from 'antd';

const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;

class RealtimeDataType extends Component {

  static propTypes = {
    downloading: PropTypes.bool,
    realtimeType:  PropTypes.string,
    queryParam: PropTypes.object,
    chartRealtime: PropTypes.object,
    listParam: PropTypes.object,
    changeRealtimeStore: PropTypes.func,
    downLoadFile: PropTypes.func,
    getRealtimeChart: PropTypes.func,
    getRealtimeList: PropTypes.func,
    stopRealtimeChart: PropTypes.func,
    stopRealtimeList: PropTypes.func,
    endTime: PropTypes.string,
    startTime: PropTypes.string,
  };

  showChart = () => { // 若已选测点=>终止当前请求启动图表定时请求,若未选测点则存储属性
    const { changeRealtimeStore, queryParam, getRealtimeChart, stopRealtimeList, chartRealtime } = this.props;
    const { devicePoints } = queryParam;
    if (devicePoints.length > 0) {
      stopRealtimeList();
      getRealtimeChart({ queryParam });
      changeRealtimeStore({
        realtimeType: 'chart',
        // chartRealtime: {}
      });
    } else {
      changeRealtimeStore({ realtimeType: 'chart' });
    }
  }

  showList = () => { // 若已选测点=>终止当前请求启动列表定时请求,未选测点则存储属性
    const { changeRealtimeStore, queryParam, listParam, getRealtimeList, stopRealtimeChart } = this.props;
    const { devicePoints = [] } = queryParam;
    if (devicePoints.length > 0) {
      stopRealtimeChart(); 
      getRealtimeList({ queryParam, listParam });
      changeRealtimeStore({
        realtimeType: 'list',
        listRealtime: {}
      });
    } else {
      changeRealtimeStore({ realtimeType: 'list' });
    }
  }

  exportRealtime = () => { // '导出实时数据excel'
    const { startTime, downLoadFile, queryParam } = this.props;
    const clickEndTime = moment(moment().format("YYYY-MM-DD hh:mm:ss"),'YYYY-MM-DD hh:mm:ss'); // 点击导出按钮时间
    if (clickEndTime.diff(startTime, 'minute') > 30) {
      return message.warning('最多支持导出最近半小时数据');
    }

    const url = `${APIBasePath}${monitor.exportRealtime}`;
    const { deviceFullCodes, devicePoints } = queryParam;
    const timeZone = moment().zone() / (-60);
    downLoadFile({
      url,
      timeZone,
      fileName: '实时数据.xlsx',
      params: {
        ...queryParam,
        deviceFullCodes: deviceFullCodes.map(e => e.deviceCode),
        devicePoints: devicePoints.filter(e => !e.includes('group_')), // 去掉测点的所属分组code
        timeZone,
        startTime: moment(startTime).utc().format(), 
        endTime: moment(clickEndTime).utc().format(),
      },
    })
  }

  render(){
    const { realtimeType, downloading } = this.props;
    return (
      <div className={styles.realtimeDataType}>
        <div className={styles.tabIcons}>
          <Icon onClick={this.showChart} type="bar-chart" className={realtimeType === 'chart'? styles.active : styles.normal} />
          <Icon onClick={this.showList} type="bars" className={realtimeType === 'list'? styles.active : styles.normal} />
        </div>
        {realtimeType === 'list' && <Button
          className={styles.export}
          onClick={this.exportRealtime}
          loading={downloading}
        >导出</Button>}
      </div>
    )
  }
}

export default RealtimeDataType;