import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import echarts from 'echarts';
import { Tabs, DatePicker } from 'antd';
// import styles from '../../CleanWarning/cleanStyle.scss';
import styles from './cleanoutRecordDetail.scss';
import { dataFormat } from '../../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../../constants/echartsNoData';
import { chartsLoading, themeConfig, chartsNodata } from '../../../../../utils/darkConfig';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const SingleChart = ({ keyWord, data = [], id, hasSlider, theme }) => { // 灰尘影响charts图(全局 + 方阵特殊覆盖属性 )
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
    let xAxis = [], genArr = [], effctArr = [], effectRate = [], hasData = false;
    data.length > 0 && data.forEach(e => {
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
        icon: 'rect',
        itemWidth: 5,
        itemHeight: 5,
      },
      tooltip: {
        trigger: 'axis',
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
          );
        },
      },
      xAxis: {
        type: 'category',
        data: xAxis,
      },
      yAxis: [
        {
          type: 'value',
          name: '发电量(kWh)',
          splitLine: {
            show: false,
          },
          axisLine: {
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
        }, {
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

  return (
    <div className={styles.effectChart} id={id} />
  );
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
    getStationDust: PropTypes.func,
    getMatrixDust: PropTypes.func,
    changeCleanoutRecordStore: PropTypes.func,
    singleStationCode: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      matrixStartTime: moment().subtract(1, 'days'),
      matrixEndTime: moment().subtract(1, 'days'),
      totalStartTime: moment().subtract(1, 'months').add(-1, 'days'),
      totalEndTime: moment().subtract(1, 'days'),
      key: '1',
    };
  }

  timeSelect = (timeMoment, timeString) => {
    const { key } = this.state;
    const { singleStationCode, getMatrixDust, getStationDust } = this.props;
    const totalEffectParam = {
      stationCode: singleStationCode,
      endTime: timeString[1],
      startTime: timeString[0],
    };
    const matrixEffectParam = {
      stationCode: singleStationCode,
      endTime: timeString[1],
      startTime: timeString[0],
    };
    if (key === '1') {
      this.setState({
        totalStartTime: moment(timeString[0]),
        totalEndTime: moment(timeString[1]),
      });
      getMatrixDust(matrixEffectParam);
    }else{
      this.setState({
        matrixStartTime: moment(timeString[0]),
        matrixEndTime: moment(timeString[1]),
      });
      getStationDust(totalEffectParam);
    }
  }

  changeTab = (key) => { // 切换全局和方阵图时，改变所传时间（全局是前一个月，方阵是前一天）
    const { totalStartTime, totalEndTime, matrixStartTime, matrixEndTime } = this.state;
    const { singleStationCode, getStationDust, getMatrixDust } = this.props;

    if (key === '1') {
      const effectParam = {
        stationCode: singleStationCode,
        startTime: totalStartTime.format('YYYY-MM-DD'),
        endTime: totalEndTime.format('YYYY-MM-DD'),
      };
      this.setState({
        key: '1',
      });
      getStationDust(effectParam);
    }else{
      const effectParam = {
        stationCode: singleStationCode,
        startTime: matrixStartTime.format('YYYY-MM-DD'),
        endTime: matrixEndTime.format('YYYY-MM-DD'),
      };
      this.setState({
        key: '2',
      });
      getMatrixDust(effectParam);
    }
  }

  render() {
    const { matrixStartTime, matrixEndTime, totalStartTime, totalEndTime, key } = this.state;
    const { totalEffects, matrixEffects, theme } = this.props;
    return (
      <div className={styles.effectCharts}>
        <span ref="wrap" />
        <RangePicker
          value={key === '1' ? [totalStartTime, totalEndTime] : [matrixStartTime, matrixEndTime]}
          onChange={this.timeSelect}
          disabledDate={() => false}
          getCalendarContainer={() => this.refs.wrap}
        />
        <Tabs defaultActiveKey="1" onChange={this.changeTab}>
          <TabPane
          tab={<span>全局灰尘影响(基于系统效率/清洗板)</span>}
          key="1"
          forceRender={true}>
            <div className={styles.eachChart}>
              <SingleChart data={totalEffects} keyWord="total" id="cleanWarningTotalEffect" theme={theme} />
            </div>
          </TabPane>
          <TabPane
          className={styles.eachChart}
          tab={<span>方阵灰尘影响(基于系统效率/清洗板)</span>}
          key="2"
          forceRender={true}>
            <div className={styles.eachChart}>
              <SingleChart data={matrixEffects} keyWord="matrix" id="cleanWarningMatrixEffect" hasSlider={matrixEffects.length > 20} theme={theme} />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }

}

export default DustEffectCharts;
