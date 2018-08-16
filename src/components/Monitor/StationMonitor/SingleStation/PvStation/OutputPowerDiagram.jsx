

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
    
  }

  componentWillReceiveProps(nextProps){
    const { capabilityData, powerData } = this.props;
    const tmpData = capabilityData.map(e=>e.stationPower);
    console.log(tmpData);
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
        formatter: function(params){
          console.log(JSON.stringify(params));
          console.log(params);
        },
        axisPointer: {
          type: 'cross',
          label: {
              backgroundColor: '#6a7985'
          }
        },
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: [{
            value: capabilityData.map(e=>e.localTime.slice(5)),
            textStyle: {
              color: '#999',
            }
          }],
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
        }
      ],
      yAxis: [
        {
          name: '功率(MW)',
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          nameTextStyle: {
            color: '#999',
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          max: 15,
        },
        {
          name: '瞬时辐照(w/m2)',
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          nameTextStyle: {
            color: '#999',
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          max: 1000,
        }
      ],
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 10
      }, {
          start: 0,
          end: 10,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
      }],
      series: [
        {
          name:'功率',
          type:'line',
          smooth:true,
          data: capabilityData.map(e=>e.stationPower),
          yAxisIndex: 0,
          areaStyle: {
            color: '#fff2f2',
          }
        },
        {
          name:'瞬时辐照',
          type:'line',
          smooth:true,
          data: capabilityData.map(e=>e.instantaneous),
          yAxisIndex: 1,
        }
      ]              
    })
  }

  render(){
    return (
      <div className={styles.outputPowerDiagram}>
        <div id="capabilityDiagram" style={{ width: "50%", height: "100%",borderRight:"2px solid #dfdfdf",color: '#999', paddingTop: "20px" }}></div>
        <div className={styles.powerDiagram} ></div>
      </div>
    )
  }
}

export default OutputPowerDiagram;
