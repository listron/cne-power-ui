import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import styles from './point.scss';

class PointChart extends PureComponent{
  static propTypes = {
    pointsLoading: PropTypes.bool,
    histogramList: PropTypes.array,
  }

  componentDidMount(){
    const { histogramList } = this.props;
    histogramList && histogramList.length > 0 && this.drawChart(histogramList);
  }

  componentWillReceiveProps(nextProps){
    const { histogramList, pointsLoading } = nextProps;
    const preLoading = this.props.pointsLoading;
    if (preLoading && !pointsLoading) { // 请求完毕
      this.drawChart(histogramList);
    } else if (!preLoading && pointsLoading) { // 请求中
      this.setChartLoading();
    }
  }

  setChartLoading = () => {
    const histogramChart = this.histogramRef && echarts.getInstanceByDom(this.histogramRef);
    histogramChart && histogramChart.showLoading();
  }

  drawChart = (histogramList) => {
    const histogramChart = echarts.init(this.histogramRef);
    const dataAxis = [], rateData = [];
    // histogram: [[0.0, 15.0, 0.1034], [15.0, 30.0, 0.1034], [30.0, 45.0, 0.1034], [45.0, 60.0, 0.0], [60.0, 75.0, 0.0517], [75.0, 90.0, 0.1034], [90.0, 105.0, 0.1552], [105.0, 120.0, 0.069], [120.0, 135.0, 0.0345], [135.0, 150.0, 0.0], [150.0, 165.0, 0.0], [165.0, 180.0, 0.0], [180.0, 195.0, 0.0172], [195.0, 210.0, 0.0172], [210.0, 225.0, 0.2414]]
    histogramList.forEach(e => {
      const [startNum, endNum, rate] = e || [];
      dataAxis.push(`${startNum}~${endNum}`);
      rateData.push(rate * 100);
    });
    const option = {
      grid: {
        top: 20,
        bottom: 24,
        left: 30,
        right: 5,
        // containLabel: true,
      },
      xAxis: {
        data: dataAxis,
        axisLabel: {
          textStyle: {
            color: '#666',
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#dfdfdf',
          },
        },
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: '#dfdfdf',
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#666666',
          },
        },
        nameTextStyle: {
          color: '#666666',
        },
      },
      tooltip: {
        trigger: 'axis',
        padding: 0,
        formatter: (param = []) => {
          const { name, value } = param[0] || {};
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>${name}</h3>
            <div class=${styles.info}>
              <span class=${styles.infoText}>占比</span>
              <span>${value}%</span>
            </div>
          </section>`;
        },
      },
      series: [{
        type: 'bar',
        barWidth: '8px',
        cursor: 'default',
        itemStyle: {
          color: new echarts.graphic.LinearGradient( 0, 0, 0, 1, [
            {offset: 0, color: '#1cfcf4' },
            {offset: 1, color: '#009cff' },
          ]),
        },
        data: rateData,
      }],
    };
    histogramChart.hideLoading();
    histogramChart.setOption(option);
  }

  render(){
    return(
      <section className={styles.histogramChart}>
        <h3>有效值分布图</h3>
        <div className={styles.chart} ref={(ref) => { this.histogramRef = ref; }} />
      </section>
    );
  }
}

export default PointChart;
