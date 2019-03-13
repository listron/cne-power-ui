import React, {Component} from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './scatterDiagram.scss';
import { dataFormat } from '../../../../utils/utilFunc';

class ScatterDiagramChart extends Component{
  static propTypes = {

  }
  componentDidMount() {
    this.drawChart(this.props.)
  }

  drawChart = (params) => {
    var scatterChart = echarts.init(document.getElementById('main'));
    let xData = [], yData = [];
    params.length > 0 && params.forEath(e => {
      xData.push(e.power || '--');
      yData.push(e.windSpeed);
    })
    // 绘制图表
    scatterChart.setOption({
      xAxis: {
        splitNumber: 16
      },
      yAxis: {
        splitNumber: 6
      },
      series: [
        { 
          symbolSize: 20,
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'scatter'
      }
    ]
    });
  }

    




  render(){
    const {allscatterDiagram} = this.props;
    console.log(allscatterDiagram);
    
    return(
      <div className={styles.scatterDiagramChart}>
        <div id="main"></div>
      </div>
    )
  }
}

export default ScatterDiagramChart;