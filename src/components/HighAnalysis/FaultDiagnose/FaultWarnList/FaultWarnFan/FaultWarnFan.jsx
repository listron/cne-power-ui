import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from 'antd';
import styles from "./faultWarnFan.scss";

const data = [
  {
    id: 1,
    name: "预警",
    title: "w123",
    num: 7,
    date: "2019/04/01～2019/04-07",
    fan: ["w123", "w1456"]
  },
  {
    id: 2,
    name: "预警",
    title: "w123d",
    num: 7,
    date: "2019/04/01～2019/04-07",
    fan: ["w123", "w1456", "12333"]
  },
  {
    id: 3,
    name: "预警",
    title: "w123a",
    num: 7,
    date: "2019/04/01～2019/04-07",
    fan: ["w123", "w1456"]
  },
  {
    id: 4,
    name: "预警",
    title: "w123r",
    num: 7,
    date: "2019/04/01～2019/04-07",
    fan: ["w123", "w1456", "w145as", "w1asd", "w123", "w1456", "w145as", "w1asd"]
  },
  {
    id: 5,
    name: "预警",
    title: "w12aaa",
    num: 7,
    date: "2019/04/01～2019/04-07",
    fan: ["w123", "w1456"]
  },
];

export default class FaultWarnFan extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    history: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  detailsFunc = () => {
    const { history } = this.props;
    // 跳到单风机详情图表展示
    history.push("/hidden/analysis/single/fan");
  };

  render() {
    const item = data && data.map(cur => {
      return (
        <div className={styles.fanItem} key={cur.id} onClick={() => {return this.detailsFunc()}}>
          <div className={styles.fanItemTop}>
            <div>
              {cur.title}
            </div>
            <div>
              预警3
            </div>
          </div>
          <div className={styles.fanItemBottom}>
            <div>
              <Tooltip placement="bottom" title={<span>{cur.date}</span>}>
                <span>大部件</span>
              </Tooltip>
            </div>
            <b />
            <div>
              <span>性能预警</span>
            </div>
            <b />
            <div>
              <span>设备健康</span>
            </div>
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
