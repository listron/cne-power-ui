import React, { Component } from 'react';
import StationTypeTag from './StationTypeTag';
import styles from './miniComponents.scss';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { dataFormat } from '../../../../utils/utilFunc';

class DeviceStatus extends Component {
  static propTypes = {
    realTimeInfo: PropTypes.object,
    hasMultipleType: PropTypes.bool,
  }

  state = { statusType: 'all' }

  componentWillReceiveProps(nextProps) {
    const { realTimeInfo } = nextProps;
    this.setData(realTimeInfo);
  }

  setData = (realTimeInfo) => {
    if (!realTimeInfo){
      return;
    }
    const { statusType } = this.state;
    let statusInfo = [];
    if (statusType === 'all') {
      statusInfo = realTimeInfo.allDeviceStatus || [];
    } else if(statusType === 'wind') {
      statusInfo = realTimeInfo.windDeviceStatus || [];
    } else if(statusType === 'pv') {
      statusInfo = realTimeInfo.pvDeviceStatus || [];
    }
    const hasData = statusInfo.some(e => e.deviceStatusName || e.deviceStatusName === 0);
    const statusPieData = statusInfo.map(e => ({
      value: e.deviceStatusNum,
      name: e.deviceStatusName,
    }));
    this.setStatusChart(statusPieData, hasData);
  }

  setStatusChart = (statusPieData, hasData) => {
    const statusBox = document.getElementById('homeDeviceStatus');
    const statusChart = echarts.init(statusBox);
    let tooltipFormatter;
    if (hasData) { // 有数据
      tooltipFormatter = params => (
        `<div class=${styles.statusTool}>
          <div class=${styles.status}>
            <span class=${styles.name}>${params.name}</span>
            <span class=${styles.value}>${params.value}</span>
          </div>
          <div class=${styles.percent}>
            <span class=${styles.name}>占比</span>
            <span class=${styles.value}>${dataFormat(params.percent, '--', 2)}%</span>
          </div>
        </div>`
      );
    } else { // 无数据占位。
      tooltipFormatter = params => '暂无数据';
      statusPieData.push({ value: 1, name: '' });
    }
    const option = {
        color: this.colors,
        title: {
          show: false,
        },
        tooltip: {
          extraCssText: 'background-color: rgba(0, 0, 0, 0.8)',
          padding: 10,
          formatter: tooltipFormatter,
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
              show: false,
            },
            radius: ['35%', '80%'],
            data: statusPieData,
          },
        ],
    };
    statusChart.setOption(option);
  }

  colors = ['#00a3df', '#f8b14e', '#fd6e8f', '#5522e4']
  noDatasHolder = [
    { backgroundColor: '#00a3df', text: '正常', value: '--' },
    { backgroundColor: '#f8b14e', text: '故障', value: '--' },
    { backgroundColor: '#fd6e8f', text: '停机', value: '--' },
    { backgroundColor: '#5522e4', text: '通讯中断', value: '--' },
  ]

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
          <div id="homeDeviceStatus" className={styles.statusChart}>
            <img src="/img/no data_icon.png" />
            <span className={styles.noneText}>暂无数据</span>
          </div>
          <div className={styles.statusTotal}>
            {statusInfo && statusInfo.length > 0 ? statusInfo.map((e, i)=> (
              <span className={styles.eachStatus} key={e.deviceStatus}>
                <span className={styles.round} style={{backgroundColor: this.colors[i]}}></span>
                <span className={styles.text}>{e.deviceStatusName}</span>
                <span className={styles.value}>{e.deviceStatusNum}</span>
              </span>
            )) : this.noDatasHolder.map(e => (
              <span className={styles.eachStatus} key={e.text}>
                <span className={styles.round} style={{backgroundColor: e.backgroundColor}}></span>
                <span className={styles.text}>{e.text}</span>
                <span className={styles.value}>{e.value}</span>
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  }
}

export default DeviceStatus;
