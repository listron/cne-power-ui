import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from 'antd';

import styles from "./faultWarnAlgorithm.scss";

const data = [
  {
    id: 1,
    name: "发电机转子不平衡检测与诊断",
    num: 7,
    date: "2019/04/01～2019/04-07",
    fan: ["w123", "w1456"]
  },
  {
    id: 2,
    name: "发电机转子不平衡检测与诊断",
    num: 7,
    date: "2019/04/01～2019/04-07",
    fan: ["w123", "w1456", "12333"]
  },
  {
    id: 3,
    name: "发电机转子不平衡检测与诊断",
    num: 7,
    date: "2019/04/01～2019/04-07",
    fan: ["w123", "w1456"]
  },
  {
    id: 4,
    name: "发电机转子不平衡检测与诊断",
    num: 7,
    date: "2019/04/01～2019/04-07",
    fan: ["w123", "w1456", "w145as", "w1asd", "w123", "w1456", "w145as", "w1asd"]
  },
  {
    id: 5,
    name: "发电机转子不平衡检测与诊断",
    num: 7,
    date: "2019/04/01～2019/04-07",
    fan: ["w123", "w1456"]
  },
];

export default class FaultWarnAlgorithm extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    history: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  titleFunc = (fan) => {
    let  str = "";
    for(let i = 0;i< fan.length-1; i++){
      str+= fan[i] + "、";
    }
    return <span>{str + fan[fan.length-1]}</span>;
  };

  detailsFunc = () => {
    const { history } = this.props;
    // 跳到按模型单风机详情图表展示
    history.push("/hidden/analysis/all/fan");
  };

  render() {
    const item = data && data.map(cur => {
      return (
        <div className={styles.warnItem} key={cur.id} onClick={() => {return this.detailsFunc()}}>
          <div>
            {cur.name}
          </div>
          <div>
            <Tooltip placement="bottom" title={this.titleFunc(cur.fan)}>
              <span>{cur.num}</span><span>风机</span>
            </Tooltip>
          </div>
          <div>
            <span>检测日期</span><span>{cur.date}</span>
          </div>
        </div>
      );
    });
    return (
      <div className={styles.faultWarnAlgorithm}>
        <div>
          <div className={styles.title}>
            大部件
          </div>
          <div className={styles.warnBox}>
            {item}
          </div>
        </div>
        <div>
          <div className={styles.title}>
            性能预警
          </div>
          <div className={styles.warnBox}>
            {item}
          </div>
        </div>
        <div>
          <div className={styles.title}>
            设备健康
          </div>
          <div className={styles.warnBox}>
            {item}
          </div>
        </div>
      </div>
    );
  }
}
