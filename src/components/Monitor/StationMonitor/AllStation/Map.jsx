
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import bmap from 'echarts/extension/bmap/bmap';
import { Progress } from 'antd';
import styles from './WindStation/windStation.scss';

class Interval extends Component {
  static propTypes = {
    allMonitorStation: PropTypes.object,
    testId: PropTypes.string,
    stationDataList: PropTypes.array,
  }
  constructor(props) {
    super(props)
    this.state = {
      barData: []
    }
  }
  componentDidMount() {
    const { testId } = this.props
    const testChart = echarts.init(document.getElementById(testId));
    this.setMapChart(testChart);
  }
  setMapChart = (testChart) => {
   
    const { stationDataList } = this.props;

    const option = {
      bmap: {
        center: [116.46, 39.92],//中心点
        zoom: 5,
        roam: true,//可放大缩小
        mapStyle: {
          styleJson: [{
            'featureType': 'water',
            'elementType': 'all',
            'stylers': {
              'color': '#d1d1d1'
            }
          }, {
            'featureType': 'land',
            'elementType': 'all',
            'stylers': {
              'color': '#f3f3f3'
            }
          }, {
            'featureType': 'railway',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          }, {
            'featureType': 'highway',
            'elementType': 'all',
            'stylers': {
              'color': '#fdfdfd'
            }
          }, {
            'featureType': 'highway',
            'elementType': 'labels',
            'stylers': {
              'visibility': 'off'
            }
          }, {
            'featureType': 'arterial',
            'elementType': 'geometry',
            'stylers': {
              'color': '#fefefe'
            }
          }, {
            'featureType': 'arterial',
            'elementType': 'geometry.fill',
            'stylers': {
              'color': '#fefefe'
            }
          }, {
            'featureType': 'poi',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          }, {
            'featureType': 'green',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          }, {
            'featureType': 'subway',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          }, {
            'featureType': 'manmade',
            'elementType': 'all',
            'stylers': {
              'color': '#d1d1d1'
            }
          }, {
            'featureType': 'local',
            'elementType': 'all',
            'stylers': {
              'color': '#d1d1d1'
            }
          }, {
            'featureType': 'arterial',
            'elementType': 'labels',
            'stylers': {
              'visibility': 'off'
            }
          }, {
            'featureType': 'boundary',
            'elementType': 'all',
            'stylers': {
              'color': '#fefefe'
            }
          }, {
            'featureType': 'building',
            'elementType': 'all',
            'stylers': {
              'color': '#d1d1d1'
            }
          }, {
            'featureType': 'label',
            'elementType': 'labels.text.fill',
            'stylers': {
              'color': '#999999'
            }
          }]
        }//地图样式配置
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        top: 'bottom',
        left: 'right',
        data: ['正常', '未接入', '未联网', '告警', '断开'],
      },
      // 类型是：scatter散点
      series: [{
        type: 'scatter',
        tooltip: {
          //position:['50%','50%'],
          formatter: (params)=>{
            //console.log(params.data.name);
            return `<div className={style.stationCard}>
            <div className={styles.stationCardTitle}>
            <span>${params.data.name}</span>&nbsp;&nbsp;
            <span style='color:red'>⚠${params.data.alarmNum}</span>
            </div>           
            <div className={styles.stationCardProgress}>
              <Progress percent={50} showInfo={false} />
            </div>
            <div className={styles.stationCardValue}>
              <span className={styles.stationMark}>${params.data.stationPower}MW</span>
              &nbsp;&nbsp;
              <span>${params.data.stationCapacity}MW</span>
            </div>
            <div className={styles.stationCardWindSpeed}>${params.data.instantaneous}m/s</div>             
          </div>`

            

          },
            

          backgroundColor: '#fff',
          textStyle: {
            color: '#999',
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        },
       
        name: '电站状态',
        // symbol:'image//../../../../../theme/img/wind-normal.png',
        coordinateSystem: 'bmap',
        //data: coordinate,
        data: stationDataList,

        symbolSize: 12,
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          emphasis: {
            borderColor: '#199475',
            borderWidth: 5
          }
        }
      }]
    };
    testChart.setOption(option)
    testChart.on('click', (params) => {
      // alert('我要跳转')
      console.log(params, '电站的参数');

    })
  }

  render() {
    const { barData } = this.state;
    const { testId, stationDataList } = this.props;
   

    return (
      <div>
        <div id={testId} style={{ width: "1210px", height: "620px" }} ></div>
      </div>
    )
  }
}
export default Interval