
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
    orbitList: PropTypes.array,
    history: PropTypes.object,
  }
  constructor(props) {
    super(props)

  }

  componentDidMount() {
    const { testId, orbitList } = this.props;
    console.log(orbitList);
    const testChart = echarts.init(document.getElementById(testId));
    this.setMapChart(testChart, orbitList);
  }

  componentWillReceiveProps(nextProps) {
    const { testId, orbitList, users } = nextProps;
    if (this.props.orbitList.length !== nextProps.orbitList.length || users !== this.props.users) {
      const testChart = echarts.init(document.getElementById(testId));
      this.setMapChart(testChart, orbitList);
    }
  }

  setMapChart = (testChart, orbitList) => {
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
        data: ['刘德华1'],
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
            <div style='width:30px;height:30px;'><img src='/img/people.png'>${params.data.name}</div>
            <div style='height:30px;line-height:30px'>${params.data.trackDate}</div>
            </div>`
            },
            backgroundColor: '#fff',
            textStyle: {
              color: '#666',
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
            data: [
              {
                coord: [113.5107, 23.2196],
                tooltip: {
                  formatter: '起点'
                },
                symbol:'image:///img/position.png',
              },{
                coord: [116.4551, 40.2539],
                tooltip: {
                  formatter: '终点'
                },
             
                symbol:'image:///img/end.png',
              }
            ]

          },

          coordinateSystem: 'bmap',
          //data: orbitList,
          data: [
            [{ coord: [113.5107, 23.2196] }, { coord: [119.4543, 25.9222] }],
            [{ coord: [119.4543, 25.9222] }, { coord: [87.9236, 43.5883] }],
            [{ coord: [87.9236, 43.5883] }, { coord: [116.4551, 40.2539] }],
          ],
          symbolSize: [20, 20],
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
    testChart.setOption(option)
  }
  render() {
    const { testId } = this.props;
    return (
      <div id={testId} style={{ width: "100%", flex: 1 }} ></div>
    )
  }
}
export default withRouter(OrbitMap);



