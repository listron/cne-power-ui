import React from "react";
import PropTypes from "prop-types";
import { Button } from 'antd';
import FaultAllFanHistory from "./../FaultAllFanHistory/FaultAllFanHistory";
import FaultResetTask from "./../FaultResetTask/FaualtResetTask";
import styles from "./faultAllFanTop.scss";
import Path from "../../../../../constants/path";


const {
  basePaths: {
    APIBasePath,
  },
  APISubPaths: {
    highAnalysis: {
      downloadFile
    }
  }} = Path;

export default class FaultAllFanTop extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    deviceName: PropTypes.string,
    taskId: PropTypes.string,
    stations: PropTypes.object,
    stationCode: PropTypes.string,
    deviceFullcode: PropTypes.string,
    downLoadFile: PropTypes.func,
    getResetTask: PropTypes.func,
    getFaultInfo: PropTypes.func,
    faultInfo: PropTypes.object,
    match: PropTypes.object
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
    const windFault = JSON.parse(localStorage.getItem("windFault"));
    let arr = []; //保存设备id
    windFault && windFault.map(cur => {
      arr.push(cur.deviceCode);
    });
    console.log(windFault, "winasddadsdFault");
    const params = {
      stationCode,
      deviceFullCode: "",
      algorithmIds: arr,
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
    const { taskId, deviceFullcode, deviceName, downLoadFile } = this.props;
    const url  = `${APIBasePath}${downloadFile}/${taskId}/${deviceFullcode}`;
    downLoadFile({
      url,
      method: "get",
      fileName: `【${deviceName}】_【2018】_【2019】.csv`
    });
  };

  stationName = () => {
    const { stations, stationCode } = this.props;
    const stationItems = stations && stations.toJS();
    const stationItem = stationItems.filter(e => (e.stationCode === +stationCode))[0];
    return stationItem.stationName;
  };


  render() {
    const { visibleFlag, taskFlag } = this.state;
    const { deviceName, faultInfo } = this.props;
    console.log(faultInfo, "-=-=-faultInfo");
    return (
      <div className={styles.faultAllFanTop}>
        <div className={styles.allFanTopCenter}>
          <div className={styles.allFanTime}>
            <div className={styles.allFanTimeLeft}>
              <div>
                <div>
                  <span>训练开始日期：</span>
                  <span>2017-12-03</span>
                </div>
                <div>
                  <span>任务计划执行时间：</span>
                  <span>2018-02-03 12:30:20</span>
                </div>
              </div>
              <div>
                <div>
                  <span>检测开始时间：</span>
                  <span>2018-02-03</span>
                </div>
                <div>
                  <span>任务执行开始时间：</span>
                  <span>2018-02-03 12:30:20</span>
                </div>
              </div>
              <div>
                <div>
                  <span>检测结束时间：</span>
                  <span>2018-02-07</span>
                </div>
                <div>
                  <span>任务执行结束时间：</span>
                  <span>2018-02-03 12:35:20</span>
                </div>
              </div>
            </div>
            <div className={styles.allFanTimeRight}>
              <div>
                <Button block onClick={this.resetTaskFunc}>重新执行</Button>
                <Button block onClick={this.historyFunc}>历史预警报告</Button>
              </div>
              <div>
                <span>{`${this.stationName()}_检测日期_下发日期.csv`}</span>
                <span className={styles.download} onClick={this.downloadFunc}>下载</span>
              </div>
            </div>
          </div>
          <div className={styles.allFanError}>
            <span>任务执行失败失败：</span>
            <span>log信息</span>
          </div>
        </div>
        <FaultAllFanHistory onVisible={this.onVisible} visibleFlag={visibleFlag} {...this.props} />
        <FaultResetTask onTaskVisible={this.onTaskVisible} taskFlag={taskFlag} {...this.props} />
      </div>
    );
  }
}
