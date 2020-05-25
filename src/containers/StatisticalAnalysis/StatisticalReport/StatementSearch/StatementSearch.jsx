import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, DatePicker, message } from 'antd';
import styles from './statementSearch.scss';
import StationSelect from '../../../../components/Common/StationSelect';
import Footer from '../../../../components/Common/Footer';
import moment from 'moment';
import path from '../../../../constants/path';
import axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import CneButton from '@components/Common/Power/CneButton';

const { APIBasePath } = path.basePaths;
const { preViewXlsx, performanceReport } = path.APISubPaths.statisticalAnalysis;
const { MonthPicker } = DatePicker;

class StatementSearch extends Component {
  static propTypes = {
    theme: PropTypes.string,
    stations: PropTypes.array,
  };

  constructor(props) {
    super(props);
    const { stations } = props;
    // 风电电站
    const windStationArr = stations.filter(e => e.stationType === 0);
    // 光伏电站
    const pvStationArr = stations.filter(e => e.stationType === 1);
    this.state = {
      windPowerValue: moment().subtract(1, 'month'),
      pvPowerValue: moment().subtract(1, 'month'),
      windPowerStation: windStationArr.length === 1 ? windStationArr : [], // 只有一个电站默认显示该电站
      pvPowerStation: pvStationArr.length === 1 ? pvStationArr : [], // 只有一个电站默认显示该电站
      typeDowning: '',
    };
    this.authData = localStorage.getItem('authData');
  }

  windPowerDateChange = value => { // 风电运维月报
    this.setState({
      windPowerValue: value,
    });
  };

  pvPowerDateChange = value => { // 光伏运维月报
    this.setState({
      pvPowerValue: value,
    });
  };

  disabledDate = (current) => { //日期不可选
    return current && current > moment().startOf('day');
  };

  selectWindStation = selectedStation => {
    this.setState({ windPowerStation: selectedStation });
  };

  selectPvStation = selectedStation => {
    this.setState({ pvPowerStation: selectedStation });
  };

  // 风电运维月报预览
  preViewWind = () => {
    const { windPowerValue, windPowerStation } = this.state;
    const { stationCode } = windPowerStation[0];
    const windYear = windPowerValue.format('YYYY');
    const windMonth = windPowerValue.format('MM');
    const fileName = `${windPowerValue}风电运维月报.xlsx`;
    const url = `${APIBasePath}/${performanceReport}/${stationCode}/${windYear}/${windMonth}`;
    this.previewFunc(fileName, url);
  };

  // 光伏运维月报预览
  preViewPv = () => {
    const { pvPowerValue, pvPowerStation } = this.state;
    const { stationCode } = pvPowerStation[0];
    const pvYear = pvPowerValue.format('YYYY');
    const pvMonth = pvPowerValue.format('MM');
    const fileName = `${pvPowerValue}光伏运维月报.xlsx`;
    const url = `${APIBasePath}/${performanceReport}/${stationCode}/${pvYear}/${pvMonth}`;
    this.previewFunc(fileName, url);
  };


  // 风电运维月报下载
  downloadWind = () => {
    const { windPowerValue, windPowerStation, typeDowning } = this.state;
    const { stationCode } = windPowerStation[0];
    const windYear = windPowerValue.format('YYYY');
    const windMonth = windPowerValue.format('MM');
    const downloadHref = `${APIBasePath}/${performanceReport}/${stationCode}/${windYear}/${windMonth}`;
    const fileName = `${windPowerValue}风电运维月报.xlsx`;
    this.setState({ typeDowning: 'windLoading' });
    if (typeDowning !== 'windLoading') {
      this.downLoadFun(downloadHref, fileName, windPowerValue);
    }
  };

  // 光伏运维月报下载
  downloadPv = () => {
    const { pvPowerValue, pvPowerStation, typeDowning } = this.state;
    const { stationCode } = pvPowerStation[0];
    const pvYear = pvPowerValue.format('YYYY');
    const pvMonth = pvPowerValue.format('MM');
    const downloadHref = `${APIBasePath}/${performanceReport}/${stationCode}/${pvYear}/${pvMonth}`;
    const fileName = `${pvPowerValue}光伏运维月报.xlsx`;
    this.setState({ typeDowning: 'pvLoading' });
    if (typeDowning !== 'pvLoading') {
      this.downLoadFun(downloadHref, fileName, pvPowerValue);
    }
  };

  previewFunc = (fileName, resUrl) => {
    // 不需要/api的预览地址
    const prevBaseUrl = `${APIBasePath.split('/api')[0]}${preViewXlsx}`;
    // 要查看的预览地址
    const baseUrl = `${resUrl}?fullfilename=${fileName}&method=POST&auth=bearer ${this.authData}`;
    // 新页面打开
    window.open(`${prevBaseUrl}?url=${encodeURIComponent(baseUrl)}`, '_blank');
  };

