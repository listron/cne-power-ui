import React from "react";
import PropTypes from "prop-types";
import styles from "./faultWarn.scss";

export default class FaultWarn extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    history: PropTypes.object,
    faultWarnList: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  faultWarnFunc = (stationCode) => {
    // 跳转到单风场预警
    this.props.history.push(`/analysis/faultDiagnose/fanWarn/${stationCode}`);
  };

  render() {
    const { faultWarnList } = this.props;
    const item = faultWarnList && faultWarnList.map(cur => {
      return (
        <div key={cur.stationCode} className={styles.faultWarnCenter} onClick={() => this.faultWarnFunc(cur.stationCode)}>
          <div className={styles.faultWarnCenterTop}>
            <div>{cur.stationName}</div>
          </div>
          <div className={styles.faultWarnCenterIcon}>
            <i className="iconfont icon-windlogo" />
            <span>{cur.faultUnitCount}</span>
            <span>{`/${cur.stationUnitCount}`}</span>
          </div>
          <div className={styles.faultWarnCenterBottom}>
            {cur.mainModules && cur.mainModules.map(item => {
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
