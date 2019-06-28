import React, {Component} from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import styles from './scatterDiagram.scss';
import moment from 'moment';
import { dataFormat } from '../../../../utils/utilFunc';

class ScatterDiagramChart extends Component{

  static propTypes = {
    chartTime: PropTypes.number,
    pointsInfo: PropTypes.array,
    logPointX: PropTypes.string,
    logPointY: PropTypes.string,
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
    const { chartLoading, pointsInfo, logPointX, logPointY } = this.props;
    const xCurrentPoint = pointsInfo.find(e =>{ // 选中x轴devicePointName
      return e.devicePointCode === logPointX;
    }) || {};
    const yCurrentPoint = pointsInfo.find(e =>{ // 选中y轴devicePointName
      return e.devicePointCode === logPointY;
    }) || {};
    const monitorScatter = echarts.init(document.getElementById('monitorScatterDiagram'));
    chartLoading ? monitorScatter.showLoading('default', { color: '#199475' }) : monitorScatter.hideLoading();
    const scatterData = scatterDiagramCharts.map(e => [e.xData, e.yData,moment(e.time).format('YYYY-MM-DD HH:mm:ss'),e.xUnit,e.yUnit]);
    let color = ['#199475'];
    const lineColor = '#f1f1f1';
    const fontColor = '#333';
    monitorScatter.setOption({
      color: color,
      tooltip: {
        trigger: 'item',
        width: 192,
        height: 86,
        padding:16,
        backgroundColor: '#fff',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.65)',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
        formatter: params => {
          const xName = xCurrentPoint.devicePointName || 'X轴';
          const yName = yCurrentPoint.devicePointName || 'Y轴';
          const [xValue,yValue,time,xUnit,yUnit]=params.value;
          return(
            `<div class=${styles.chartTool}>
              <h3 class=${styles.title}>${time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : ''}</h3>
              <p class=${styles.value}>${xName}：${dataFormat(xValue, '--', 2)}${xUnit || ''}</p>
              <p class=${styles.value}>${yName}：${dataFormat(yValue, '--', 2)}${yUnit || ''}</p>
            </div>`
          )
        }
      },
      grid:{
        bottom:100,
        right:'15%',
        left:"8%"
      },
      xAxis: {
        name: `${xCurrentPoint.devicePointName || ''}${xCurrentPoint.devicePointUnit ? `(${xCurrentPoint.devicePointUnit})` : ''}`,
        type: 'value',
        scale: true,
        splitNumber: 20,
        nameTextStyle:{color:fontColor},
        splitLine: { 
          show:false,
        },
        axisTick: { 
          show: false
        },
        axisLine: { 
          onZero:false,
          lineStyle: {
            color: lineColor,
          },
        },
        axisLabel: {
          color: fontColor,
        },
      },
      yAxis: {
        name: `${yCurrentPoint.devicePointName || ''}${yCurrentPoint.devicePointUnit ? `(${yCurrentPoint.devicePointUnit})` : ''}`,
        type: 'value',
        scale: true,
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        splitLine: { lineStyle: { color: lineColor } },
      },
      series: [{
        name: 'scatter',
        type: 'scatter',
        data: scatterData
      }]
    });
    window.onresize = function () {
      monitorScatter.resize();
    };
  }   

  render(){
    return(
      <div className={styles.scatterDiagramChart}>
        <div id="monitorScatterDiagram" style={{ width: '100%' }}></div>
      </div>
    )
  }
}

export default ScatterDiagramChart;