

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import echarts from 'echarts';
import { Radio } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class OutputPowerDiagram extends Component {
  static propTypes = {
    capabilityData: PropTypes.array,
    powerData: PropTypes.array,
    match: PropTypes.object,
    getMonitorPower: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }


  componentWillReceiveProps(nextProps) {
    const { capabilityData, powerData } = nextProps;
    const lineColor = '#999';
    const stationPowerData = capabilityData && capabilityData.map(e => e.stationPower);
    const instantaneousData = capabilityData && capabilityData.map(e => e.instantaneous);
    const filterStationPowerData = capabilityData && capabilityData.filter(e => e.stationPower);
    const filterInstantaneousData = capabilityData && capabilityData.filter(e => e.instantaneous);
    const capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'));
    const powerDiagram = echarts.init(document.getElementById('powerDiagram'));

    const graphicData = ((stationPowerData.length === 0 && filterStationPowerData.length === 0) && (instantaneousData.length === 0 && filterInstantaneousData.length === 0)) ? [
      {
        type: 'group',
        left: 'center',
        top: 'center',
        children: [
          {
            type: 'text',
            z: 100,
            left: 'center',
            top: 'middle',
            style: {
              fill: '#999',
              text: [
                '暂无数据'
              ],
              font: '14px Microsoft YaHei',
            }
          }
        ]
      }
    ] : [];

    const tmpOption = {
      title: {
        text: '出力图',
        textStyle: {
          color: '#666',
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
      legend: {
        data: ['功率', '瞬时辐照'],
        textStyle: {
          color: lineColor,
          fontSize: 12,
        },
      },
      grid: {
        show: true,
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        backgroundColor: '#fff',
        textStyle: {
          color: lineColor,
          fontSize: '12px',
        }
      },
      graphic: graphicData,
      calculable: true,
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: capabilityData && capabilityData.map(e => {
            return moment(moment.utc(e.utc).toDate()).format('MM/DD hh:mm');
          }),
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: lineColor,
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
            color: lineColor,
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          splitLine: {
            show: false,
          }
        },
        {
          name: '瞬时辐照(W/m²)',
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          nameTextStyle: {
            color: lineColor,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          splitLine: {
            show: false,
          }
        }
      ],
      series: [
        {
          name: '功率',
          type: 'line',
          smooth: true,
          data: stationPowerData,
          yAxisIndex: 0,
          areaStyle: {
            color: '#fff2f2',
          }
        },
        {
          name: '瞬时辐照',
          type: 'line',
          smooth: true,
          data: instantaneousData,
          yAxisIndex: 1,
          itemStyle: {
            color: "#199475",
          },
          lineStyle: {
            type: 'solid',
          }
        }
      ]
    }
   

    capabilityDiagram.setOption(tmpOption);

    if (nextProps.capabilityData !== this.props.capabilityData && nextProps.capabilityData.length !== 0) {
      echarts.dispose(document.getElementById('capabilityDiagram'));
      const capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'));
      capabilityDiagram.setOption(tmpOption);
    }

    // if((stationPowerData.length===0&&filterStationPowerData.length===0)&&(instantaneousData.length===0&&filterInstantaneousData.length===0)){
    //   capabilityDiagram.setOption(tmpOption);
    // }else{
    //   echarts.dispose(document.getElementById('capabilityDiagram'));
    //   const capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'));
    //   capabilityDiagram.setOption(tmpOptionTest);
    // }


    // if(graphicData.length === 0){
    //   echarts.dispose(document.getElementById('capabilityDiagram'));
    //   const capabilityDiagram = echarts.init(document.getElementById('capabilityDiagram'));
    //   capabilityDiagram.setOption(tmpOption);
    // }else{
    //    capabilityDiagram.setOption(tmpOption);
    // }
    // //console.log(tmpOption.graphic)
    // capabilityDiagram.setOption(tmpOption);

    powerDiagram.setOption({
      noDataLoadingOption: {
        text: '暂无数据',
        effect: 'whirling',
        textStyle: {
          fontSize: 20
        },
        effectOption: {
          effect: {
            n: 0
          }
        }
      },
      color: ['#a42b2c', '#c7ceb2', '#f7c028'],
      title: {
        text: '发电量',
        textStyle: {
          color: '#666',
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
      legend: {
      },
      grid: {
        show: true,
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        backgroundColor: '#fff',
        textStyle: {
          color: lineColor,
          fontSize: '12px',
        },
        formatter: (param) => {
          let rate = (param[0].value / param[1].value) < 1 ? (param[0].value / param[1].value).toFixed(2) + '%' : '100%';
          return [
            param[0].name + '<hr size=1 style="margin: 3px 0">',
            '日曝辐值: ' + param[2].value + '<br/>',
            '实际发电量: ' + param[0].value + '<br/>',
            '理论发电量: ' + param[1].value + '<br/>',
            '完成率: ' + rate + '<br/>',
          ].join('');
        }
      },
      calculable: false,
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: powerData && powerData.map(e => e.time),
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: lineColor,
          },
          axisTick: { show: false },
          boundaryGap: [true, true],
        }
      ],
      yAxis: [
        {
          name: '电量(万kWh)',
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          nameTextStyle: {
            color: lineColor,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },

        },
        {
          name: '日曝辐值(W/m²)',
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          nameTextStyle: {
            color: lineColor,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
        }
      ],
      series: [
        {
          name: '实际发电量',
          type: 'bar',
          data: powerData && powerData.map(e => e.actualPower),
          label: {
            show: false,
            rotate: 90,
            distance: 10,
            color: '#fff',
            align: 'left',
            verticalAlign: 'middle',
            position: 'insideBottom',
          },
          barGap: '0',
          barWidth: 14,
        },
        {
          name: '理论发电量',
          type: 'bar',
          data: powerData && powerData.map(e => e.theoryPower),
          label: {
            show: false,
            rotate: 90,
            distance: 10,
            color: '#fff',
            align: 'left',
            verticalAlign: 'middle',
            position: 'insideBottom',
          },
          barWidth: 14,
        },
        {
          name: '瞬时辐照',
          type: 'line',
          data: powerData && powerData.map(e => e.instantaneous),
          yAxisIndex: 1,
          lineStyle: {
            type: 'solid',
            color: "#f7c028",
          }
        }
      ]
    })
  }

  onChangeTimePower = (e) => {
    const { stationCode } = this.props.match.params;
    this.props.getMonitorPower({
      stationCode,
      intervalTime: parseInt(e.target.value),
      startTime: moment().set({ 'year': moment().year(), 'month': 0, 'date': 1, }).format('YYYY-MM-DD'),
      endTime: moment().format('YYYY-MM-DD'),
    });
  }

  render() {
    const resourceAnalysis = "/statistical/stationaccount/resource";
    const productionAnalysis = "/statistical/stationaccount/production";
    return (
      <div className={styles.outputPowerDiagram}>
        <div className={styles.capabilityDiagramBox} >
          <div id="capabilityDiagram" style={{ width: "100%", height: "100%", borderRight: "2px solid #dfdfdf", color: '#999', paddingTop: "20px" }}><i className="iconfont icon-more"></i></div>
          <Link to={resourceAnalysis} target="_blank"  ><i className="iconfont icon-more"></i></Link>
        </div>
        <div className={styles.powerDiagramBox} >
          <div id="powerDiagram" style={{ width: "100%", height: "100%", color: '#999', paddingTop: "20px" }}></div>
          <div className={styles.powerRadio}>
            <RadioGroup defaultValue="0" size="small" onChange={this.onChangeTimePower} >
              <RadioButton value="0">日</RadioButton>
              <RadioButton value="1">月</RadioButton>
              <RadioButton value="2">年</RadioButton>
            </RadioGroup>
          </div>
          <Link to={productionAnalysis} target="_blank"  ><i className="iconfont icon-more"></i></Link>
        </div>

      </div>
    )
  }
}

export default OutputPowerDiagram;
