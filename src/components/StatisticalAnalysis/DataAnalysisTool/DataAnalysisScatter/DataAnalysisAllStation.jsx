import React from "react";
import PropTypes from "prop-types";
import styles from './dataAnalysisStyle.scss';


class DataAnalysisAllStation extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const dataList = [350, 360, 75, 76, 71, 38, 42].map((e, i) => {
      return {
        stationCode: e,
        stationName: `编号${e}电站`
      }
    })
    return (
      <div className={styles.allstationBox}>
        <div className={styles.boxtitle}>风电站列表<span>(点击查看电站散点图)</span></div>
        <div className={styles.boxcard}></div>
      </div>
    )
  }
}
export default (DataAnalysisAllStation)