import React, { Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import moment from 'moment';
import path from '../../../../constants/path';
import { Button, Select, message } from 'antd';

const Option = Select.Option;

const { APIBasePath } = path.basePaths;
const { statisticalAnalysis } = path.APISubPaths;

class AreaStationSearch extends Component {

  static propTypes = {
    stations: PropTypes.array,
    regionName: PropTypes.string,
    startTime: PropTypes.string,
    changeIntelligentAnalysisStore: PropTypes.func,
    getAreaStation: PropTypes.func,
    downLoadFile: PropTypes.func,
    reportShow: PropTypes.bool,
    month: PropTypes.string,
    year: PropTypes.string,
    dateType: PropTypes.number,
    areaName: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      regionName: '',
      year: '',
      month: '',
      dateType: '',
      startTime: moment().subtract(0, 'months').format('YYYY-MM-DD'),
    }
  }

  onTimeChange = (value) => { // 选择时间
    const { startTime, timeStyle } = value;
    let dateType = timeStyle === 'month' ? 2 : 1;
    if (timeStyle === 'month') {
      this.setState({
        dateType: 2,
        year: moment(startTime).format('YYYY'),
      })
    } else if (timeStyle === 'day') {
      this.setState({
        dateType: 1,
        year: moment(startTime).format('YYYY'),
        month: moment(startTime).format('M'),
      })
    }
  }

  selectArea = (selectAreaName) => { // 选择区域
    this.setState({
      regionName: selectAreaName
    })
  }

  searchInfo = () => { // 查询
    const { getAreaStation, changeIntelligentAnalysisStore, areaName } = this.props;
    const { year, month, dateType, regionName } = this.state;
    if (!regionName) {
      message.error("请选择区域名称！");
      return;
    }
    if (!moment(year).isValid()) {
      message.error("请选择统计时间！");
      return;
    }
    const params = { areaName, year, dateType };
    dateType === 1 && (params.month = month);
    getAreaStation({
      ...params,
      areaName: regionName
    })
    changeIntelligentAnalysisStore({
      ...params
    })
  }

  exportReport = () => { // 下载
    const { downLoadFile, areaName, dateType, year, month } = this.props;
    const url = `${APIBasePath}${statisticalAnalysis.exportAreaStation}`;
    downLoadFile({
      url,
      fileName: `同区域电站对比报告`,
      params: {
        areaName,
        dateType,
        year,
        month
      },
    })
  }

  render() {
    const { stations, reportShow } = this.props;
    const { regionName } = this.state;

    let regionSet = new Set();
    stations.forEach(e => {
      e.regionName && regionSet.add(e.regionName);
    });

    return (
      <div className={styles.areaStationSearch}>
        <div className={styles.searchPart}>
          <div className={styles.leftLayout}>
            <span ref="wrap" />
            <div className={styles.regionStationSelect}>
              <span className={styles.text}>区域选择</span>
              <Select
                className={styles.searchInput}
                placeholder="请选择"
                value={!regionName ? undefined : regionName}
                getPopupContainer={() => this.refs.wrap}
                onChange={this.selectArea}>
                <Option value={null}>请选择</Option>
                {[...regionSet].map(e => (
                  <Option value={e} key={e}>{e}</Option>
                ))}
              </Select>
            </div>
            <div className={styles.dateSelect}>
              <span className={styles.text}>统计时间</span>
              <TimeSelect
                showYearPick={false}
                onChange={this.onTimeChange}
                timerText={''}
                refuseDefault={true}
                value={{
                  timeStyle: 'day',
                  startTime: moment().subtract(1, 'months').format('YYYY-MM-DD'),
                  endTime: moment().subtract(1, 'months').format('YYYY-MM-DD'),
                }}
              />
            </div>
            <Button className={styles.searchInfo} onClick={this.searchInfo}>查询</Button>
          </div>
          <Button className={styles.exportReport} onClick={this.exportReport} icon="download" disabled={!reportShow}>下载报告</Button>
        </div>
      </div>
    )
  }
}

export default AreaStationSearch;