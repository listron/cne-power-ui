import React from "react";
import PropTypes from "prop-types";
import styles from "./faultWarn.scss";

const data = [
  {
    id: 1,
    name: "肥西",
    sum: 13,
    num: 10,
    error: ["设备健康","大部件", "性能警告"]
  },
  {
    id: 2,
    name: "肥西",
    sum: 13,
    num: 10,
    error: ["大部件", "性能警告"]
  },
  {
    id: 3,
    name: "肥西",
    sum: 13,
    num: 10,
    error: ["大部件", "性能警告"]
  },
  {
    id: 4,
    name: "肥西",
    sum: 13,
    num: 10,
    error: ["大部件", "性能警告"]
  },
  {
    id: 5,
    name: "肥西",
    sum: 13,
    num: 10,
    error: ["大部件", "性能警告"]
  },
  {
    id: 6,
    name: "肥西",
    sum: 13,
    num: 10,
    error: ["大部件", "性能警告"]
  }
];

export default class FaultWarn extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  faultWarnFunc = (id) => {
    // 跳转到单风场预警
    this.props.history.push(`/analysis/faultDiagnose/fanWarn/${id}`);
    console.log(id, "history");
  };

  render() {
    const item = data && data.map(cur => {
      return (
        <div key={cur.id} className={styles.faultWarnCenter} onClick={() => this.faultWarnFunc(cur.id)}>
          <div className={styles.faultWarnCenterTop}>
            <div>{cur.name}</div>
          </div>
          <div className={styles.faultWarnCenterIcon}>
            <i className="iconfont icon-windlogo" />
            <span>{cur.num}</span>
            <span>{`/${cur.sum}`}</span>
          </div>
          <div className={styles.faultWarnCenterBottom}>
            {cur.error && cur.error.map(item => {
              return (
                <div key={item}>
                  {item}
                </div>
              )
            })}
          </div>
        </div>
      );
    });
    return (
      <div className={styles.faultWarnMain}>
        {item}
      </div>
    );
  }
}
