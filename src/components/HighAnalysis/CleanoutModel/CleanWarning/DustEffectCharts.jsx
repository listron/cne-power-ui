import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import echarts from 'echarts';
import { Tabs, DatePicker  } from 'antd';
import styles from './cleanStyle.scss';
import { dataFormat } from '../../../../utils/utilFunc';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const SingleChart = ({keyWord, data = [], id}) => { // 灰尘影响charts图(全局 + 方阵特殊覆盖属性 )
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
      color: ['#199475', '#f9b600', '#3e97d1'],
      tooltip:{
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: params => `<div>
          <div>${params[0].name}</div>
          ${params.map(e => `<div>
            <span>${e.seriesType}</span>
            <span>${e.seriesName}</span>
            <span>${e.value}</span>
          </div>`)}
        </div>`
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
    totalEffects: PropTypes.array,
    matrixEffects: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      startDay: moment().subtract(30, 'day'),
      endDay: moment(),
    }
  }
  rangeChange = (a,b,c,d,e,f,g) => {
    console.log('rangeChange')
    console.log(a,b,c,d,e,f,g)
  }

  timeSelect = (a,b,c,d,e,f) => {
    console.log(a,b,c,d,e,f);
  }

  render() {
    const { startDay, endDay } = this.state;
    const { totalEffects, matrixEffects } = this.props;
    return (
      <div className={styles.effectCharts}>
        <RangePicker
          defaultValue={[ startDay, endDay ]}
          onChange={this.timeSelect}
          disabledDate={()=>false}
          onCalendarChange={this.rangeChange}
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