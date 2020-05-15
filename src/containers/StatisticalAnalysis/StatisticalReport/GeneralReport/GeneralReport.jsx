import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, DatePicker, message } from 'antd';
import styles from './generalReport.scss';
import StationSelect from '../../../../components/Common/StationSelect';
import Footer from '../../../../components/Common/Footer';
import moment from 'moment';
import path from '../../../../constants/path';
import axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import { enterpriseKey } from '../../../../constants/enterpriseKey';
import CneButton from '@components/Common/Power/CneButton';

const { APIBasePath } = path.basePaths;
const { dailyreport, faultReport, genReport, indicatorReport, preViewXlsx, performanceReport, performanceGroup } = path.APISubPaths.statisticalAnalysis;
const { MonthPicker } = DatePicker;

class GeneralReport extends Component {
  static propTypes = {
    theme: PropTypes.string,
    stations: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      reportDate: moment().subtract(1, 'day'),
      faultDate: moment().subtract(1, 'day'),
      eleInfoDate: moment().subtract(1, 'day'),
      proOperationDate: moment().subtract(1, 'month'),
      windPowerValue: moment().subtract(1, 'month'),
      pvPowerValue: moment().subtract(1, 'month'),
      powerPlantValue: moment(),
      selectedStation: [],
      windPowerStation: [],
      pvPowerStation: [],
      typeDowning: '', // report  fault eleInfo proOperate
      isOpen: false, // 控制选择年份
      extraFooterFlag: false, // 是否显示页脚
    };
    this.authData = localStorage.getItem('authData');
  }

  ChangeReportDate = value => { // 日报
    this.setState({
      reportDate: value,
    });
  };

  ChangeFaultDate = value => { //故障日报
    this.setState({
      faultDate: value,
    });
  };

  ChangeEleInfoDate = value => {//发电量信息汇总
    this.setState({
      eleInfoDate: value,
    });
  };

  ChangeProOperationDate = value => { // 生产指标运行
    this.setState({
      proOperationDate: value,
    });
  };

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

  selectStation = selectedStation => {
    this.setState({ selectedStation });
  };

  selectWindStation = selectedStation => {
    this.setState({ windPowerStation: selectedStation });
  };

  selectPvStation = selectedStation => {
    this.setState({ pvPowerStation: selectedStation });
  };

  preViewReport = () => {
    const { reportDate } = this.state;
    const time = reportDate.format('YYYY-MM-DD');
    const fileName = `${time}日报.xlsx`;
    const url = `${APIBasePath}/${dailyreport}/${time}`;
    this.previewFunc(fileName, url);
  };

  downloadReport = () => { // 日报下载
    const { typeDowning } = this.state;
    let { reportDate } = this.state;
    reportDate = reportDate.format('YYYY-MM-DD');
    const downloadHref = `${APIBasePath}/${dailyreport}/${reportDate}`;
    const fileName = `${reportDate}日报.xlsx`;
    this.setState({ typeDowning: 'report' });
    if (typeDowning !== 'report') {
      this.downLoadFun(downloadHref, fileName, reportDate);
    }
  };

  preViewFault = () => {
    const { faultDate } = this.state;
    const time = faultDate.format('YYYY-MM-DD');
    const fileName = `${time}故障日报.xlsx`;
    const url = `${APIBasePath}/${faultReport}/${time}`;
    this.previewFunc(fileName, url);
  };

  downloadFault = () => { // 故障日报
    const { typeDowning } = this.state;
    let { faultDate } = this.state;
    faultDate = faultDate.format('YYYY-MM-DD');
    const downloadHref = `${APIBasePath}/${faultReport}/${faultDate}`;
    const fileName = `${faultDate}故障日报.xlsx`;
    this.setState({ typeDowning: 'fault' });
    if (typeDowning !== 'fault') {
      this.downLoadFun(downloadHref, fileName, faultDate);
    }
  };

  preViewGenInfo = () => {
    const { eleInfoDate } = this.state;
    const time = eleInfoDate.format('YYYY-MM-DD');
    const fileName = `${time}发电量信息汇总.xlsx`;
    const url = `${APIBasePath}/${genReport}/${time}`;
    this.previewFunc(fileName, url);
  };

  downloadGenInfo = () => { // 发电量信息下载
    const { typeDowning } = this.state;
    let { eleInfoDate } = this.state;
    eleInfoDate = eleInfoDate.format('YYYY-MM-DD');
    const downloadHref = `${APIBasePath}/${genReport}/${eleInfoDate}`;
    const fileName = `${eleInfoDate}发电量信息汇总.xlsx`;
    this.setState({ typeDowning: 'eleInfo' });
    if (typeDowning !== 'eleInfo') {
      this.downLoadFun(downloadHref, fileName, eleInfoDate);
    }
  };

  preViewIndicator = () => {
    const { proOperationDate, selectedStation } = this.state;
    const { stationCode } = selectedStation[0];
    const indicatorYear = proOperationDate.format('YYYY');
    const indicatorMonth = proOperationDate.format('MM');
    const fileName = `${proOperationDate}生产指标运行.xlsx`;
    const url = `${APIBasePath}/${indicatorReport}/${stationCode}/${indicatorYear}/${indicatorMonth}`;
    this.previewFunc(fileName, url);
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

  downloadIndicator = () => { // 生产运营指标下载
    const { proOperationDate, selectedStation, typeDowning } = this.state;
    const { stationCode } = selectedStation[0];
    const indicatorYear = proOperationDate.format('YYYY');
    const indicatorMonth = proOperationDate.format('MM');
    const downloadHref = `${APIBasePath}/${indicatorReport}/${stationCode}/${indicatorYear}/${indicatorMonth}`;
    const fileName = `${proOperationDate}生产指标运行.xlsx`;
    this.setState({ typeDowning: 'proOperate' });
    if (typeDowning !== 'proOperate') {
      this.downLoadFun(downloadHref, fileName, proOperationDate);
    }
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

  // 电厂月报下载
  downloadPowerPlant = () => {
    const { powerPlantValue, typeDowning } = this.state;
    const powerPlantYear = powerPlantValue.format('YYYY');
    const downloadHref = `${APIBasePath}/${performanceGroup}/${powerPlantYear}`;
    const fileName = `${powerPlantYear}年电厂月报.xlsx`;
    this.setState({ typeDowning: 'powerPlantLoading' });
    if (typeDowning !== 'powerPlantLoading') {
      this.downLoadFun(downloadHref, fileName, powerPlantValue);
    }
  };

  // 电厂月报预览
  preViewPowerPlant = () => {
    const { powerPlantValue } = this.state;
    const powerPlantYear = powerPlantValue.format('YYYY');
    const fileName = `${powerPlantYear}年电厂月报.xlsx`;
    const url = `${APIBasePath}/${performanceGroup}/${powerPlantYear}`;
    this.previewFunc(fileName, url);
  };

  previewFunc = (fileName, resUrl) => {
    // 不需要/api的预览地址
    const prevBaseUrl = `${APIBasePath.split('/api')[0]}${preViewXlsx}`;
    // 要查看的预览地址
    const baseUrl = `${resUrl}?fullfilename=${fileName}&method=POST&auth=bearer ${this.authData}`;
    // 新页面打开
    window.open(`${prevBaseUrl}?url=${encodeURIComponent(baseUrl)}`, '_blank');
  };

  // 关闭时间面板
  onPanelChange = (date) => {
    // 当前的年份
    const currentTime = moment().format('YYYY');
    // 选择的年份
    const nowTime = moment(date).format('YYYY');
    if(Number(nowTime) > Number(currentTime)) {
      return this.setState({
        isOpen: true,
        extraFooterFlag: true, // 显示页脚
      });
    }
    return this.setState({
      isOpen: false,
      powerPlantValue: date,
      extraFooterFlag: false, // 隐藏页脚
    });
  };

  // 判断开关时间选择框
  handleOpenChange = (status) => this.setState({isOpen: !!status});

  // 清空电厂下载时间框
  clearPlantValueFunc = () => this.setState({powerPlantValue: null});

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

  dateRenderDate = (currentDate, today) => {
    // console.log(currentDate, today, '-----');
    console.log(moment(currentDate).format('YYYY'), moment(today).format('YYYY'), '-----');
  };

  render() {
    const { reportDate, faultDate, eleInfoDate, proOperationDate, selectedStation, typeDowning, windPowerValue, pvPowerValue, windPowerStation, pvPowerStation, powerPlantValue, isOpen, extraFooterFlag } = this.state;
    const { stations, theme } = this.props;
    const enterpriseName = Cookie.get('enterpriseName');
    const enterpriseCode = Cookie.get('enterpriseCode');
    const reportInfo = enterpriseKey.find(e => e.enterpriseName === enterpriseName);
    const windStationArr = stations.filter(e => e.stationType === 0);
    const pvStationArr = stations.filter(e => e.stationType === 1);
    return (
      <div className={`${styles.generalReportBox} ${styles[theme]}`}>
        <span ref={'wrap'} />
        <div className={styles.generalReportContainer}>
          <div className={styles.generalReportMain}>
            <div className={styles.dailyBox}>
              <div className={styles.boxTop}>
                <div className={styles.dayReport}>
                  <Icon type="download" style={{ color: '#ffffff' }} />
                </div>
                <span className={styles.title}>日报</span>
              </div>
              <div className={styles.dateSearch}>
                <DatePicker
                  style={{width: 200}}
                  disabledDate={this.disabledDate}
                  placeholder={'选择时间'}
                  onChange={this.ChangeReportDate}
                  value={reportDate}
                  getCalendarContainer={() => this.refs.wrap}
                />
              </div>
              <div className={styles.downloadBtn}>
                <CneButton className={`${styles.text} ${styles.preview}`} onClick={this.preViewReport} disabled={!reportDate}>预览</CneButton>
                {/* <span className={styles.line} /> */}
                <CneButton className={styles.text} onClick={this.downloadReport} disabled={!reportDate}
                           loading={typeDowning === 'report'}>下载</CneButton>
              </div>
            </div>
            {reportInfo && reportInfo.showAllReport && <div className={styles.dailyBox}>
              <div className={styles.boxTop}>
                <div className={styles.defaultReport}>
                  <Icon type="download" style={{ color: '#ffffff' }} />
                </div>
                <span className={styles.title}>故障日报</span>
              </div>
              <div className={styles.dateSearch}>
                <DatePicker
                  style={{width: 200}}
                  disabledDate={this.disabledDate}
                  placeholder={'选择时间'}
                  onChange={this.ChangeFaultDate}
                  value={faultDate}
                  getCalendarContainer={() => this.refs.wrap}
                />
              </div>
              <div className={styles.downloadBtn}>
                <CneButton disabled={!faultDate} onClick={this.preViewFault} className={styles.text}>预览</CneButton>
                {/* <span className={styles.line} /> */}
                <CneButton disabled={!faultDate} onClick={this.downloadFault} className={styles.text} loading={typeDowning === 'fault'}>下载</CneButton>
              </div>
            </div>}
            {reportInfo && reportInfo.showAllReport && <div className={styles.dailyBox}>
              <div className={styles.boxTop}>
                <div className={styles.eleInfo}>
                  <Icon type="download" style={{ color: '#ffffff' }} />
                </div>
                <span className={styles.title}>发电量信息汇总</span>
              </div>
              <div className={styles.dateSearch}>
                <DatePicker
                  style={{width: 200}}
                  disabledDate={this.disabledDate}
                  placeholder={'选择时间'}
                  onChange={this.ChangeEleInfoDate}
                  value={eleInfoDate}
                  getCalendarContainer={() => this.refs.wrap}
                />
              </div>
              <div className={styles.downloadBtn}>
                <CneButton disabled={!eleInfoDate} className={styles.text} onClick={this.preViewGenInfo}>预览</CneButton>
                {/* <span className={styles.line} /> */}
                <CneButton disabled={!eleInfoDate} className={styles.text} onClick={this.downloadGenInfo} loading={typeDowning === 'eleInfo'}>下载</CneButton>
              </div>
            </div>}
            { reportInfo && reportInfo.showAllReport && <div className={styles.dailyBox}>
              <div className={styles.boxTop}>
                <div className={styles.proOperation}>
                  <Icon type="download" style={{ color: '#ffffff' }} />
                </div>
                <span className={styles.title}>生产指标运行</span>
              </div>
              <div className={styles.dateSearch}>
                <MonthPicker
                  style={{width: 200}}
                  disabledDate={this.disabledDate}
                  placeholder={'选择月份'}
                  onChange={this.ChangeProOperationDate}
                  value={proOperationDate}
                  getCalendarContainer={() => this.refs.wrap}
                />
              </div>
              <div className={styles.stationSearchs}>
                <StationSelect
                  data={stations}
                  onOK={this.selectStation}
                  value={selectedStation}
                  holderText="请选择电站"
                  theme={theme}
                />
              </div>
              <div className={styles.downloadBtn}>
                <CneButton
                  disabled={selectedStation.length === 0 || !proOperationDate}
                  className={styles.text}
                  onClick={this.preViewIndicator}
                >预览</CneButton>
                {/* <span className={styles.line} /> */}
                <CneButton
                  disabled={selectedStation.length === 0 || !proOperationDate}
                  className={styles.text}
                  onClick={this.downloadIndicator}
                  loading={typeDowning === 'proOperate'}
                >下载</CneButton>
              </div>
            </div>}
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
            <div className={styles.dailyBox}>
              <div className={styles.boxTop}>
                <div className={styles.dayReport}>
                  <Icon type="download" style={{ color: '#ffffff' }} />
                </div>
                <span className={styles.title}>电厂月报</span>
              </div>
              <div className={styles.dateSearch}>
                <DatePicker
                  open={isOpen}
                  value={powerPlantValue}
                  style={{width: 200}}
                  dropdownClassName={styles.powerPlantBox}
                  placeholder="选择年份"
                  format="YYYY"
                  onPanelChange={this.onPanelChange}
                  onOpenChange={this.handleOpenChange}
                  onChange={this.clearPlantValueFunc}
                  mode="year"
                  renderExtraFooter={() => (
                    <span className={styles.infoTip}>{extraFooterFlag ? '*不可选择今年以后的年份' : ''}</span>
                  )}
                />
              </div>
              <div className={styles.downloadBtn}>
                <CneButton
                  disabled={!powerPlantValue}
                  className={`${styles.text} ${styles.preview}`}
                  onClick={this.preViewPowerPlant}
                >预览</CneButton>
                {/*<span className={styles.line} />*/}
                <CneButton
                  disabled={!powerPlantValue}
                  className={styles.text}
                  onClick={this.downloadPowerPlant}
                  loading={typeDowning === 'powerPlantLoading'}
                >下载</CneButton>
              </div>
            </div>
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

export default connect(mapStateToProps)(GeneralReport);
