
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { message } from "antd";
import echarts from 'echarts';
import bmap from 'echarts/extension/bmap/bmap';


class GpsMap extends Component {
  static propTypes = {
    allMonitorStation: PropTypes.object,
    testId: PropTypes.string,
    stationDataList: PropTypes.array,
     history: PropTypes.object,
  }
  constructor(props) {
    super(props)
    // this.state = {
    //   barData: []
    // }
  }
  
  componentDidMount() {
    const { testId, stationDataList } = this.props;
    const testChart = echarts.init(document.getElementById(testId));
    this.setMapChart(testChart, stationDataList);
  }
  
  componentWillReceiveProps(nextProps) {
    const { testId, stationDataList } = nextProps;
    if(this.props.stationDataList.length !== nextProps.stationDataList.length) {
      const testChart = echarts.init(document.getElementById(testId));
      this.setMapChart(testChart, stationDataList);
    }
  }
  
  setMapChart = (testChart, stationDataList) => {
    const option = {
      bmap: {
        center: [116.46, 39.92],//中心点
        zoom: 10,
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
              'color': '#666'
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
          // formatter: (params) => {
            
          // },
          // width:'128px',
          // height:'68px',
          backgroundColor: '#fff',
          textStyle: {
            color: '#666',
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        },
        name: '巡检人',
        // symbol:'image//../../../../../theme/img/wind-normal.png',
        coordinateSystem: 'bmap',
        data: [
          { name: 'dali',value: [116, 39.92]},
          { name: 'daliaa' ,value: [117, 39.92]},
        ],
        // data: stationDataList,
        symbolSize:[10,10],
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
      if(params.data.stationStatus!=='900'){
      return this.props.history.push(`/monitor/singleStation/${params.data.stationCode}`)  
    }else{
      this.showTip();
    }  
   
    })
  }
  showTip = (e) => {
    message.destroy();
    message.config({
      top: 225,
      duration: 200,
      maxCount: 1,
    });
    message.warning('电站未接入,无法查看详情',2);
  }

  render() {
    // const { barData } = this.state;
    const { testId } = this.props;
    return (
      <div id={testId} style={{ width: "100%",  flex: 1 }} ></div>
    )
  }
}
export default withRouter(GpsMap);


  
