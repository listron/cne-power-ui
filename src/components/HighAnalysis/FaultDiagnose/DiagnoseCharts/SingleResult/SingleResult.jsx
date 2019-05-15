import React from "react";
import PropTypes from "prop-types";
import eCharts from "echarts";
import { singleTemperatureOptions } from "../chartsConfig/chartsConfig";
import styles from "./singleResult.scss";
import moment from "../PreTemperature/PreTemperature";



export default class SingleResult extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    getStandAloneList: PropTypes.func,
    standAloneList: PropTypes.array,
    aloneLoading: PropTypes.bool,
    deviceFullCode: PropTypes.string,
    stationDeviceList: PropTypes.array,
    aloneTimeCompare: PropTypes.number,
    deviceName: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const  {
      singleChart,
      props: {
        standAloneList,
        aloneLoading,
        stationDeviceList
      }
    } = this;
    const myChart = eCharts.init(singleChart);
    if (aloneLoading) {// loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!aloneLoading) {
      myChart.hideLoading();
    }
    myChart.setOption(singleTemperatureOptions(standAloneList, stationDeviceList[0].deviceName));
  }

  componentDidUpdate(prevProps) {
    const  {
      singleChart,
      props: {
        standAloneList,
        stationDeviceList,
        aloneLoading,
        deviceName,
        aloneTimeCompare: currentAloneTimeCompare
      }
    } = this;
    const { aloneTimeCompare } = prevProps;
    // 设备全编码
    const name = deviceName || stationDeviceList[0].deviceName;
    const myChart = eCharts.init(singleChart);
    if (aloneLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!aloneLoading) {
      myChart.hideLoading();
    }
    if (currentAloneTimeCompare && aloneTimeCompare !== currentAloneTimeCompare) {
      myChart.setOption(singleTemperatureOptions(standAloneList, name));
    }
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
