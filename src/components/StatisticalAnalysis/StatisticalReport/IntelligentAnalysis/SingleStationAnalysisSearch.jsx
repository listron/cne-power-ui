import React, { Component } from 'react';
import PropTypes from 'prop-types';
import path from '../../../../constants/path';
import styles from './intelligentAnalysis.scss';
import StationSelect from '../../../Common/StationSelect';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import moment from 'moment';
import { Button, message } from 'antd';

const { APIBasePath } = path.basePaths;
const { statisticalAnalysis } = path.APISubPaths;

class SingleStationAnalysisSearch extends Component {

  static propTypes = {
    stations: PropTypes.array,
    stationName: PropTypes.string,
    stationCode: PropTypes.number,
    changeIntelligentAnalysisStore: PropTypes.func,
    getSingleStationAnalysis: PropTypes.func,
    dateType: PropTypes.number,
    month: PropTypes.string,
    year: PropTypes.string,
    downLoadFile: PropTypes.func,
    reportShow: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      startTime: moment().subtract(1, 'months').format('YYYY-MM-DD'),
    };
  }

  componentDidMount(){
    const { stations } = this.props;
    if (stations.length > 0) {
      this.getStationData(this.props);
    }
  }

  getStationData = (props) => {
    const { dateType, stations, stationCode, stationName, changeIntelligentAnalysisStore, getSingleStationAnalysis } = props;
    const { startTime } = this.state;
    const initStations = stations.filter(e => e.stationType === 1);
    const prams = {
      stationCode: stationCode ? stationCode : initStations[0].stationCode,
      stationName: stationName ? stationName : initStations[0].stationName,
      dateType,
      month: moment(startTime).format('M'),
      year: moment(startTime).format('YYYY'),
    };
    changeIntelligentAnalysisStore({
      ...prams,
    });
    getSingleStationAnalysis({
      dateType,
      month: moment(startTime).format('M'),
      year: moment(startTime).format('YYYY'),
      stationCode: stationCode ? stationCode : initStations[0].stationCode,
    });
  }

  onTimeChange = (value) => { // 选择时间
    const { changeIntelligentAnalysisStore } = this.props;
    const { startTime, timeStyle } = value;
    changeIntelligentAnalysisStore({ startTime });
    if (timeStyle === 'month') {
      changeIntelligentAnalysisStore({
        dateType: 2,
        year: moment(startTime).format('YYYY'),
      });
    } else if (timeStyle === 'day') {
      changeIntelligentAnalysisStore({
        dateType: 1,
        year: moment(startTime).format('YYYY'),
        month: moment(startTime).format('M'),
      });
    }
  }

  selectStation = (selectedStationInfo) => { // 选择电站
    this.props.changeIntelligentAnalysisStore({
      stationCode: selectedStationInfo[0].stationCode,
      stationName: selectedStationInfo[0].stationName,
    });
  }

  searchInfo = () => { // 查询
    const { getSingleStationAnalysis, changeIntelligentAnalysisStore, stationCode, stationName, year, month, dateType } = this.props;
    if (!stationCode) {
      message.error('请选择电站名称！');
      return;
    }
    if (!moment(year).isValid()) {
      message.error('请选择统计时间！');
      return;
    }
    const params = { dateType, year, stationCode };
    dateType === 1 && (params.month = month);
    getSingleStationAnalysis({
      ...params,
    });
    changeIntelligentAnalysisStore({
      ...params,
      stationName,
    });
  }

  exportReport = () => { // 下载
    const { downLoadFile, stationCode, dateType, year, month } = this.props;
    const url = `${APIBasePath}${statisticalAnalysis.exportIntelligent}`;
    downLoadFile({
      url,
      fileName: '',
      params: {
        stationCode,
        dateType,
        year,
        month,
      },
    });
  }

  render() {
    const { stations, stationCode, reportShow, theme } = this.props;
    let station = '';
    stationCode ? station = stations.filter(e => e.stationCode === stationCode) : '';
    return (
      <div className={`${styles.singleStationAnalysisSearch}`}>
        <div className={styles.searchPart}>
          <div className={styles.leftLayout}>
            <div className={styles.stationSelect}>
              <span className={styles.text}>电站选择</span>
              <StationSelect
                disabled={stations.length === 1}
                holderText={'请输入关键字快速查询'}
                data={stations.filter(e => e.stationType === 1)}
                onOK={this.selectStation}
                value={station}
                theme={theme}
              />
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
                theme={theme}
              />
            </div>
            <Button className={styles.searchInfo} onClick={this.searchInfo}>查询</Button>
          </div>
          <Button className={styles.exportReport} onClick={this.exportReport} icon="download" disabled={!reportShow}>下载报告</Button>
        </div>
      </div>
    );
  }
}

export default SingleStationAnalysisSearch;
