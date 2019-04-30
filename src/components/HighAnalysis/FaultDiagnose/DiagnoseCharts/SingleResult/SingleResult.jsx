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
        standAloneList,
        aloneLoading,
        deviceFullCode,
      }
    } = this;
    const taskId = localStorage.getItem("taskId");
    const params = {
      taskId,
      deviceFullCode
    };
    const myChart = eCharts.init(singleChart);
    if (aloneLoading) {// loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!aloneLoading) {
      myChart.hideLoading();
    }
    // 接口
    getStandAloneList(params);
    myChart.setOption(singleTemperatureOptions(standAloneList, deviceFullCode));
  }

  componentWillReceiveProps(nextProps) {
    const {
      getStandAloneList,
      deviceFullCode: currentDeviceFullCode,
      stationDeviceList: currentStationDeviceList
    } = this.props;
    const {
      stationDeviceList: nextStationDeviceList,
      deviceFullCode: nextDeviceFullCode
    } = nextProps;
    const taskId = localStorage.getItem("taskId");
    // 单风机设备全编码
    const fullCode = localStorage.getItem("deviceFullCode");
    const params = {
      taskId,
      deviceFullCode: nextDeviceFullCode ? nextDeviceFullCode : (nextStationDeviceList[0].connectDeviceFullCode ? nextStationDeviceList[0].connectDeviceFullCode : fullCode)
    };
    if (currentStationDeviceList[0].connectDeviceFullCode !== nextStationDeviceList[0].connectDeviceFullCode|| currentDeviceFullCode !== nextDeviceFullCode) {
      // 接口
      getStandAloneList(params);
    }
  }

  componentDidUpdate() {
    const  {
      singleChart,
      props: {
        standAloneList,
        stationDeviceList,
        deviceFullCode,
        aloneLoading,
      }
    } = this;
    // 设备全编码
    const name = deviceFullCode ? deviceFullCode : stationDeviceList[0].connectDeviceFullCode;
    const myChart = eCharts.init(singleChart);
    if (aloneLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!aloneLoading) {
      myChart.hideLoading();
    }
    myChart.setOption(singleTemperatureOptions(standAloneList, name));
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
