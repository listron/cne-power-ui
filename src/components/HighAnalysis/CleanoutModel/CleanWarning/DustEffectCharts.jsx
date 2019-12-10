import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import echarts from 'echarts';
import { Tabs, DatePicker } from 'antd';
import styles from './cleanStyle.scss';
import { dataFormat } from '../../../../utils/utilFunc';
import { chartsLoading, themeConfig, chartsNodata } from '../../../../utils/darkConfig';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const SingleChart = ({ keyWord, data = [], id, hasSlider, theme = 'light' }) => {
  // 灰尘影响charts图(全局 + 方阵特殊覆盖属性 )
  const chartBox = document.getElementById(id);
  const getColor = {
    light: ['#199475', '#f9b600', '#3e97d1'],
    dark: ['#00f8ff', '#fd6e8f', '#f8e71c'],
  };
  if (chartBox) {
    let chartInitBox = echarts.init(chartBox, themeConfig[theme]);
    if (chartInitBox) {
      chartInitBox.dispose();
      chartInitBox = echarts.init(chartBox, themeConfig[theme]);
    }
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
      graphic: chartsNodata(hasData, theme),
      color: getColor[theme],
      legend: {
        textStyle: {
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
      },
      yAxis: [
        {
          type: 'value',
          name: '发电量(万kWh)',
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        {
          type: 'value',
          name: '占比(%)',
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
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
    if (keyWord === 'matrix' && hasSlider) {
      const maxLength = data.length || 1;
      const defaultLength = 30;
      const endZoom = (defaultLength / maxLength) * 100;
      option.dataZoom = [
        {
          show: true,
          startValue: 0,
          endValue: hasSlider ? 19 : endZoom,
        },
        {
          type: 'inside',
          startValue: 0,
          endValue: hasSlider ? 19 : endZoom,
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
  theme: PropTypes.string,
  hasSlider: PropTypes.bool,
};

class DustEffectCharts extends Component {
  static propTypes = {
    dustEffectInfo: PropTypes.object,
    totalEffects: PropTypes.array,
    matrixEffects: PropTypes.array,
    getTotalDustEffect: PropTypes.func,
    getMatrixDustEffect: PropTypes.func,
    changeCleanWarningStore: PropTypes.func,
    theme: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      startDay: moment().subtract(1, 'days'),
      endDay: moment().subtract(1, 'days'),
    };
  }

  timeSelect = (timeMoment, timeString) => {
    const {
      dustEffectInfo,
      changeCleanWarningStore,
      getTotalDustEffect,
      getMatrixDustEffect,
    } = this.props;
    const effectParam = {
      stationCode: dustEffectInfo.stationCode,
      startDay: moment(timeString[0]).format('YYYY-MM-DD'),
      endDay: moment(timeString[1]).format('YYYY-MM-DD'),
    };
    changeCleanWarningStore({ startDay: effectParam.startDay, endDay: effectParam.endDay });
    getTotalDustEffect(effectParam);
    getMatrixDustEffect(effectParam);
  };

  render() {
    const { startDay, endDay } = this.state;
    const { totalEffects, matrixEffects, theme } = this.props;
    const disabledDate = (current) => { // 不可选未来日期
      return current && current > moment().subtract(1, 'days');
    };
    return (
      <div className={styles.effectCharts}>
        <span ref="wrap" />
        <RangePicker
          defaultValue={[startDay, endDay]}
          onChange={this.timeSelect}
          disabledDate={disabledDate}
          getCalendarContainer={() => this.refs.wrap}
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
                theme={theme}
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
                hasSlider={matrixEffects.length > 20}
                keyWord="matrix"
                id="cleanWarningMatrixEffect"
                theme={theme}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default DustEffectCharts;
