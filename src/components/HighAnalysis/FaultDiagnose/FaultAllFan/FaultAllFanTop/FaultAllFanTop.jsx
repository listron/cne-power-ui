import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import FaultAllFanHistory from './../FaultAllFanHistory/FaultAllFanHistory';
import FaultResetTask from './../FaultResetTask/FaualtResetTask';
import styles from './faultAllFanTop.scss';
import Path from '../../../../../constants/path';
import moment from 'moment';


const {
  basePaths: {
    APIBasePath,
  },
  APISubPaths: {
    highAnalysis: {
      downloadFile,
    },
  }} = Path;
const defaultFormat = 'YYYY-MM-DD HH:mm:ss';
export default class FaultAllFanTop extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    taskId: PropTypes.string,
    stations: PropTypes.object,
    stationCode: PropTypes.string,
    downLoadFile: PropTypes.func,
    getResetTask: PropTypes.func,
    faultInfo: PropTypes.object,
    faultInfoMessage: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      visibleFlag: false, //控制历史预警报告
      taskFlag: false, //控制重新执行
    };
  }

  onVisible = (flag) => {
    this.setState({
      visibleFlag: flag,
    });
  };

  onTaskVisible = (flag) => {
    this.setState({
      taskFlag: flag,
    });
  };

  historyFunc = () => {
    this.onVisible(true);
  };

  resetTaskFunc = () => {
    this.onTaskVisible(true);
  };

  downloadFunc = () => {
    const {
      downLoadFile,
      faultInfo: {
        stationName,
        startTime,
        endTime,
        taskId,
      },
    } = this.props;
    const url = `${APIBasePath}${downloadFile}/${taskId}`;
    downLoadFile({
      url,
      method: 'get',
      fileName: `${stationName || ''}_${startTime || ''}_${endTime || ''}.csv`,
    });
  };

  render() {
    const { visibleFlag, taskFlag } = this.state;
    const {
      faultInfo: {
        planExecuteTime,
        trainningStartTime,
        executeStartTime,
        executeEndTime,
        endTime,
        status,
        startTime,
        stationName,
      },
      faultInfoMessage } = this.props;

    return (
      <div className={styles.faultAllFanTop}>
        <div className={styles.allFanTopCenter}>
          <div className={styles.allFanTime}>
            <div className={styles.allFanTimeLeft}>
              <div>
                <div>
                  <span>训练开始日期：</span>
                  <span>{trainningStartTime && moment(trainningStartTime).format('YYYY-MM-DD') || ''}</span>
                </div>
                <div>
                  <span>任务计划执行时间：</span>
                  <span>{planExecuteTime && moment(planExecuteTime).format(defaultFormat) || ''}</span>
                </div>
              </div>
              <div>
                <div>
                  <span>检测开始时间：</span>
                  <span>{startTime && startTime || ''}</span>
                </div>
                <div>
                  <span>任务执行开始时间：</span>
                  <span>{executeStartTime && moment(executeStartTime).format(defaultFormat) || ''}</span>
                </div>
              </div>
              <div>
                <div>
                  <span>检测结束时间：</span>
                  <span>{endTime && endTime || ''}</span>
                </div>
                <div>
                  <span>任务执行结束时间：</span>
                  <span>{executeEndTime && moment(executeEndTime).format(defaultFormat) || ''}</span>
                </div>
              </div>
            </div>
            <div className={styles.allFanTimeRight}>
              <div>
                <Button style={{width: 90}} block onClick={this.resetTaskFunc}>重新执行</Button>
                <Button style={{width: 120}} block onClick={this.historyFunc}>历史预警报告</Button>
              </div>
              {(status && status !== 4) && (
                <div>
                  <span>{`${stationName || ''}_${startTime || ''}_${endTime || ''}.csv`}</span>
                  <span className={styles.download} onClick={this.downloadFunc}>
                  下载
                </span>
                </div>
              )}
            </div>
          </div>
          {(status === 4) && (
            <div className={styles.allFanError}>
              <span>任务执行失败：</span>
              <span>{faultInfoMessage}</span>
            </div>
          )}
        </div>
        <FaultAllFanHistory onVisible={this.onVisible} visibleFlag={visibleFlag} {...this.props} />
        <FaultResetTask onTaskVisible={this.onTaskVisible} taskFlag={taskFlag} {...this.props} />
      </div>
    );
  }
}
