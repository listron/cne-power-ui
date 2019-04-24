import React from "react";
import PropTypes from "prop-types";
import styles from "./algorithmControl.scss";

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


export default class AlgorithmModal extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  detailsFunc = () => {
    // 点击带着参数跳转到列表视图
  };

  render() {
    const item = data && data.map(cur => {
      return (
        <div className={styles.algorithmItem} key={cur.id} onClick={() => {return this.detailsFunc()}}>
          <div>
            {cur.name}
          </div>
          <div>
            <span>运行风场</span>
            <span>{cur.num}</span>
          </div>
        </div>
      );
    });
    return (
      <div className={styles.algorithmControl}>
        <div>
          <div className={styles.title}>
            大部件
          </div>
          <div className={styles.algorithmBox}>
            {item}
          </div>
        </div>
        <div>
          <div className={styles.title}>
            性能预警
          </div>
          <div className={styles.algorithmBox}>
            {item}
          </div>
        </div>
        <div>
          <div className={styles.title}>
            设备健康
          </div>
          <div className={styles.algorithmBox}>
            {item}
          </div>
        </div>
      </div>
    );
  }
}
