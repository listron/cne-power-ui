import React, { Component } from 'react';
import StationTypeTag from './StationTypeTag';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { showNoData, hiddenNoData } from '../../../constants/echartsNoData';

class DeviceStatus extends Component{
  static propTypes = {
    hasMultipleType: PropTypes.bool
  }

  constructor(props){
    super(props);
    this.state = {
      statusType: 'all'
    }
  }

  componentWillReceiveProps(nextProps){
    const statusBox = document.getElementById('homeDeviceStatus');
    if(statusBox){
      const statusChart = echarts.init(statusBox);
      this.setStatusChart(statusChart);
    }
  }

  setStatusChart = (statusChart) => {
    const graphic = Math.random() > 0.5 ? hiddenNoData : showNoData;
    const statusPieData = [
      { value: 87, name: '正常', itemStyle:{ color: '#145998'} },
      { value: 4, name: '故障', itemStyle:{ color: '#3fa9ef'} },
      { value: 3, name: '停机', itemStyle:{ color: '#6868b2'} },
      { value: 1, name: '通讯中断', itemStyle:{ color: '#6ae3c1'} },
    ];
    const option = {
        graphic,
        title: {
          show: false,
        },
        legend: {
          show: false,
        },
        grid: {
          top: 30,
          bottom: 30,
        },
        series: [
          {
            name: '设备状态',
            type: 'pie',
            radius: ['50%', '70%'],
            data: statusPieData
          },
        ]
    }
    statusChart.setOption(option);
  } 

  changeStatusType = (statusType) => {
    this.setState({ statusType });
  }


  render(){
    const { statusType } = this.state;
    return (
      <section className={styles.deviceStatus}>
        <h3>设备状态</h3>
        <div className={styles.checkTags}>
          <StationTypeTag showTotal={false} activeType={statusType} onChange={this.changeStatusType} />
        </div>
        <div className={styles.statusBox}>
          <div id="homeDeviceStatus" className={styles.statusChart}></div>
          <div className={styles.statusTotal}>
            <span className={styles.eachStatus}>
              <span className={styles.normalRound}></span>
              <span className={styles.text}>正常</span>
              <span className={styles.value}>87</span>
            </span>
            <span className={styles.eachStatus}>
              <span className={styles.faultRound}></span>
              <span className={styles.text}>故障</span>
              <span className={styles.value}>4</span>
            </span>
            <span className={styles.eachStatus}>
              <span className={styles.stopRound}></span>
              <span className={styles.text}>停机</span>
              <span className={styles.value}>3</span>
            </span>
            <span className={styles.eachStatus}>
              <span className={styles.connectRound}></span>
              <span className={styles.text}>通讯中断</span>
              <span className={styles.value}>1</span>
            </span>
          </div>
        </div>
      </section>
    )
  }
}

export default DeviceStatus;
