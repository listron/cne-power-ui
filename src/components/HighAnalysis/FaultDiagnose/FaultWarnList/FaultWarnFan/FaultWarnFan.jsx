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
    match: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  detailsFunc = (taskId, deviceName, large, performance, health, deviceFullCode) => {
    const {
      history,
      match: {
        params:{
          fanWarnId
        }
      },
    } = this.props;
    let newArr = []; // 保存故障
    if (large && large.length !== 0 ) {
      for(let i = 0; i < large.length; i ++) {
        newArr.push(large[i]); // 保存大部件

      }
    }
    if (performance && performance.length !== 0 ) {
      for(let i = 0; i < performance.length; i ++) {
        newArr.push(performance[i]); // 保存性能预警

      }
    }
    if (health && health.length !== 0 ) {
      for(let i = 0; i < health.length; i ++) {
        newArr.push(health[i]); // 保存设备健康
      }
    }
    // 跳到单风机详情图表展示
    history.push(`/hidden/analysis/single/fan/${fanWarnId}`);
    localStorage.setItem("taskId", taskId);
    localStorage.setItem("faultHistory", "2");
    localStorage.setItem("deviceName", deviceName);
    localStorage.setItem("deviceFullCode", deviceFullCode);
    localStorage.setItem("faultList", JSON.stringify(newArr))
  };

  detailsFanFunc = (e, data, taskId, deviceName, deviceFullcode) => {
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
    localStorage.setItem("faultList", JSON.stringify(data))
  };

  titleFunc = (data, taskId, deviceName, deviceFullcode) => {
    return data && data.map((cur, index) => {
      return (
        <div
          onClick={(e) => {return this.detailsFanFunc(e, data, taskId, deviceName, deviceFullcode)}}
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
        <div className={styles.fanItem} key={cur.taskId + index} onClick={() => {return this.detailsFunc(cur.taskId, cur.deviceName, cur.largeWarnings, cur.performanceWarnings, cur.healthWarnings, cur.deviceFullcode)}}>
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
        {item}
      </div>
    );
  }
}
