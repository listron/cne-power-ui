import React from "react";
import PropTypes from "prop-types";
import eCharts from "echarts";

import styles from "./dataZoom.scss";

/**
 * 说明：该组件只显示一个dataZoom，不显示x轴，y轴，
 * 目的：是为了解决非线性时间展示和图表数据对不上问题
 * echarts DataZoom 滑块组件：
 * 父组件可传入子组件参数:
 *
 * 1. 必填-xAxisData: 时间格式的数组例如：["2019-10-10", ...]
 * 2. 必填-onChange: 方法，把组件内部获取的开始位置，和结束位置，传出去。
 * 3. 必填-paramsStart 开始位置
 * 4. 必填-paramsEnd 结束位置
 * 5. 选填-styleData: 样式，对象类型
 * */

export default class DataZoom extends React.Component {
  static propTypes = {
    xAxisData: PropTypes.array,
    styleData: PropTypes.object,
    onChange: PropTypes.func,
    paramsStart: PropTypes.number,
    paramsEnd: PropTypes.number,
  };

  componentDidUpdate(prevProps) {
    const {
      xAxisData,
      onChange,
      paramsStart,
      paramsEnd
    } = this.props;
    const {
      xAxisData: xAxisDataPrev,
      paramsStart: paramsStartPrev,
      paramsEnd: paramsEndPrev
    } = prevProps;
    const { dataZoom } = this;
    const myChart = eCharts.init(dataZoom);
    // dataZoom开始位置比较
    const start = paramsStart !== paramsStartPrev;
    // dataZoom结束位置比较
    const end = paramsEnd !== paramsEndPrev;
    // 时间轴的开始时间对比
    const xAxisStart = xAxisData[0] !== xAxisDataPrev[0];
    // 时间轴的结束时间对比
    const xAxisEnd = xAxisData[xAxisData.length-1] !== xAxisDataPrev[xAxisDataPrev.length-1];
    // 判断数据是否反生改变
    if (start || end || xAxisStart || xAxisEnd) {
      eCharts.init(dataZoom).clear();//清除
      myChart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisData,
          show: false,
        },
        yAxis: {
          show: false,
        },
        dataZoom: [{
          start: paramsStart,
          end: paramsEnd,
          moveOnMouseMove: false,
          realtime: false, // 控制拖动连续触发
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }],
        series: []
      });
      myChart.off('datazoom'); // 记录bug找了2小时，关闭上一次，否则会拿不到paramsStart和paramsEnd。
      myChart.on('datazoom', (params) => {
        const opt = myChart.getOption();
        const dz = opt.dataZoom[0];
        // 开始时间
        const start = opt.xAxis[0].data[dz.startValue];
        // 结束时间
        const end = opt.xAxis[0].data[dz.endValue];
        // 判断位置是否反生改变
        if (paramsStart !== params.start || paramsEnd !== params.end) {
          // 把参数传出去
          onChange(start, end, params.start, params.end);
        }
      })
    }
  }

  render() {
    const { styleData } = this.props;
    return (
      <div style={{...styleData}} className={styles.dataZoomCharts} ref={(ref) => {this.dataZoom = ref;}} />
    );
  }
}
