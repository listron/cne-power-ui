import React from "react";
import PropTypes from "prop-types";
import { Button } from 'antd';
import FaultAllFanHistory from "./../FaultAllFanHistory/FaultAllFanHistory";
import styles from "./faultAllFanTop.scss";

export default class FaultAllFanTop extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      visibleFlag: false //控制历史预警报告
    };
  }

  componentDidMount() {

  }

  onVisible = (flag) => {
    this.setState({
      visibleFlag: flag
    })
  };

  historyFunc = () => {
    this.onVisible(true);
  };


  render() {
    const { visibleFlag } = this.state;
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
                <Button block>重新执行</Button>
                <Button block onClick={this.historyFunc}>历史预警报告</Button>
              </div>
              <div>
                <span>【电站名称】_【检测日期】_【下发日期】.csv</span>
                <span>下载</span>
              </div>
            </div>
          </div>
          <div className={styles.allFanError}>
            <span>任务执行失败失败：</span>
            <span>log信息</span>
          </div>
        </div>
        <FaultAllFanHistory onVisible={this.onVisible} visibleFlag={visibleFlag} {...this.props} />
      </div>
    );
  }
}
