import React from "react";
import PropTypes from "prop-types";
import eCharts from "echarts";
import { allFansOptions } from "../../../../../utils/chartsConfig/diagnoseConfig";
import styles from "./allFans.scss";

export default class AllFans extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const  { allFansCharts } = this;
    const myChart = eCharts.init(allFansCharts);
    myChart.setOption(allFansOptions());
  }


  render() {
    return (
      <div className={styles.allFansChartsBox}>
        <div className={styles.allFansChartsDiff}>
          <div>
            严重程度及识别（所有风机）
          </div>
        </div>
        <div ref={(ref) => {
          this.allFansCharts = ref;
        }} className={styles.allFansCharts} />
      </div>
    );
  }
}
