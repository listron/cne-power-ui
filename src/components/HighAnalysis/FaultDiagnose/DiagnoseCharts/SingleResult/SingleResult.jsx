import React from "react";
import PropTypes from "prop-types";
import eCharts from "echarts";
import { singleTemperatureOptions } from "../chartsConfig/chartsConfig";
import styles from "./singleResult.scss";



export default class SingleResult extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    getStandAloneList: PropTypes.func,
    standAloneList: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const  {
      singleChart,
      props: {
        getStandAloneList,
        standAloneList
      }
    } = this;
    const params = {
      taskId: "387338641160192",
      deviceFullCode: "82M101M39M1"
    };
    const myChart = eCharts.init(singleChart);
    // 接口
    getStandAloneList(params);
    myChart.setOption(singleTemperatureOptions(standAloneList, params.deviceFullCode));
  }

  componentDidUpdate() {
    const  {
      singleChart,
      props: {
        standAloneList
      }
    } = this;
    const params = {
      taskId: "387338641160192",
      deviceFullCode: "82M101M39M1"
    };
    const myChart = eCharts.init(singleChart);
    myChart.setOption(singleTemperatureOptions(standAloneList, params.deviceFullCode));
  }


  render() {
    return (
      <div className={styles.singleChartsBox}>
        <div className={styles.singleChartsDiff}>
          <div>
            单机自适应模块的检测结果
          </div>
        </div>
        <div ref={(ref) => {
          this.singleChart = ref;
        }} className={styles.singleCharts} />
      </div>
    );
  }
}
