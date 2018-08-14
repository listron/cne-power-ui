

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import echarts from 'echarts';

class OutputPowerDiagram extends Component {
  static propTypes = {
    capabilityData: PropTypes.array,
    powerData: PropTypes.array,
  }

  constructor(props){
    super(props);

  }
  componentDidMount(){
    const { capabilityData, powerData } = this.props;
    const capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'));
    capabilityDiagram.setOption({
      title: {
        text: '出力图',
        textStyle: {
          color: '#666',
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
      legend: {
        data:['功率','瞬时辐照'],
        textStyle: {
          color: '#999',
          fontSize: 12,
        },
      },
      grid: {
        show: false,
      },
      tooltip: {
        trigger: 'axis',
        showContent: true,
        triggerOn: 'mousemove',
        enterable: true,
        backgroundColor: '#fff',
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
      },
      calculable: true,
      xAxis: [
        {
          type: 'time',
          boundaryGap: false,
          data: capabilityData.map(e=>e.localTime)
        }
      ],
      yAxis: [
        {
          name: '功率(MW)',
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          name: '瞬时辐照(w/m2)',
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      series: [
        {
          name:'功率',
          type:'line',
          data:[0, 3, 6, 9, 12, 15, 18],
          yAxisIndex: 0,
          markLine: {
            data: [
              {type: 'average', name: '平均值'}
            ]
          }
        },
        {
          name:'瞬时辐照',
          type:'line',
          data:[0, 200, 400, 600, 800, 1000],
          yAxisIndex: 1,
          markLine: {
            data: [
              {type : 'average', name : '平均值'}
            ]
          }
        }
      ]              
    })
  }
  render(){
    return (
      <div className={styles.outputPowerDiagram}>
        <div id="capabilityDiagram" style={{ width: "50%", height: "100%",borderRight:"2px solid #dfdfdf",color: '#999', marginTop: "20px" }}></div>
        <div className={styles.powerDiagram} ></div>
      </div>
    )
  }
}

export default OutputPowerDiagram;
