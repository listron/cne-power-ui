import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { message } from "antd";
import echarts from 'echarts';
import bmap from 'echarts/extension/bmap/bmap';
class OrbitMap extends Component {
  static propTypes = {
    allMonitorStation: PropTypes.object,
    testId: PropTypes.string,
    users: PropTypes.string,
    orbitList: PropTypes.any,
    history: PropTypes.object,
  }
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const { testId, orbitList, users, itemOrbit, startAndEndCoord, data } = this.props;
    const testChart = echarts.init(document.getElementById(testId));
    this.setMapChart(testChart, orbitList, users, itemOrbit, startAndEndCoord, data);
  }

  componentWillReceiveProps(nextProps) {
    const { testId, orbitList, users, itemOrbit, startAndEndCoord, data } = nextProps;
    if (this.props.orbitList.length !== nextProps.orbitList.length || users !== this.props.users) {
      const testChart = echarts.init(document.getElementById(testId));
      this.setMapChart(testChart, orbitList, users, itemOrbit, startAndEndCoord, data);
    }
  }

  setMapChart = (testChart, orbitList, users, itemOrbit, startAndEndCoord, data) => {
    // 取中心点
    const pointData = orbitList && orbitList[0] && orbitList[0].pointData;
    const option = {
      bmap: {
        // 没数据的时候默认北京中心点
        center: (!pointData || pointData.length === 0) ? [116.46, 39.92] : [pointData[0].longitude, pointData[0].latitude],//中心点
        zoom: 11,
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
              'color': '#353535'
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
        show: false,
      },
      selected: {
        '刘德华1': true,
      },
      // 类型是：scatter散点
      series: [
        {
          name: '刘德华1',
          type: 'lines',
          lineStyle: {
            normal: {
              width: 3,
            }
          },
          mapType: 'none',
          tooltip: {
            enterable: true,
            formatter: (params) => {
              return `<div style='display:flex; flex-direction: column;'>
            <div style='width:30px;height:30px;'><img src='/img/people.png'>${params.name}</div>
            <div style='height:30px;line-height:30px'>${params.data.date}</div>
            </div>`
            },
            backgroundColor: '#fff',
            textStyle: {
              color: '#353535',
            },
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          },
          markPoint: {
            effect: {
              show: true,
              type: 'bounce',
              period: 3,
            },
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
              },
              emphasis: {
                label: {
                  show: false,
                },
              },
            },
            data: startAndEndCoord,
            // data: [
            //   {
            //     coord: ['132.1212', '33.2321'],
            //     tooltip: {
            //       formatter: '起点'
            //     },
            //     symbol:'image:///img/position.png',
            //   },{
            //     coord: [116.4551, 40.2539],
            //     tooltip: {
            //       formatter: '终点'
            //     },
            //     symbol:'image:///img/end.png',
            //   }
            // ]

          },
          coordinateSystem: 'bmap',
          data: data,
          //  data: [
          // [{ coord: ["132.214", "33.32534"] }, { coord: ["133.124", "34.352"] }],
          //  { coords: [['119.4543', '25.9222'],['87.9236', '43.5883']],name:'刘德华1',dateValue:['2017-2018'] },
          // [{ coord: ['87.9236', '43.5883'] }, { coord: ['116.4551', '40.2539'] }],
          // ],
          symbolSize: [8],
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
              borderWidth: 5
            }
          },
        },
      ]
    };
    try {
      // testChart.clear();
      testChart.setOption(option, 'notMerge');
    } catch (error) {
      message.error('中国地图获取失败,请稍后刷新重试');
      console.log(error);
    }
    // testChart.setOption(option)
  }

  render() {
    const { testId } = this.props;
    return (
      <div id={testId} style={{ width: "100%", flex: 1 }} />
    )
  }
}
export default withRouter(OrbitMap);
