
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import echarts from 'echarts';
import bmap from 'echarts/extension/bmap/bmap';


class Map extends Component {
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
    const { testId, stationDataList } = this.props;
    const testChart = echarts.init(document.getElementById(testId));
    this.setMapChart(testChart, stationDataList);
  }
  componentWillReceiveProps(nextProps) {
    const { testId, stationDataList } = nextProps;
    // console.log('will receive prosp')
    const testChart = echarts.init(document.getElementById(testId));
    this.setMapChart(testChart, stationDataList);
  }
  setMapChart = (testChart, stationDataList) => {
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
        enterable: true,
      },
      legend: {
        orient: 'vertical',
        top: 'bottom',
        left: 'right',
        data: ['正常', '信息中断', '未接入'],
      },
      // 类型是：scatter散点
      series: [{
        type: 'scatter',
        tooltip: {
          enterable: true,
          //position:['50%','50%'],
          formatter: (params) => {
             console.log(params.data);
            return `<div class='stationCard' style='height:70px;overflow:hidden'>
            <div class='stationCardTitle' style='display:flex;flex-direction: row;justify-content: space-between;'>
            <span>${params.data.name}</span>
           

            <span style='color:red' onClick={
             console.log(${params.data.alarmNum},'报警数')}>${params.data.alarmNum > 0 ? '⚠' : ''}${params.data.alarmNum > 0 ? params.data.alarmNum : ''}</span>    
         
            </div>           
            <div class='stationCardProgress' style='background:#dfdfdf;height:1px;
            width:100%;' ></div>
            <div class='stationCardValue'}>
              <span class='stationMark'>${params.data.stationPower}MW</span>
              &nbsp;&nbsp;
              <span>${params.data.stationCapacity}MW</span>
            </div>
            <div class='stationCardWindSpeed'>${params.data.instantaneous}m/s</div>             
          </div>`
          },
          // width:'128px',
          // height:'68px',


          backgroundColor: '#fff',
          textStyle: {
            color: '#999',
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        },

        name: '电站状态',
        // symbol:'image//../../../../../theme/img/wind-normal.png',
        coordinateSystem: 'bmap',
        data: stationDataList,
        symbolSize: 20,
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: false
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
      // console.log(params, '电站的参数');
      this.props.history.push(`monitor/singleStation/${params.data.stationCode}`)
    })
  }

  render() {
    const { barData } = this.state;
    const { testId, stationDataList } = this.props;


    return (
      <div>
        <div id={testId} style={{ width: "100%", height: "620px" }} ></div>
      </div>
    )
  }
}
export default withRouter(Map);

