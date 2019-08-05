import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import echarts from 'echarts';
import { Tabs, DatePicker } from 'antd';
import styles from './cleanStyle.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const SingleChart = ({ keyWord, data = [], id }) => {
  // 灰尘影响charts图(全局 + 方阵特殊覆盖属性 )
  const chartBox = document.getElementById(id);
  if (chartBox) {
    const chartInitBox = echarts.init(chartBox);
    let xAxis = [],
      genArr = [],
      effctArr = [],
      effectRate = [],
      hasData = false;
    data.length > 0 &&
      data.forEach(e => {
        xAxis.push(keyWord === 'total' ? e.date : e.matrix);
        genArr.push(e.actualPower);
        effctArr.push(e.influencePower);
        effectRate.push(e.influencePercent);
        (e.actualPower || e.influencePower) && (hasData = true);
      });
    const option = {
      graphic: hasData ? hiddenNoData : showNoData,
      color: ['#199475', '#f9b600', '#3e97d1'],
      legend: {
        textStyle: {
          color: '#666',
          fontSize: 14,
        },
        itemWidth: 6,
        itemHeight: 6,
      },
      grid: {
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        extraCssText:
          'background-color: rgba(255, 255, 255); box-shadow:0 1px 4px 0 rgba(0,0,0,0.20); border-radius:2px;',
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
          return `<div class=${styles.chartTool}>
              <div class=${styles.title}>${chartInfo[0].name}</div>
              ${chartInfo
              .map(
                e => `<div class=${styles.content}>
                <span class=${e.itemStyle}></span>
                <span class=${styles.text}>${e.seriesName}</span>
                <span class=${styles.value}>${dataFormat(e.value)}${
                  e.seriesType === 'line' ? '%' : ''
                  }</span>
              </div>`
              )
              .join('')}
            </div>`;
        },
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
          name: '发电量(万kWh)',
          nameTextStyle: {
            color: '#666',
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
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
          data: effctArr,
        },
        {
          name: '灰尘影响占比',
          type: 'line',
          yAxisIndex: 1,
          data: effectRate,
        },
      ],
    };
    if (keyWord === 'matrix') {
      const maxLength = data.length || 1;
      const defaultLength = 30;
      const endZoom = (defaultLength / maxLength) * 100;
      option.dataZoom = [
        {
          show: true,
          start: 0,
          end: endZoom,
        },
        {
          type: 'inside',
          start: 0,
          end: endZoom,
        },
      ];
    }

    chartInitBox.setOption(option);
  }

  return <div className={styles.effectChart} id={id} />;
};

SingleChart.propTypes = {
  keyWord: PropTypes.string,
  data: PropTypes.array,
  id: PropTypes.string,
};

class DustEffectCharts extends Component {
  static propTypes = {
    dustEffectInfo: PropTypes.object,
    totalEffects: PropTypes.array,
    matrixEffects: PropTypes.array,
    getTotalDustEffect: PropTypes.func,
    getMatrixDustEffect: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      startDay: moment().subtract(30, 'day'),
      endDay: moment(),
    };
  }

  timeSelect = (timeMoment, timeString) => {
    const {
      dustEffectInfo,
      getTotalDustEffect,
      getMatrixDustEffect,
    } = this.props;
    const effectParam = {
      stationCode: dustEffectInfo.stationCode,
      startDay: moment(timeString[0]).format('YYYY-MM-DD'),
      endDay: moment(timeString[1]).format('YYYY-MM-DD'),
    };
    getTotalDustEffect(effectParam);
    getMatrixDustEffect(effectParam);
  };

  render() {
    const { startDay, endDay } = this.state;
    const { totalEffects, matrixEffects } = this.props;
    return (
      <div className={styles.effectCharts}>
        <RangePicker
          defaultValue={[startDay, endDay]}
          onChange={this.timeSelect}
          disabledDate={() => false}
        />
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={<span>全局灰尘影响(基于系统效率/清洗板)</span>}
            key="1"
            forceRender={true}
          >
            <div className={styles.eachChart}>
              <SingleChart
                data={totalEffects}
                keyWord="total"
                id="cleanWarningTotalEffect"
              />
            </div>
          </TabPane>
          <TabPane
            className={styles.eachChart}
            tab={<span>方阵灰尘影响(基于系统效率/清洗板)</span>}
            key="2"
            forceRender={true}
          >
            <div className={styles.eachChart}>
              <SingleChart
                data={matrixEffects}
                keyWord="matrix"
                id="cleanWarningMatrixEffect"
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default DustEffectCharts;
