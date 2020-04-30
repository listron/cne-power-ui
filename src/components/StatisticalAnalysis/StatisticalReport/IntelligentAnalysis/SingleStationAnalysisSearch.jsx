import React, { Component } from 'react';
import PropTypes from 'prop-types';
import path from '../../../../constants/path';
import styles from './intelligentAnalysis.scss';
import StationSelect from '../../../Common/StationSelect';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import CneButton from '@components/Common/Power/CneButton';
import moment from 'moment';
import { message } from 'antd';

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
      stationCode: '',
      stationName: '',
      year: '',
      month: '',
      dateType: '',
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
    this.setState({
      ...prams,
    });
    changeIntelligentAnalysisStore({
      ...prams,
      dateType: 1,
    });
    getSingleStationAnalysis({
      dateType: 1,
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
      this.setState({
        dateType: 2,
        year: moment(startTime).format('YYYY'),
      });
    } else if (timeStyle === 'day') {
      this.setState({
        dateType: 1,
        year: moment(startTime).format('YYYY'),
        month: moment(startTime).format('M'),
      });
    }
  }

  selectStation = (selectedStationInfo) => { // 选择电站
    this.setState({
      stationCode: selectedStationInfo[0].stationCode,
      stationName: selectedStationInfo[0].stationName,
    });
  }

  searchInfo = () => { // 查询
    const { getSingleStationAnalysis, changeIntelligentAnalysisStore } = this.props;
    const { dateType, month, year, stationCode, stationName } = this.state;
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
    const { stations, reportShow, theme } = this.props;
    const { stationCode } = this.state;
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
            <CneButton lengthMode="short" className={styles.searchInfo} onClick={this.searchInfo}>查询</CneButton>
          </div>
          <CneButton lengthMode="short" className={styles.exportReport} onClick={this.exportReport} antdIcon="download" disabled={!reportShow}>下载报告</CneButton>
        </div>
      </div>
    );
  }
}

export default SingleStationAnalysisSearch;
