
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';
import echarts from 'echarts';
import bmap from 'echarts/extension/bmap/bmap';


class GpsMap extends Component {
  static propTypes = {
    testId: PropTypes.string,
    personnelGpsData: PropTypes.array,
    history: PropTypes.object,
  }
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    const { testId, personnelGpsData } = this.props;
    const testChart = echarts.init(document.getElementById(testId));
    this.setMapChart(testChart, personnelGpsData);
  }

  componentWillReceiveProps(nextProps) {
    const { testId, personnelGpsData } = nextProps;
    if (this.props.personnelGpsData.length !== nextProps.personnelGpsData.length) {
      const testChart = echarts.init(document.getElementById(testId));
      this.setMapChart(testChart, personnelGpsData);
    }
  }

  setMapChart = (testChart, personnelGpsData) => {
    const styleJson = [{
      'featureType': 'water',
      'elementType': 'all',
      'stylers': {
        'color': '#142977',
      },
    }, {
      'featureType': 'land',
      'elementType': 'all',
      'stylers': {
        'color': '#001568',
      },
    }, {
      'featureType': 'railway',
      'elementType': 'all',
      'stylers': {
        'visibility': 'off',
      },
    }, {
      'featureType': 'highway',
      'elementType': 'all',
      'stylers': {
        'color': '#fdfdfd',
      },
    }, {
      'featureType': 'highway',
      'elementType': 'labels',
      'stylers': {
        'visibility': 'off',
      },
    }, {
      'featureType': 'arterial',
      'elementType': 'geometry',
      'stylers': {
        'color': '#0065c6',
      },
    }, {
      'featureType': 'arterial',
      'elementType': 'geometry.fill',
      'stylers': {
        'color': '#0065c6',
      },
    }, {
      'featureType': 'poi',
      'elementType': 'all',
      'stylers': {
        'visibility': 'off',
      },
    }, {
      'featureType': 'green',
      'elementType': 'all',
      'stylers': {
        'visibility': 'off',
      },
    }, {
      'featureType': 'subway',
      'elementType': 'all',
      'stylers': {
        'visibility': 'off',
      },
    }, {
      'featureType': 'manmade',
      'elementType': 'all',
      'stylers': {
        'color': '#142977',
      },
    }, {
      'featureType': 'local',
      'elementType': 'all',
      'stylers': {
        'color': '#142977',
      },
    }, {
      'featureType': 'arterial',
      'elementType': 'labels',
      'stylers': {
        'visibility': 'off',
      },
    }, {
      'featureType': 'boundary',
      'elementType': 'all',
      'stylers': {
        'color': '#0065c6',
      },
    }, {
      'featureType': 'building',
      'elementType': 'all',
      'stylers': {
        'color': '#142977',
      },
    }, {
      'featureType': 'label',
      'elementType': 'labels.text.fill',
      'stylers': {
        'color': '#00baffFF',
        'weight': 10,
      },
    }];
    const option = {
      bmap: {
        center: [116, 39.92], //中心点
        zoom: 5,
        roam: true, //可放大缩小
        mapStyle: {
          styleJson: styleJson,
        }, //地图样式配置
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
          formatter: (params) => {
            return `<div style='display:flex; flex-direction: row;'><div style='width:30px;height:30px;'><img src='/img/people.png'></div> <div style='height:30px;line-height:30px'>${params.data.name}</div></div>`;
          },
          width: '128px',
          height: '68px',
          backgroundColor: '#fff',
          textStyle: {
            color: '#666',
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        },
        name: '巡检人',
        coordinateSystem: 'bmap',
        // data: [
        //   { name: 'dali',value: [116, 39.92]},
        //   { name: 'daliaa' ,value: [117, 39.92]},
        // ],
        data: personnelGpsData,
        symbolSize: [20, 20],
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
          },
        },
        itemStyle: {
          emphasis: {
            borderColor: '#199475',
            borderWidth: 5,
          },
        },
      }],
    };
    try {
      testChart.setOption(option);
    } catch (error) {
      message.error('中国地图获取失败,请稍后刷新重试');
      console.log(error);
    }
    // testChart.on('click', (params) => {
    //   if(params.data.stationStatus!=='900'){
    //   return this.props.history.push(`/monitor/singleStation/${params.data.stationCode}`)  
    // }else{
    //   this.showTip();
    // }  

    // })
  }
  // showTip = (e) => {
  //   message.destroy();
  //   message.config({
  //     top: 225,
  //     duration: 200,
  //     maxCount: 1,
  //   });
  //   message.warning('电站未接入,无法查看详情',2);
  // }

  render() {
    // const { barData } = this.state;
    const { testId } = this.props;
    return (
      <div id={testId} style={{ width: '100%', flex: 1 }} ></div>
    );
  }
}
export default withRouter(GpsMap);



