import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import echarts from 'echarts';
import { Tabs, DatePicker } from 'antd';
// import styles from '../../CleanWarning/cleanStyle.scss';
import styles from './cleanoutRecordDetail.scss';
import { dataFormat } from '../../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const SingleChart = ({ keyWord, data = [], id }) => { // 灰尘影响charts图(全局 + 方阵特殊覆盖属性 )
  const chartBox = document.getElementById(id);
  if (chartBox) {
    const chartInitBox = echarts.init(chartBox);
    let xAxis = [], genArr = [], effctArr = [], effectRate = [], hasData = false;
    data.length > 0 && data.forEach(e => {
      xAxis.push(keyWord === 'total' ? e.date : e.matrix);
      genArr.push(e.actualPower);
      effctArr.push(e.influencePower);
      effectRate.push(e.influencePercent);
      (e.actualPower || e.influencePower) && (hasData = true);
    })
    const option = {
      graphic: hasData ? hiddenNoData : showNoData,
      color: ['#199475', '#f9b600', '#3e97d1'],
      legend: {
        textStyle: {
          color: '#666',
          fontSize: 14,
        },
        icon: 'rect',
        itemWidth: 5,
        itemHeight: 5,
      },
      tooltip: {
        trigger: 'axis',
        extraCssText: 'background-color: rgba(255, 255, 255); box-shadow:0 1px 4px 0 rgba(0,0,0,0.20); border-radius:2px;',
        padding: 0,
        formatter: params => {
          const chartInfo = params.map(e => {
            if (e.seriesName === '实际发电量') {
              e.itemStyle = styles.darkRect;
            } else if (e.seriesName === '灰尘影响电量') {
              e.itemStyle = styles.lightRect;
            } else {
              e.itemStyle = styles.round;
            }
            return e;
          });
          return (
            `<div class=${styles.chartTool}>
              <div class=${styles.title}>${chartInfo[0].name}</div>
              ${chartInfo.map(e => `<div class=${styles.content}>
                <span class=${e.itemStyle}></span>
                <span class=${styles.text}>${e.seriesName}</span>
                <span class=${styles.value}>${dataFormat(e.value)}${e.seriesType === 'line' ? '%' : ''}</span>
              </div>`).join('')}
            </div>`
          )
        }
      },
      xAxis: {
        type: 'category',
        data: xAxis,
        axisLine: {
          lineStyle: {
            color: '#dfdfdf',
          },
        },
        axisLabel: {
          color: '#666',
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '发电量(kWh)',
          nameTextStyle: {
            color: '#666',
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#666',
          },
        },
        {
          type: 'value',
          name: '占比(%)',
          nameTextStyle: {
            color: '#666',
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisLabel: {
            color: '#666',
          },
        },
      ],
      series: [
        {
          name: '实际发电量',
          type: 'bar',
          stack: '发电量',
          barWidth: 6,
          data: genArr,
        },
        {
          name: '灰尘影响电量',
          type: 'bar',
          stack: '发电量',
          barWidth: 6,
          data: effctArr
        }, {
          name: '灰尘影响占比',
          type: 'line',
          yAxisIndex: 1,
          data: effectRate
        }
      ]
    }
    chartInitBox.setOption(option);
  }

  return (
    <div className={styles.effectChart} id={id} />
  )
}

SingleChart.propTypes = {
  keyWord: PropTypes.string,
  data: PropTypes.array,
  id: PropTypes.string,
}

class DustEffectCharts extends Component {

  static propTypes = {
    dustEffectInfo: PropTypes.object,
    totalEffects: PropTypes.array,
    matrixEffects: PropTypes.array,
    getStationDust: PropTypes.func,
    getMatrixDust: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      startTime: moment().subtract(30, 'day'),
      endTime: moment(),
    }
  }

  timeSelect = (timeMoment, timeString) => {
    const { singleStationCode, getMatrixDust, getStationDust } = this.props;
    const effectParam = {
      stationCode: singleStationCode,
      startTime: timeString[0],
      endTime: timeString[1],
    }
    getMatrixDust(effectParam)
    getStationDust(effectParam)
  }

  render() {
    const { startTime, endTime } = this.state;
    const { totalEffects, matrixEffects } = this.props;
    return (
      <div className={styles.effectCharts}>
        <RangePicker
          // disabled
          defaultValue={[startTime, endTime]}
          onChange={this.timeSelect}
          disabledDate={() => false}
        />
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span>全局灰尘影响(基于系统效率/清洗板)</span>} key="1" forceRender={true}>
            <div className={styles.eachChart}>
              <SingleChart data={totalEffects} keyWord="total" id="cleanWarningTotalEffect" />
            </div>
          </TabPane>
          <TabPane className={styles.eachChart} tab={<span>方阵灰尘影响(基于系统效率/清洗板)</span>} key="2" forceRender={true}>
            <div className={styles.eachChart}>
              <SingleChart data={matrixEffects} keyWord="matrix" id="cleanWarningMatrixEffect" />
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }

}

export default DustEffectCharts;