import React, { Component } from 'react';
import StationTypeTag from './StationTypeTag';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';
import { dataFormat } from '../../../../utils/utilFunc';

class DeviceStatus extends Component {
  static propTypes = {
    realTimeInfo: PropTypes.object,
    hasMultipleType: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {
      statusType: 'all'
    }
  }

  componentWillReceiveProps(nextProps) {
    const { realTimeInfo } = nextProps;
    this.setStatusChart(realTimeInfo);
  }

  setStatusChart = (realTimeInfo) => {
    const statusBox = document.getElementById('homeDeviceStatus');
    const statusChart = echarts.init(statusBox);
    const { statusType } = this.state;
    let statusInfo = [];
    if (statusType === 'all') {
      statusInfo = realTimeInfo.allDeviceStatus || [];
    } else if(statusType === 'wind') {
      statusInfo = realTimeInfo.windDeviceStatus || [];
    } else if(statusType === 'pv') {
      statusInfo = realTimeInfo.pvDeviceStatus || [];
    }
    let hasData = statusInfo.some(e => e.deviceStatusName || e.deviceStatusName === 0);
    const statusPieData = statusInfo.map(e => ({
      value: e.deviceStatusNum, 
      name: e.deviceStatusName,
    }));
    const option = {
        graphic: hasData? hiddenNoData : showNoData,
        color: ['#145998', '#3fa9ef', '#6868b2', '#6ae3c1'],
        title: {
          show: false,
        },
        tooltip: {
          formatter: '{b}：{c}({d}%)'
        },
        tooltip: {
          extraCssText: 'background-color: rgba(0, 0, 0, 0.8)',
          padding: 10,
          formatter: params => {
            return `<div class=${styles.statusTool}>
              <div class=${styles.status}>
                <span class=${styles.name}>${params.name}</span>
                <span class=${styles.value}>${params.value}</span>
              </div>
              <div class=${styles.percent}>
                <span class=${styles.name}>占比</span>
                <span class=${styles.value}>${dataFormat(params.percent, '--', 2)}%</span>
              </div>
            </div>`
          },
        },
        legend: {
          show: false,
        },
        grid: {
          top: 10,
          bottom: 30,
        },
        series: [
          {
            name: '设备状态',
            type: 'pie',
            label: { 
              show: false
            },
            radius: ['55%', '80%'],
            data: statusPieData
          },
        ]
    }
    statusChart.setOption(option);
  } 

  changeStatusType = statusType => {
    const { realTimeInfo } = this.props;
    this.setState({ statusType }, () => { // 立刻重新渲染chart图
      this.setStatusChart(realTimeInfo);
    });
  }

  render(){
    const { realTimeInfo, hasMultipleType } = this.props;
    const { statusType } = this.state;
    let statusInfo = [];
    if(statusType === 'all'){
      statusInfo = realTimeInfo.allDeviceStatus || [];
    }else if(statusType === 'wind'){
      statusInfo = realTimeInfo.windDeviceStatus || [];
    }else if(statusType === 'pv'){
      statusInfo = realTimeInfo.pvDeviceStatus || [];
    }
    return (
      <section className={styles.deviceStatus}>
        <h3>设备状态</h3>
        {hasMultipleType && <div className={styles.checkTags}>
          <StationTypeTag showTotal activeType={statusType} onChange={this.changeStatusType} />
        </div>}
        <div className={styles.statusBox}>
          <div id="homeDeviceStatus" className={styles.statusChart}></div>
          <div className={styles.statusTotal}>
            {statusInfo.map((e, i)=>{
              const backgroundArr = ['#145998', '#3fa9ef', '#6868b2', '#6ae3c1'];
              return (
                <span className={styles.eachStatus} key={e.deviceStatus}>
                  <span className={styles.round} style={{backgroundColor: backgroundArr[i]}}></span>
                  <span className={styles.text}>{e.deviceStatusName}</span>
                  <span className={styles.value}>{e.deviceStatusNum}</span>
                </span>
              )
            })}
          </div>
        </div>
      </section>
    )
  }
}

export default DeviceStatus;
