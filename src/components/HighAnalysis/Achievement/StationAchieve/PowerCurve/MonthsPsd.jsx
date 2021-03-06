import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Select } from 'antd';
import { getCurveBaseOption } from './curveBaseOption';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './curve.scss';
const { Option } = Select;

class MonthsPsd extends Component {

  static propTypes = {
    curveDeviceName: PropTypes.string,
    curveMonthPsd: PropTypes.array,
    curveMonthPsdLoading: PropTypes.bool,
  }

  state = {
    sortName: 'efficiencyDate', // psd;
  }

  componentDidMount(){
    const { curveMonthPsd = [] } = this.props;
    const { sortName } = this.state;
    curveMonthPsd.length > 0 && this.renderChart(curveMonthPsd, sortName);
  }

  componentWillReceiveProps(nextProps){
    const { curveMonthPsdLoading, curveMonthPsd } = nextProps;
    const { sortName } = this.state;
    const preLoading = this.props.curveMonthPsdLoading;
    if (preLoading && !curveMonthPsdLoading) { // 请求完毕
      this.renderChart(curveMonthPsd, sortName);
    } else if (!preLoading && curveMonthPsdLoading) { // 请求中
      this.setChartLoading();
    }
  }

  setChartLoading = () => {
    const psdChart = this.psdRef && echarts.getInstanceByDom(this.psdRef);
    psdChart && psdChart.showLoading();
  }

  sortDevicePsd = (data = [], sorter) => {
    return [...data].sort((a, b) => {
      if(sorter === 'efficiencyDate') {
        return a[sorter] && b[sorter] && a[sorter].localeCompare(b[sorter]);
      }
      return b[sorter] - a[sorter];
    });
  }

  sortChart = (sortName) => {
    const { curveMonthPsd = [] } = this.props;
    this.setState({ sortName });
    this.renderChart(curveMonthPsd, sortName);
  }

  createSeires = (sortedPsdData) => {
    const xData = [], psdData = [];
    sortedPsdData.forEach(e => {
      const { efficiencyDate, psd } = e || {};
      xData.push(efficiencyDate);
      psdData.push(dataFormats(psd) * 100);
    });
    const series = [{
      type: 'bar',
      barWidth: '10px',
      cursor: 'default',
      data: psdData,
      itemStyle: {
        color: new echarts.graphic.LinearGradient( 0, 0, 0, 1, [
          {offset: 0, color: '#00baff' },
          {offset: 1, color: '#5beda9' },
        ]),
      },
    }];
    return { series, xData };
  }

  renderChart = (curveDevicesPsd, sortName) => {
    const psdChart = echarts.init(this.psdRef);
    const sortedPsdData = this.sortDevicePsd(curveDevicesPsd, sortName);
    const { series, xData } = this.createSeires(sortedPsdData);
    const baseOption = getCurveBaseOption();
    baseOption.xAxis.data = xData;
    baseOption.yAxis.name = 'PSD(%)';
    baseOption.grid.top = 30;
    baseOption.grid.bottom = 40;
    baseOption.grid.left = 35;
    const option = {
      ...baseOption,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        padding: 0,
        formatter: (param) => {
          const { axisValue } = param && param[0] || {};
          return `<section class=${styles.tooltip}>
            <h3 class=${styles.title}>
              <span>${axisValue || ''}</span>
            </h3>
            <div class=${styles.info}>
              ${param.map((e, i) => (
                `<span class=${styles.eachItem}>
                  <span>PSD</span>
                  <span>${dataFormats(e.value, '--', 2, true)}</span>
                </span>`
              )).join('')}
            </div>
          </section>`;
        },
      },
      series,
    };
    const endPosition = 30 / curveDevicesPsd.length >= 1 ? 100 : 3000 / curveDevicesPsd.length;
    curveDevicesPsd.length > 0 && (option.dataZoom = [{
      type: 'slider',
      filterMode: 'empty',
      start: 0,
      end: endPosition,
      showDetail: false,
      height: 20,
      bottom: 10,
    }, {
      type: 'inside',
      filterMode: 'empty',
      start: 0,
      end: endPosition,
    }]);
    psdChart.hideLoading();
    psdChart.setOption(option);
  }

  render() {
    const { curveDeviceName } = this.props;
    const { sortName } = this.state;
    return (
      <section className={styles.aep}>
        <h3 className={styles.aepTop}>
          <span className={styles.aepText}>{curveDeviceName || '--'}各月功率曲线聚合度PSD</span>
          <span>
            <span className={styles.sorterText}>选择排序</span>
            <Select
              onChange={this.sortChart}
              style={{width: '200px'}}
              value={sortName}
            >
              <Option value="efficiencyDate">月份</Option>
              <Option value="psd">PSD</Option>
            </Select>
          </span>
        </h3>
        <div className={styles.modes}>
          <span className={styles.eachMode}>
            <span className={styles.rect} style={{
              backgroundImage: 'linear-gradient(-180deg, #36c6ad 0%, #199475 100%)',
            }} />
            <span className={styles.modeText}>PSD</span>
          </span>
        </div>
        <div className={styles.aepChart} ref={(ref)=> {this.psdRef = ref;}} />
      </section>
    );
  }
}

export default MonthsPsd;

