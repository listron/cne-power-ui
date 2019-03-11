import React, {Component} from 'react';
import styles from './scatterDiagram.scss';

class ScatterDiagramChart extends Component{

  componentDidMount(){
    
  }

  renderChart = () => {
    const charDOM = document.getElementById('scatterDiagramChart');
    

    const option = {
      xAxis: {},
      yAxis: {},
      series: [{
        symbolSize: 20,
        data: [
          [10.0, 8.04],
          [8.0, 6.95],
          [13.0, 7.58],
          [9.0, 8.81],
          [11.0, 8.33],
          [14.0, 9.96],
          [6.0, 7.24],
          [4.0, 4.26],
          [12.0, 10.84],
          [7.0, 4.82],
          [5.0, 5.68]
        ],
        type: 'scatter'
      }]
    };
  }

  render(){
    return(
      <div className={styles.scatterDiagramChart}>
         <div className={styles.innerChart} id="scatterDiagramChart" />
      </div>
    )
  }
}

export default ScatterDiagramChart;