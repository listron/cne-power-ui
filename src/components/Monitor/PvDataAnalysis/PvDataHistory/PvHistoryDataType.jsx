import React, {Component} from 'react';
import {Button, Icon} from 'antd';
import PropTypes from 'prop-types';
import styles from './pvHistoryStyle.scss';
import moment from 'moment';
import path from '../../../../constants/path';
import cookie from 'js-cookie';
import { handleRight } from '@utils/utilFunc';

const {APIBasePath} = path.basePaths;
const {monitor} = path.APISubPaths;

class PvHistoryDataType extends Component {

  static propTypes = {
    downloading: PropTypes.bool,
    enterpriseId: PropTypes.string,
    historyType: PropTypes.string,
    queryParam: PropTypes.object,
    partHistory: PropTypes.object,

    changeHistoryStore: PropTypes.func,
    downLoadFile: PropTypes.func,
  };

  selectHistoryType = (historyType) => { // 切换图表展示类型 'chart'图 / 'list'表格
    const {changeHistoryStore} = this.props;
    changeHistoryStore({historyType});
  };

  showChart = () => {
    this.selectHistoryType('chart');
  };

  showList = () => {
    this.selectHistoryType('list');
  };

  exportHistory = () => { // '导出历史数据excel'
    const {downLoadFile, queryParam, enterpriseId} = this.props;
    const enterpriseCode = cookie.get('enterpriseCode');
    const url = `${APIBasePath}${monitor.exportHistory}`;
    let {startTime, endTime, deviceFullCodes, devicePoints} = queryParam;
    startTime = moment(startTime).utc().format();
    endTime = moment(endTime).utc().format();
    const timeZone = moment().utcOffset() / 60; // utc时区获取
    downLoadFile({ //
      url,
      fileName: `${startTime}至${endTime}历史数据.xlsx`,
      params: {
        ...queryParam,
        deviceFullCodes: deviceFullCodes.map(e => e.deviceCode),
        devicePoints: devicePoints.filter(e => !e.includes('group_')), // 去掉测点的所属分组code
        enterpriseId,
        enterpriseCode,
        timeZone,
        startTime,
        endTime,
      },
    });
  };

  render() {
    const {historyType, downloading, partHistory = {}} = this.props;
    const {dataList = []} = partHistory;
    const historyOperation = handleRight('historyTrendTurbine_export');
    return (
      <div className={styles.historyDataType}>
        <div className={styles.tabIcons}>
          <Icon onClick={this.showChart} type="bar-chart"
                className={historyType === 'chart' ? styles.active : styles.normal}/>
          <Icon onClick={this.showList} type="bars" className={historyType === 'list' ? styles.active : styles.normal}/>
        </div>
        {historyOperation &&
        <Button
          className={styles.export}
          loading={downloading}
          onClick={this.exportHistory}
          disabled={dataList.length === 0}
        >导出</Button>}
      </div>
    );
  }
}

export default PvHistoryDataType;
