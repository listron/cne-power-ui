import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from 'antd';
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
    if (large.length !== 0 ) {
      for(let i = 0; i < large.length; i ++) {
        newArr.push(large[i]); // 保存大部件

      }
    }
    if (performance.length !== 0 ) {
      for(let i = 0; i < large.length; i ++) {
        newArr.push(performance[i]); // 保存性能预警

      }
    }
    if (health.length !== 0 ) {
      for(let i = 0; i < large.length; i ++) {
        newArr.push(health[i]); // 保存设备健康

      }
    }
    // 跳到单风机详情图表展示
    history.push(`/hidden/analysis/single/fan/${fanWarnId}`);
    localStorage.setItem("taskId", taskId);
    localStorage.setItem("deviceName", deviceName);
    localStorage.setItem("deviceFullCode", deviceFullCode);
    localStorage.setItem("faultList", JSON.stringify(newArr))
  };

  titleFunc = (data) => {
    return data && data.map((cur, index) => {
      return (
        <div
          style={{
            textDecoration: "underline",
            display: "flex",
            minWidth: "280px",
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
            {cur.largeWarnings.length !== 0 ? <div>
              <Tooltip
                overlayStyle={{maxWidth: "500px"}}
                placement="bottomLeft"
                title={this.titleFunc(cur.largeWarnings)}
              >
                <span className={styles.warnColor}>大部件</span>
              </Tooltip>
            </div>: <div>
                <span className={styles.grayColor}>大部件</span>
            </div>}
            <b />
            {cur.performanceWarnings.length !== 0 ? <div>
              <Tooltip
                overlayStyle={{maxWidth: "500px"}}
                placement="bottomLeft"
                title={this.titleFunc(cur.performanceWarnings)}
              >
                <span className={styles.warnColor}>性能预警</span>
              </Tooltip>
            </div>: <div>
              <span className={styles.grayColor}>性能预警</span>
            </div>}
            <b />
            {cur.healthWarnings.length !== 0 ? <div>
              <Tooltip
                overlayStyle={{maxWidth: "500px"}}
                placement="bottomLeft"
                title={this.titleFunc(cur.healthWarnings)}
              >
                <span className={styles.warnColor}>设备健康</span>
              </Tooltip>
            </div>: <div>
              <span className={styles.grayColor}>设备健康</span>
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
