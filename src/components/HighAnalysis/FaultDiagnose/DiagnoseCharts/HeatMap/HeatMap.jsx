import React from "react";
import PropTypes from "prop-types";
import eCharts from "echarts";
import { heatTemperatureOptions } from "../chartsConfig/chartsConfig";
import styles from "./heatMap.scss";



export default class HeatMap extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    similarityList: PropTypes.array,
    getSimilarityList: PropTypes.func,
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
        getSimilarityList
      }
    } = this;
    const params = {
      taskId: "387338641160192",
      date: "2019-04-19"
    };
    const myChart = eCharts.init(heatChart);
    //接口
    getSimilarityList(params);
    myChart.setOption(heatTemperatureOptions(similarityList, params.date));
  }

  componentDidUpdate() {
    const  {
      heatChart,
      props: {
        similarityList,
      }
    } = this;
    const params = {
      taskId: "387338641160192",
      date: "2019-04-19"
    };
    const myChart = eCharts.init(heatChart);
    myChart.setOption(heatTemperatureOptions(similarityList, params.date));
  }

  render() {
    const { similarityList } = this.props;
    console.log(similarityList, "-=-=similarityList-=-");
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
