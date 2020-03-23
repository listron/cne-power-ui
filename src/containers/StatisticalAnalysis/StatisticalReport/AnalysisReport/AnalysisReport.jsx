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

const { APIBasePath } = path.basePaths;
const { getReportDay } = path.APISubPaths.statisticalAnalysis;

class AnalysisReport extends Component {
  static propTypes = {
    theme: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      // 比较当前时间，小时数是否大于3，也就是凌晨三点
      // 凌晨三点前，默认显示前天，可以选择前天以前的时间；凌晨三点后，默认显示昨天自然天，可以选择昨天以前的时间。
      dayDate: Number(moment().format('HH')) >= 3 ? moment().subtract(1, 'day') : moment().subtract(2, 'day'),
      typeDowning: '', // dayReport
    };
    this.authData = localStorage.getItem('authData');
  }

  disabledDate = (current) => { // 日期不可选
    // 比较当前时间，小时数是否大于3，也就是凌晨三点
    // 凌晨三点前，默认显示前天，可以选择前天以前的时间；凌晨三点后，默认显示昨天自然天，可以选择昨天以前的时间。
    return Number(moment().format('HH')) >= 3 ? current && current > moment().subtract(1, 'days') : current && current > moment().subtract(2, 'days');
  };

  ChangeReportDate = value => { // 日报
    this.setState({
      dayDate: value,
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

  downLoadFun = (url, fileName, date) => { // 根据路径，名称，日期，通用下载函数。
    axios.get(url, {
      responseType: 'blob',
    }).then(response => {
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
      this.setState({ typeDowning: '' });
      message.warning('下载失败！请重新下载');
      console.log(warning);
    });
  };

  render() {
    const { dayDate, typeDowning } = this.state;
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
                  onChange={this.ChangeReportDate}
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
