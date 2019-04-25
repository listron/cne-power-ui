import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from 'antd';
import styles from "./faultWarnFan.scss";

export default class FaultWarnFan extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    history: PropTypes.object,
    fanListData: PropTypes.array,
  };

  constructor(props) {
    super(props);
  }

  detailsFunc = () => {
    const { history } = this.props;
    // 跳到单风机详情图表展示
    history.push("/hidden/analysis/single/fan");
  };

  titleFunc = (data) => {
    function strFormat(list) {
      let arr = []; // 保存处理后的数组
      let str = ""; // 保存处理后的时间
      list && list.map(cur => {
        // 保存切割数组
        arr.push(cur.split("-"));
      });
      arr && arr.map((cur, index) => {
        if(index === 0) {
          str += `${cur[0]}/${cur[1]}/${cur[2]}、`
        }
        if (index !== 0) {
          str += cur[2];
        }
      });
      return str;
    }
    return data && data.map((cur, index) => {
      return (
        <p
          style={{
            textDecoration: "underline",
            display: "flex",
            justifyContent: "space-between"
          }}
          key={`${cur.algorithmName}${index}`}
        >
          <span>{cur.algorithmName}</span>
          <span>{strFormat(cur.predictionDate)}</span>
        </p>
      )
    });
  };

  render() {
    const { fanListData } = this.props;
    const item = fanListData && fanListData.map((cur, index) => {
      return (
        <div className={styles.fanItem} key={cur.taskId + index} onClick={() => {return this.detailsFunc()}}>
          <div className={styles.fanItemTop}>
            <div>
              {cur.deviceName}
            </div>
            <div>
              {`预警${cur.warningCount}`}
            </div>
          </div>
          <div className={styles.fanItemBottom}>
            {cur.largeWarnings.length !== 0 ? <div>
              <Tooltip
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
              <Tooltip placement="bottomLeft" title={this.titleFunc(cur.performanceWarnings)}>
                <span className={styles.warnColor}>性能预警</span>
              </Tooltip>
            </div>: <div>
              <span className={styles.grayColor}>性能预警</span>
            </div>}
            <b />
            {cur.healthWarnings.length !== 0 ? <div>
              <Tooltip placement="bottomLeft" title={this.titleFunc(cur.healthWarnings)}>
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
