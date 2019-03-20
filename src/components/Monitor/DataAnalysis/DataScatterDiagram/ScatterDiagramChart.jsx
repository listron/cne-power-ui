import React, {Component} from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import styles from './scatterDiagram.scss';
import moment from 'moment';
import { dataFormat } from '../../../../utils/utilFunc';

class ScatterDiagramChart extends Component{

  static propTypes = {
    chartTime: PropTypes.number,
    scatterDiagramCharts: PropTypes.array,
    chartLoading: PropTypes.bool,
  }

  componentDidMount() {
    const { scatterDiagramCharts } = this.props;
    scatterDiagramCharts.length > 0 && this.renderScatterChart(scatterDiagramCharts);
    this.renderScatterChart(scatterDiagramCharts);
  }

  componentDidUpdate(prevProps) {
    const { scatterDiagramCharts, chartTime } = this.props;
    const preTime = prevProps.chartTime;
    if (chartTime !== preTime) { // 数据重新请求后重绘。
      this.renderScatterChart(scatterDiagramCharts);
    }
  }

  renderScatterChart = (scatterDiagramCharts) => {
    const { chartLoading, pointsInfo, queryParam } = this.props;
    const { xPoint, yPoint } = queryParam;
    const xCurrentPoint = pointsInfo.find(e =>{ // 选中x轴devicePointName
      return e.devicePointCode === xPoint;
    }) || {};

    const yCurrentPoint = pointsInfo.find(e =>{ // 选中y轴devicePointName
      return e.devicePointCode === yPoint;
    }) || {};
    const monitorScatter = echarts.init(document.getElementById('monitorScatterDiagram'));
    if (chartLoading) { // loading态控制。
      monitorScatter.showLoading()
    } else {
      monitorScatter.hideLoading()
    }

    const scatterData = scatterDiagramCharts.map(e => [e.xData, e.yData]);
    
    const lineColor = '#666';
    let color = ['#199475'];
    monitorScatter.setOption({
      color: color,
      tooltip: {
        trigger: 'axis',
        width: 192,
        height: 86,
        padding:16,
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
        formatter: params => {
          return (
            `<div class=${styles.chartTool}>
              ${params.map(e => {
                const { value = [], dataIndex } = e;
                const scatterTime = scatterDiagramCharts[dataIndex] || {};
                const xName = xCurrentPoint.devicePointName || 'X轴';
                const yName = yCurrentPoint.devicePointName || 'Y轴';
                return `<div>
                  <h3>${scatterTime.time ? moment(scatterTime.time).format('YYYY-MM-DD HH:mm:ss') : ''}</h3>
                  <p>${xName}：${dataFormat(value[0], '--', 2)}</p>
                  <p>${yName}：${dataFormat(value[1], '--', 2)}</p>
                </div>`
              })}
            </div>`
          )
        }
      },
      xAxis: {
        name: xCurrentPoint.devicePointName || '',
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
        name: yCurrentPoint.devicePointName || '',
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