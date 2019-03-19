import React, {Component} from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import styles from './scatterDiagram.scss';
import moment from 'moment';

class ScatterDiagramChart extends Component{

  static propTypes = {
    chartTime: PropTypes.number,
    scatterDiagramCharts: PropTypes.array,
    chartLoading: PropTypes.bool,
  }

  componentDidMount() {
    const { scatterDiagramCharts } = this.props;
    // scatterDiagramCharts.length > 0 && this.renderScatterChart(scatterDiagramCharts);
    this.renderScatterChart(scatterDiagramCharts);
  }

  componentDidUpdate(prevProps) {
    const { scatterDiagramCharts, chartTime } = this.props;
    const preTime = prevProps.chartTime;
    if (chartTime !== preTime) { // 数据重新请求后重绘。
      this.renderChart(scatterDiagramCharts);
    }
  }

  renderScatterChart = (scatterDiagramCharts) => {
    const { chartLoading } = this.props;
    const monitorScatter = echarts.init(document.getElementById('monitorScatterDiagram'));
    if (chartLoading) { // loading态控制。
      monitorScatter.showLoading()
    } else {
      monitorScatter.hideLoading()
    }
    scatterDiagramCharts = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(e => ({ // 调试代码。待数据分析返回后删除。
      time: moment().add(e, 'm'),
      xData: e,
      yData: (16 - e) * e
    }))
    const scatterData = scatterDiagramCharts.map(e => [e.xData, e.yData]);
    const lineColor = '#666';
    let color = ['#199475'];
    monitorScatter.setOption({
      color: color,
      tooltip: {
        trigger: 'axis',
        width: 192,
        height: 86,
        backgroundColor: '#fff',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
        axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: lineColor,
            }
        },
      },
      xAxis: {
        type: 'value',
        splitNumber: 20,
        splitLine: { 
          　show:false
        },
        axisTick: { 
          show: false
        },
        axisLine: { 
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
      },
      series: [{
        name: 'scatter',
        type: 'scatter',
        data: scatterData
      }]
    });
  }   

  render(){
    return(
      <div className={styles.scatterDiagramChart}>
        <div id="monitorScatterDiagram" style={{ width: '100%', height: 400 }}></div>
      </div>
    )
  }
}

export default ScatterDiagramChart;