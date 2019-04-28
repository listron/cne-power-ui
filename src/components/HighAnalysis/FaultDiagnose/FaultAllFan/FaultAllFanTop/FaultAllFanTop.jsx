import React from "react";
import PropTypes from "prop-types";
import { Button } from 'antd';
import FaultAllFanHistory from "./../FaultAllFanHistory/FaultAllFanHistory";
import FaultResetTask from "./../FaultResetTask/FaualtResetTask";
import styles from "./faultAllFanTop.scss";
import Path from "../../../../../constants/path";
import moment from "moment";


const {
  basePaths: {
    APIBasePath,
  },
  APISubPaths: {
    highAnalysis: {
      downloadFile
    }
  }} = Path;
const defaultFormat = "YYYY-MM-DD HH:mm:ss";
export default class FaultAllFanTop extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    taskId: PropTypes.string,
    stations: PropTypes.object,
    stationCode: PropTypes.string,
    deviceFullcode: PropTypes.string,
    downLoadFile: PropTypes.func,
    getResetTask: PropTypes.func,
    getFaultInfo: PropTypes.func,
    faultInfo: PropTypes.array,
    match: PropTypes.object,
    faultInfoMessage: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      visibleFlag: false, //控制历史预警报告
      taskFlag: false, //控制重新执行
    };
  }

  componentDidMount() {
    const {
      getFaultInfo,
      match:{
        params: {
          stationCode
        }
      },
    } = this.props;
    // 读取localStorage
    const windFault = localStorage.getItem("algorithmId");
    const params = {
      stationCode,
      deviceFullCode: "",
      algorithmIds: [windFault],
      startTime: "",
      endTime: "",
      pageSize: null,
      pageNum: null,
      sortField: "",
      sortMethod: ""
    };
    getFaultInfo(params);
  }

  onVisible = (flag) => {
    this.setState({
      visibleFlag: flag
    })
  };

  onTaskVisible = (flag) => {
    this.setState({
      taskFlag: flag
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
      taskId,
      deviceFullcode,
      downLoadFile,
      faultInfo
    } = this.props;
    const url  = `${APIBasePath}${downloadFile}/${taskId}/${deviceFullcode}`;
    downLoadFile({
      url,
      method: "get",
      fileName: `${faultInfo && faultInfo[0].stationName || ""}_${faultInfo && faultInfo[0].startTime || ""}_${faultInfo && faultInfo[0].endTime || ""}_${faultInfo && faultInfo[0].trainingStartTime || ""}.csv`
    });
  };

  render() {
    const { visibleFlag, taskFlag } = this.state;
    const { faultInfo, faultInfoMessage } = this.props;
    return (
      <div className={styles.faultAllFanTop}>
        <div className={styles.allFanTopCenter}>
          <div className={styles.allFanTime}>
            <div className={styles.allFanTimeLeft}>
              <div>
                <div>
                  <span>训练开始日期：</span>
                  <span>{faultInfo && moment(faultInfo[0].createTime).format("YYYY-MM-DD") || ""}</span>
                </div>
                <div>
                  <span>任务计划执行时间：</span>
                  <span>{faultInfo && moment(faultInfo[0].planExecuteTime).format(defaultFormat) || ""}</span>
                </div>
              </div>
              <div>
                <div>
                  <span>检测开始时间：</span>
                  <span>{faultInfo && faultInfo[0].startTime || ""}</span>
                </div>
                <div>
                  <span>任务执行开始时间：</span>
                  <span>{faultInfo && moment(faultInfo[0].executeStartTime).format(defaultFormat) || ""}</span>
                </div>
              </div>
              <div>
                <div>
                  <span>检测结束时间：</span>
                  <span>{faultInfo && faultInfo[0].endTime || ""}</span>
                </div>
                <div>
                  <span>任务执行结束时间：</span>
                  <span>{faultInfo && moment(faultInfo[0].executeEndTime).format(defaultFormat) || ""}</span>
                </div>
              </div>
            </div>
            <div className={styles.allFanTimeRight}>
              <div>
                <Button block onClick={this.resetTaskFunc}>重新执行</Button>
                <Button block onClick={this.historyFunc}>历史预警报告</Button>
              </div>
              {(faultInfo && faultInfo[0].status !== 4) && (
                <div>
                  <span>{`${faultInfo && faultInfo[0].stationName || ""}_${faultInfo && faultInfo[0].startTime || ""}_${faultInfo && faultInfo[0].endTime || ""}_${faultInfo && faultInfo[0].trainingStartTime || ""}.csv`}</span>
                  <span className={styles.download} onClick={this.downloadFunc}>
                    下载
                  </span>
                </div>
              )}
            </div>
          </div>
          {(faultInfo && faultInfo[0].status === 4) && (
            <div className={styles.allFanError}>
              <span>任务执行失败失败：</span>
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
