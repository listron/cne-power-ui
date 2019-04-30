import React from "react";
import PropTypes from "prop-types";
import eCharts from "echarts";
import { heatTemperatureOptions } from "../chartsConfig/chartsConfig";
import styles from "./heatMap.scss";
import moment from "../PreTemperature/PreTemperature";



export default class HeatMap extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    similarityList: PropTypes.array,
    getSimilarityList: PropTypes.func,
    heatLoading: PropTypes.bool,
    faultInfo: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const  {
      heatChart,
      props: {
        similarityList,
        getSimilarityList,
        heatLoading,
        faultInfo: {
          endTime
        },
      }
    } = this;
    const taskId = localStorage.getItem("taskId");
    const params = {
      taskId,
      date: endTime
    };
    const myChart = eCharts.init(heatChart);
    if (heatLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!heatLoading) {
      myChart.hideLoading();
    }
    //接口
    getSimilarityList(params);
    myChart.setOption(heatTemperatureOptions(similarityList, params.date));
  }

  componentWillReceiveProps(nextProps) {
    const {
      faultInfo: {
        endTime: currentEndTime
      },
      getSimilarityList
    } = this.props;
    const {
      faultInfo: {
        endTime: nextEndTime
      },
    } = nextProps;
    const taskId = localStorage.getItem("taskId");
    const params = {
      taskId,
      date: nextEndTime
    };
    if (currentEndTime !== nextEndTime) {
      // 接口
      getSimilarityList(params);
    }
  }

  componentDidUpdate() {
    const  {
      heatChart,
      props: {
        similarityList,
        faultInfo: {
          endTime
        },
        heatLoading
      }
    } = this;
    const myChart = eCharts.init(heatChart);
    if (heatLoading) { // loading态控制。
      myChart.showLoading();
      return false;
    }
    if (!heatLoading) {
      myChart.hideLoading();
    }
    myChart.setOption(heatTemperatureOptions(similarityList, endTime));
  }

  render() {
    return (
      <div className={styles.heatChartsBox}>
        <div className={styles.heatChartsDiff}>
          <div>
            相似性热图
          </div>
        </div>
        <div ref={(ref) => {
          this.heatChart = ref;
        }} className={styles.heatCharts} />
      </div>
    );
  }
}
