import React, {Component} from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import styles from './scatterDiagram.scss';

class ScatterDiagramChart extends Component{
  static propTypes = {
    allscatterDiagram: PropTypes.object,
    chartLoading: PropTypes.bool,
  }
  componentDidMount() {
    const {allscatterDiagram, getChartScatterDiagram} = this.props;
    this.drawChart(allscatterDiagram);
    getChartScatterDiagram({

    })
  }

  drawChart = (allscatterDiagram) => {
    var myChart = echarts.init(document.getElementById('main'));
    let powerData = [], speedData = [];
    console.log(allscatterDiagram.pointData.length)
    allscatterDiagram.pointData.length > 0 && allscatterDiagram.pointData.forEach(e => {
        // powerData.push(e.xData || '--')
        powerData.push(e.xData)
        // speedData.push(e.yData)
        // powerData.push(e.yData)
      })
      console.log(powerData)
    // allscatterDiagram.pointData.length > 0 && allscatterDiagram.pointData.forEach(e => {
    //   powerData.push(e.xData || '--')
    //   speedData.push(e.yData)
    // })
   
    const data = powerData;
    myChart.setOption({
      tooltip: {
        trigger: 'axis',
          axisPointer: {
              type: 'cross'
          }
      },
      xAxis: {
        type: 'value',
        // data: speedData,
        splitNumber: 20
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        name: 'scatter',
        type: 'scatter',
        data: data
      }]
    });
  }   

  render(){
    const {allscatterDiagram} = this.props;
    // console.log(allscatterDiagram.pointData.length)
    // console.log(allscatterDiagram.pointData.length)
    return(
      <div className={styles.scatterDiagramChart}>
        <div id="main" style={{ width: 400, height: 400 }}></div>
      </div>
    )
  }
}

export default ScatterDiagramChart;