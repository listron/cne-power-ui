import React from "react";
import PropTypes from "prop-types";
import { Tooltip, Icon } from 'antd';
import styles from "./faultWarnFan.scss";
import { dateArrFormat } from "../../formatDateUtils/formatDateUtils";

export default class FaultWarnFan extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    history: PropTypes.object,
    fanListData: PropTypes.array,
    match: PropTypes.object,
    getFanList: PropTypes.func,
    getAlgoModel: PropTypes.func,
  };

  componentWillReceiveProps(nextProps) {
    const {
      match: {params: {fanWarnId: currentSingleStationCode}},
      getFanList,
      getAlgoModel,
    } = this.props;
    const { match: {params: {fanWarnId: nextSingleStationCode}} } = nextProps;
    const params = {
      stationCode: nextSingleStationCode,
    };
    if (currentSingleStationCode !== nextSingleStationCode) {
      // 算法模型调用
      getFanList(params);
      // 算法模型调用
      getAlgoModel(params);
    }
  }

  detailsFunc = (taskId, deviceName, deviceFullCode) => {
    const {
      history,
      match: {
        params:{
          fanWarnId
        }
      },
    } = this.props;
    // 跳到单风机详情图表展示
    history.push(`/hidden/analysis/single/fan/${fanWarnId}`);
    localStorage.setItem("taskId", taskId);
    localStorage.setItem("faultHistory", "2");
    localStorage.setItem("deviceName", deviceName);
    localStorage.setItem("deviceFullCode", deviceFullCode);
  };

  detailsFanFunc = (e, algorithmName, taskId, deviceName, deviceFullcode) => {
    e.stopPropagation();
    const {
      history,
      match: {
        params:{
          fanWarnId
        }
      },
    } = this.props;
    history.push(`/hidden/analysis/single/fan/${fanWarnId}`);
    localStorage.setItem("taskId", taskId);
    localStorage.setItem("faultHistory", "2");
    localStorage.setItem("deviceName", deviceName);
    localStorage.setItem("deviceFullCode", deviceFullcode);
    localStorage.setItem("deviceFullName", algorithmName);
  };

  titleFunc = (data, taskId, deviceName, deviceFullcode) => {
    return data && data.map((cur, index) => {
      return (
        <div
          onClick={(e) => {return this.detailsFanFunc(e, cur.algorithmName, taskId, deviceName, deviceFullcode)}}
          style={{
            textDecoration: "underline",
            display: "flex",
            minWidth: "280px",
            cursor: "pointer",
            justifyContent: "space-between"
          }}
          key={`${cur.algorithmName}${index}`}
        >
          <span>{cur.algorithmName}</span>
          <span>{dateArrFormat(cur.predictionDate)}</span>
        </div>
      )
    });
  };

  render() {
    const { fanListData } = this.props;
    const item = fanListData && fanListData.map((cur, index) => {
      return (
        <div className={styles.fanItem} key={cur.taskId + index} onClick={() => {return this.detailsFunc(cur.taskId, cur.deviceName, cur.deviceFullcode)}}>
          <div className={styles.fanItemTop}>
            <div>
              {cur.deviceName}
            </div>
            <div className={cur.warningCount ? styles.warnItem : styles.successItem}>
              {cur.warningCount ? `预警${cur.warningCount}` : "正常"}
            </div>
          </div>
          <div className={styles.fanItemBottom}>
            {(!cur.largeWarnings || cur.largeWarnings.length === 0) ? <div>
                <span className={styles.grayColor}>大部件</span>
              </div>: <div>
              <Tooltip
                overlayStyle={{maxWidth: "500px"}}
                placement="bottomLeft"
                title={this.titleFunc(cur.largeWarnings, cur.taskId, cur.deviceName, cur.deviceFullcode)}
              >
                <span className={styles.warnColor}>
                  <span>大部件</span>
                  <i className="iconfont icon-alarm" />
                </span>
              </Tooltip>
            </div>}
            <b />
            {(!cur.performanceWarnings || cur.performanceWarnings.length === 0 ) ? <div>
              <span className={styles.grayColor}>性能预警</span>
            </div> : <div>
                <Tooltip
                  overlayStyle={{maxWidth: "500px"}}
                  placement="bottomLeft"
                  title={this.titleFunc(cur.performanceWarnings, cur.taskId, cur.deviceName, cur.deviceFullcode)}
                >
                <span className={styles.warnColor}>
                  <span>性能预警</span>
                  <i className="iconfont icon-alarm" />
                </span>
                </Tooltip>
              </div>}
            <b />
            {(!cur.healthWarnings || cur.healthWarnings.length === 0) ? <div>
              <span className={styles.grayColor}>设备健康</span>
            </div> : <div>
                <Tooltip
                  overlayStyle={{maxWidth: "500px"}}
                  placement="bottomLeft"
                  title={this.titleFunc(cur.healthWarnings, cur.taskId, cur.deviceName, cur.deviceFullcode)}
                >
                <span className={styles.warnColor}>
                  <span>设备健康</span>
                  <i className="iconfont icon-alarm" />
                </span>
                </Tooltip>
              </div>}
          </div>
        </div>
      );
    });
    return (
      <div className={styles.faultWarnFan}>
        {fanListData || fanListData.length !== 0 ? item : <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div>}
      </div>
    );
  }
}
