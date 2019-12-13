

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommonPagination from '../../../Common/CommonPagination';
import path from '@path';
import styles from './dayReportAll.scss';
import { Button, Upload, message } from 'antd';
import moment from 'moment';
import WarningTip from '@components/Common/WarningTip';

const { basePaths, APISubPaths } = path;
const { APIBasePath, originUri } = basePaths;
const { operation } = APISubPaths;

class DayReportListHandle extends Component {
  static propTypes = {
    stationType: PropTypes.number,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    totalNum: PropTypes.number,
    stationNameSort: PropTypes.number,
    regionName: PropTypes.string,
    startTime: PropTypes.string,
    getDayReportList: PropTypes.func,
    toChangeDayReportStore: PropTypes.func,
    getReportUploadedStation: PropTypes.func,
  }

  state = {
    uploadResult: '',
    uploadLoading: false,
  }

  onPaginationChange = ({ currentPage, pageSize }) => { // 分页器
    const { stationType, stationNameSort, startTime, regionName } = this.props;
    const params = { stationType, stationNameSort, startTime, regionName };
    this.props.getDayReportList({
      ...params,
      pageSize,
      pageNum: currentPage,
    });
  }

  toUploadPage = () => { // 去上报页面
    this.props.toChangeDayReportStore({
      showPage: 'report',
    });
    this.props.getReportUploadedStation({ // 请求初始默认时间下已上传电站列表。
      reportDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    });
  }

  beforeUpload = (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
    this.setState({ uploadLoading: true });
    if (!isExcel) {
      this.setState({ uploadLoading: false });
      message.error('只能上传Excel文件!');
    }
    return isExcel;
  }

  importChange = (info) => {
    const { file } = info || {};
    const { status, response } = file || {};
    if (status === 'done') {
      const { code } = response;
      if (code === '10000') { // 上传成功 => 更新日报列表
        const { stationType, stationNameSort, startTime, regionName, pageSize, pageNum } = this.props;
        this.setState({
          uploadLoading: false,
          uploadResult: '日报上传成功！',
        });
        this.props.getDayReportList({
          stationType, stationNameSort, startTime, regionName, pageSize, pageNum,
        });
      } else {
        this.setState({
          uploadLoading: false,
          uploadResult: `日报上传失败: ${response.message}`,
        });
      }
    }
  }

  cancelTip = () => this.setState({ uploadResult: '' });

  confirmTip = this.cancelTip;

  render() {
    const { uploadResult, uploadLoading } = this.state;
    const { pageSize, pageNum, totalNum } = this.props;
    const authData = localStorage.getItem('authData') || '';
    const rights = localStorage.getItem('rightHandler');
    const importRight = rights && rights.split(',').includes('daily_import');
    return (
      <div className={styles.operateDayReport}>
        <span className={styles.leftButtons}>
          <Button onClick={this.toUploadPage} icon="plus" className={styles.uploadReport} >
            上报日报
          </Button>
          {importRight && <Upload
            action={`${APIBasePath}${operation.uploadReportFile}`}
            headers={{'Authorization': 'bearer ' + ((authData && authData !== 'undefined') ? authData : '')}}
            beforeUpload={this.beforeUpload}
            onChange={this.importChange}
            multiple={true}
            className={styles.importReportFile}
          >
            <Button loading={uploadLoading}>导入日报</Button>
          </Upload>}
          {importRight && <Button className={styles.templateBtn} href={`${originUri}/template/reportTemplate.zip`}>下载导入模板</Button>}
        </span>
        <CommonPagination
          pageSize={pageSize}
          currentPage={pageNum}
          total={totalNum}
          onPaginationChange={this.onPaginationChange}
        />
        {uploadResult && <WarningTip
          onCancel={this.cancelTip}
          hiddenCancel={true}
          onOK={this.confirmTip}
          value={uploadResult}
          style={{ width: '320px', minHeight: '88px', height: 'auto', paddingBottom: '12px' }}
        />}
      </div>
    );
  }
}

export default DayReportListHandle;