  downLoadFun = (url, fileName, date) => { // 根据路径，名称，日期，通用下载函数。
    axios.post(url, {}, { responseType: 'blob' }).then(response => {
      const fileContent = response.data;
      const fileNameInfo = response.headers['content-disposition'];
      let newFileName = fileName;
      if (fileNameInfo) {
        const fileString = fileNameInfo.split(';')[1];
        const fileNameCode = fileString ? fileString.split('=')[1] : '';
        const fileResult = fileNameCode ? decodeURIComponent(fileNameCode) : '';
        fileResult && (newFileName = fileResult);
      }
      if (fileContent) {
        const blob = new Blob([fileContent]);
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a');
          elink.download = newFileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
          this.setState({ typeDowning: '' });
        } else { // IE10+下载
          navigator.msSaveBlob(blob, newFileName);
        }

      }
    }).catch(warning => {
      message.warning('下载失败！请重新尝试');
      console.log(warning);
    });
  };

  render() {
    const { typeDowning, windPowerValue, pvPowerValue, windPowerStation, pvPowerStation } = this.state;
    const { stations, theme } = this.props;
    const enterpriseCode = Cookie.get('enterpriseCode');
    const windStationArr = stations.filter(e => e.stationType === 0);
    const pvStationArr = stations.filter(e => e.stationType === 1);
    return (
      <div className={`${styles.generalReportBox} ${styles[theme]}`}>
        <span ref={'wrap'} />
        <div className={styles.generalReportContainer}>
          <div className={styles.generalReportMain}>
            {(enterpriseCode === '1010' && windStationArr.length > 0) && <div className={styles.dailyBox}>
              <div className={styles.boxTop}>
                <div className={styles.dayReport}>
                  <Icon type="download" style={{ color: '#ffffff' }} />
                </div>
                <span className={styles.title}>风电运维月报</span>
              </div>
              <div className={styles.dateSearch}>
                <MonthPicker
                  style={{width: 200}}
                  disabledDate={this.disabledDate}
                  placeholder={'选择月份'}
                  onChange={this.windPowerDateChange}
                  value={windPowerValue}
                  getCalendarContainer={() => this.refs.wrap}
                />
              </div>
              <div className={styles.stationSearchs}>
                <StationSelect
                  data={windStationArr}
                  onOK={this.selectWindStation}
                  value={windPowerStation}
                  holderText="请选择电站"
                  theme={theme}
                />
              </div>
              <div className={styles.downloadBtn}>
                <CneButton
                  disabled={windPowerStation.length === 0 || !windPowerValue}
                  className={`${styles.text} ${styles.preview}`}
                  onClick={this.preViewWind}
                >预览</CneButton>
                {/*<span className={styles.line} />*/}
                <CneButton
                  disabled={windPowerStation.length === 0 || !windPowerValue}
                  className={styles.text}
                  onClick={this.downloadWind}
                  loading={typeDowning === 'windLoading'}
                >下载</CneButton>
              </div>
            </div>}
            {(enterpriseCode === '1010' && pvStationArr.length > 0) && <div className={styles.dailyBox}>
              <div className={styles.boxTop}>
                <div className={styles.dayReport}>
                  <Icon type="download" style={{ color: '#ffffff' }} />
                </div>
                <span className={styles.title}>光伏运维月报</span>
              </div>
              <div className={styles.dateSearch}>
                <MonthPicker
                  style={{width: 200}}
                  disabledDate={this.disabledDate}
                  placeholder={'选择月份'}
                  onChange={this.pvPowerDateChange}
                  value={pvPowerValue}
                  getCalendarContainer={() => this.refs.wrap}
                />
              </div>
              <div className={styles.stationSearchs}>
                <StationSelect
                  data={pvStationArr}
                  onOK={this.selectPvStation}
                  value={pvPowerStation}
                  holderText="请选择电站"
                  theme={theme}
                />
              </div>
              <div className={styles.downloadBtn}>
                <CneButton
                  disabled={pvPowerStation.length === 0 || !pvPowerValue}
                  className={`${styles.text} ${styles.preview}`}
                  onClick={this.preViewPv}
                >预览</CneButton>
                {/*<span className={styles.line} />*/}
                <CneButton
                  disabled={pvPowerStation.length === 0 || !pvPowerValue}
                  className={styles.text}
                  onClick={this.downloadPv}
                  loading={typeDowning === 'pvLoading'}
                >下载</CneButton>
              </div>
            </div>}
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  stations: state.common.get('stations').toJS(),
  theme: state.common.get('theme'),
});

export default connect(mapStateToProps)(StatementSearch);
