import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, DatePicker, Button, message } from 'antd';
import Footer from '../../../../components/Common/Footer';
import moment from 'moment';
import path from '../../../../constants/path';
import axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';

import styles from './analysisReport.scss';
const { MonthPicker } = DatePicker;

const { APIBasePath } = path.basePaths;
const { getReportDay } = path.APISubPaths.statisticalAnalysis;

class AnalysisReport extends Component {
  static propTypes = {
    theme: PropTypes.string,
  };

  constructor(props) {
    super(props);
    // 每个月1号的凌晨3点
    const monthStartDate = moment().startOf('month').format('YYYY-MM-DD 03:00:00');
    // 每个月的当前时间
    const monthNowDate = moment().format('YYYY-MM-DD HH:mm:ss');
    // 每个月当前时间和当月1号时间差
    const diffSeconds = moment(monthStartDate).diff(moment(monthNowDate), 'seconds');
    this.state = {
      // 比较当前时间，小时数是否大于3，也就是凌晨三点
      // 凌晨三点前，默认显示前天，可以选择前天以前的时间；凌晨三点后，默认显示昨天自然天，可以选择昨天以前的时间。
      dayDate: Number(moment().format('HH')) >= 3 ? moment().subtract(1, 'day') : moment().subtract(2, 'day'),
      // 每个月1号凌晨三点前，默认显示上上月，可以选择上上月以前的时间；凌晨三点后，默认显示上月，可以选择上月以前的时间。
      monthDate: diffSeconds >= 0 ? moment().subtract(2, 'months') : moment().subtract(1, 'months'),
      typeDowning: '', // dayReport monthReport
    };
    this.authData = localStorage.getItem('authData');
  }

  disabledDate = (current) => { // 日期不可选
    // 比较当前时间，小时数是否大于3，也就是凌晨三点
    // 凌晨三点前，默认显示前天，可以选择前天以前的时间；凌晨三点后，默认显示昨天自然天，可以选择昨天以前的时间。
    return Number(moment().format('HH')) >= 3 ? current && current > moment().subtract(1, 'days') : current && current > moment().subtract(2, 'days');
  };

  disabledMonthDate = (current) => { // 月份不可选
    // 每个月1号的凌晨3点
    const monthStartDate = moment().startOf('month').format('YYYY-MM-DD 03:00:00');
    // 每个月的当前时间
    const monthNowDate = moment().format('YYYY-MM-DD HH:mm:ss');
    // 每个月当前时间和当月1号时间差
    const diffSeconds = moment(monthStartDate).diff(moment(monthNowDate), 'seconds');
    // 比较每月1号凌晨三点前，默认显示上上月，可以选择上上月以前的时间；凌晨三点后，默认显示上月，可以选择上上月以前的时间。
    return diffSeconds >= 0 ? current && current > moment().subtract(2, 'months') : current && current > moment().subtract(1, 'months');
  };

  changeReportDate = value => { // 日报
    this.setState({
      dayDate: value,
    });
  };

  changeMonthDate = value => { // 月报
    this.setState({
      monthDate: value,
    });
  };

  downloadReport = () => { // 日报下载
    const { typeDowning } = this.state;
    const { dayDate } = this.state;
    const newDate = dayDate.format('YYYY-MM-DD');
    const enterpriseName = Cookie.get('enterpriseName');
    const downloadHref = `${APIBasePath}${getReportDay}?reportDate=${newDate}`;
    const fileName = `${enterpriseName}光伏电站运行日报(${dayDate.format('YYYY年MM月DD日')}).docx`;
    this.setState({ typeDowning: 'dayReport' });
    if (typeDowning !== 'dayReport') {
      this.downLoadFun(downloadHref, fileName, newDate);
    }
  };

  downloadMonthReport = () => { // 月报下载
    const { typeDowning } = this.state;
    console.log(typeDowning, 'typeDowning');
    this.setState({ typeDowning: 'monthReport' });
  };

  downLoadFun = (url, fileName, date) => { // 根据路径，名称，日期，通用下载函数。
    axios.post(url, {}, { responseType: 'blob' }).then(response => {
      const fileContent = response.data;
      if (fileContent) {
        const blob = new Blob([fileContent]);
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
          this.setState({ typeDowning: '' });
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }

      }
    }).catch(warning => {
      this.setState({ typeDowning: '' });
      message.warning('下载失败！请重新下载');
      console.log(warning);
    });
  };

  render() {
    const { dayDate, typeDowning, monthDate } = this.state;
    const { theme } = this.props;
    return (
      <div className={`${styles.analysisReportBox} ${styles[theme]}`}>
        <span ref={'wrap'} />
        <div className={styles.analysisReportContainer}>
          <div className={styles.analysisReportMain}>
            <div className={styles.dailyBox}>
              <div className={styles.boxTop}>
                <div className={styles.dayReport}>
                  <Icon type="download" style={{ color: '#ffffff' }} />
                </div>
                <span className={styles.title}>集团日报</span>
              </div>
              <div className={styles.dateSearch}>
                <DatePicker
                  disabledDate={this.disabledDate}
                  placeholder={'选择时间'}
                  onChange={this.changeReportDate}
                  value={dayDate}
                  getCalendarContainer={() => this.refs.wrap}
                />
              </div>
              <div className={styles.downloadBtn}>
                <Button
                  className={styles.text}
                  onClick={this.downloadReport}
                  disabled={!dayDate}
                  loading={typeDowning === 'dayReport'}
                >
                  下载
                </Button>
              </div>
            </div>
            <div className={styles.dailyBox}>
              <div className={styles.boxTop}>
                <div className={styles.dayReport}>
                  <Icon type="download" style={{ color: '#ffffff' }} />
                </div>
                <span className={styles.title}>集团月报</span>
              </div>
              <div className={styles.dateSearch}>
                <MonthPicker
                  disabledDate={this.disabledMonthDate}
                  placeholder={'选择时间'}
                  onChange={this.changeMonthDate}
                  value={monthDate}
                  getCalendarContainer={() => this.refs.wrap}
                />
              </div>
              <div className={styles.downloadBtn}>
                <Button
                  className={styles.text}
                  onClick={this.downloadMonthReport}
                  disabled={!dayDate}
                  loading={typeDowning === 'monthReport'}
                >
                  下载
                </Button>
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
  theme: state.common.get('theme'),
});

export default connect(mapStateToProps)(AnalysisReport);
