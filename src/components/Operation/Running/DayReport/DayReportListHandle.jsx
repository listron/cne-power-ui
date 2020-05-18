

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommonPagination from '../../../Common/CommonPagination';
import path from '@path';
import styles from './dayReportAll.scss';
import { Button, Upload, message } from 'antd';
import moment from 'moment';
import WarningTip from '@components/Common/WarningTip';
import CneButton from '@components/Common/Power/CneButton/index';
import { handleRights } from '@utils/utilFunc';

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
    keyword: PropTypes.string,
  }

  state = {
    uploadResult: '',
    uploadLoading: false,
  }

  onPaginationChange = ({ currentPage, pageSize }) => { // 分页器
    const { stationType, stationNameSort, startTime, regionName, keyword } = this.props;
    const params = { stationType, stationNameSort, startTime, regionName, keyword };
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
    // const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
    const validType = /\.xlsx$/.test(file.name); // 导入后缀为xls或非excel文件时提示与产品文档不一致
    this.setState({ uploadLoading: true });
    if (!validType) {
      this.setState({ uploadLoading: false });
      message.error('仅支持后缀名为 .xlsx 的文件格式。');
    }
    return validType;
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
          uploadResult: '',
        });
        message.config({ top: 150, duration: 3 });
        message.success('日报上传成功');
        this.props.getDayReportList({
          stationType, stationNameSort, startTime, regionName, pageSize, pageNum,
        });
      } else {
        const uploadResult = response.message ? (<div>
          <div>日报上传失败: </div>
          <div>
            {response.message.split(';').map(e => <div>{e}</div>)}
          </div>
        </div>) : <span />;
        this.setState({
          uploadLoading: false,
          uploadResult,
        });
      }
    }
  }

  cancelTip = () => this.setState({ uploadResult: '' });

  confirmTip = this.cancelTip;

  render() {
    const { uploadResult, uploadLoading } = this.state;
    const { pageSize, pageNum, totalNum } = this.props;
    const [reportRight, importRight] = handleRights(['daily_report', 'daily_import']);
    const authData = localStorage.getItem('authData') || '';
    return (
      <div className={styles.operateDayReport}>
        <span className={styles.leftButtons}>
          {reportRight && <CneButton onClick={this.toUploadPage} className={styles.uploadReport} >
            <div className={styles.icon}>
              <span className={'iconfont icon-newbuilt'} />
            </div>上报日报
          </CneButton>}
          {importRight && <Upload
            action={`${APIBasePath}${operation.uploadReportFile}`}
            headers={{'Authorization': 'bearer ' + ((authData && authData !== 'undefined') ? authData : '')}}
            beforeUpload={this.beforeUpload}
            onChange={this.importChange}
            multiple={true}
            className={styles.importReportFile}
          >
            <CneButton loading={uploadLoading}>导入日报</CneButton>
          </Upload>}
          {importRight && <CneButton className={styles.templateBtn} href={`${originUri}/template/reportTemplate.zip`}>下载导入模板</CneButton>}

        </span>
        <CommonPagination
          className={styles.pagination}
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
          style={{ width: '640px', minHeight: '88px', height: 'auto', paddingBottom: '12px' }}
        />}
      </div>
    );
  }
}

export default DayReportListHandle;
