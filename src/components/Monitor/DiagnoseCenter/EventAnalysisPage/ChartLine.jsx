import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import moment from 'moment';
import { dataFormats } from '@utils/utilFunc';
import styles from './eventAnalysis.scss';

class ChartLine extends PureComponent {

  static propTypes = {
    pageKey: PropTypes.string,
    eventAnalysisInfo: PropTypes.object,
    analysisEvent: PropTypes.object,
    filterLoading: PropTypes.bool,
  };

  componentDidMount(){
    const { eventAnalysisInfo, analysisEvent } = this.props;
    const { period = [], data = {}, dataDays } = eventAnalysisInfo || {};
    const { interval, eventCode, pointCode } = analysisEvent;
    this.drawChart(period, data, interval, eventCode, dataDays, pointCode);
  }

  componentWillReceiveProps(nextProps){
    const preAnalysiInfo = this.props.eventAnalysisInfo;
    const preLoading = this.props.filterLoading;
    const { eventAnalysisInfo, analysisEvent, filterLoading } = nextProps;
    const lineChart = echarts.init(this.lineRef);
    if (filterLoading && !preLoading) {
      lineChart.showLoading('default', { text: '', color: '#199475' });
    }
    if (eventAnalysisInfo !== preAnalysiInfo) {
      const { period = [], data = {}, dataDays } = eventAnalysisInfo || {};
      const { interval, eventCode, pointCode } = analysisEvent;
      this.drawChart(period, data, interval, eventCode, dataDays, pointCode);
    }
  }

  lineColors = ['#ff9900', '#4d90fd', '#60c060', '#ff8d83', '#00cdff', '#9f98ff', '#d5c503', '#2ad7ab', '#b550b2', '#3e97d1', '#83bcc4', '#cc6500', '#5578c2', '#86acea', '#d3b08e', '#7286f1', '#512ca8', '#33cc27', '#bfbf95', '#986cff'];

  timeFormat = (timeStr, interval = 1) => { // 针对markArea时间进行处理
    if (!timeStr) {
      return '';
    }
    const timeMoment = moment(timeStr);
    if(interval === 1){ // 10min数据处理为YYYY-MM-DD HH:mm0:00的十分钟格式;
      const dayTimeStr = timeMoment.format('YYYY-MM-DD HH:');
      const minuteNum = Math.floor(timeMoment.minute() / 10);
      return `${dayTimeStr}${minuteNum}0:00`;
    } else if (interval === 3) { // 1min数据处理为YYYY-MM-DD HH:mm:00的整分钟格式;
      const dayTimeStr = timeMoment.format('YYYY-MM-DD HH:mm');
      return `${dayTimeStr}:00`;
    }
    // 5s按照正常格式返回 interval = 2
    const timeMinuteStr = timeMoment.format('YYYY-MM-DD HH:mm');
    const secondNum = Math.floor(timeMoment.second() / 5) * 5;
    const secondNumStr = secondNum > 5 ? `:${secondNum}` : `:0${secondNum}`;
    return `${timeMinuteStr}${secondNumStr}`;
  }

  drawChart = (period = [], data = {}, interval, eventCode, dataDays, pointCode) => {
    const { pageKey } = this.props;
    echarts.dispose(this.lineRef); // 重绘图形前需销毁实例。否则重绘失败。
    const lineChart = echarts.init(this.lineRef);
    const { time = [], pointData = [] } = data;
    lineChart.hideLoading();
    const noAlarmTime = ['NB1038', 'NB1040'].includes(eventCode); // 诊断事件电压异常、并网延时中不展示告警时段，页面相应背景图移除
    const noDeviceName = ['NB1035', 'NB1037'].includes(eventCode); // 诊断事件零电流、固定物遮挡的legend要一行8列展示,以及不展示设备名称
    const seriesInefficient = ['NB1036'].includes(eventCode); // 组串低效不展示告警、设备名称，且展示8行
    const fixedShelter = ['NB1037'].includes(eventCode); // 固定遮挡物
    const dataAnomaly = ['NB2035', 'NB2036'].includes(eventCode); // 数据事件的高值异常、低值异常展示标准线

    const pulseSignalInfo = pointData.find(e => { // 找到脉冲信号的数据
      return e.pointCode === pointCode;
    });
    const delPointIndex = pointData.findIndex(e => { // 找到脉冲信号在原测点数组里的位置
      return e.pointCode === pointCode;
    });
    if (delPointIndex >= 0 && pageKey === 'alarm') { // 如果存在脉冲信号，将脉冲信号抽出
      pointData.splice(delPointIndex, 1);
    }

    const legends = [{
      name: '告警时段',
      icon: 'rect',
      height: 30,
      left: `${(noDeviceName || seriesInefficient) ? 2 : 7}%`,
      top: 0,
      itemWidth: 14,
      selectedMode: false,
      data: ['告警时段'],
      textStyle: {
        color: '#353535',
      },
    }];

    if (noAlarmTime || seriesInefficient) { // 不展示告警时段
      legends.shift();
    }
    const colors = ['rgba(251,230,227,0.50)']; // 图标依次着色
    if (noAlarmTime || seriesInefficient) { // 不展示告警时段
      colors.shift();
    }

    const unitGroupSets = new Set();
    let unitsGroup = []; // 解出单位数组
    const unitSortTemplate = ['W/m2', 'kW', 'V', 'A'];
    const markAreaData = period.map(e => { // 告警事件段数据规范。
      const { beginTime, endTime } = e || {};
      return [{
        xAxis: this.timeFormat(beginTime, interval),
      }, {
        xAxis: this.timeFormat(endTime, interval),
      }];
    });
    const series = [{ // 初始化series;
      name: '告警时段',
      type: 'line',
      data: [],
      markArea: {
        silent: true,
        itemStyle: {
          borderColor: '#fbe6e3',
          borderWidth: 1,
        },
        data: markAreaData,
      },
      xAxisIndex: 0,
      yAxisIndex: 0,
    }];
    if (noAlarmTime || seriesInefficient) { // 不展示告警时段
      series.shift();
    }
    const sortedPointData = pointData.sort((a, b) => { // 单位排序：w/m2 >kw>V>A；其余默认
      const aUnit = a.pointUnit || '';
      const bUnit = b.pointUnit || '';
      unitGroupSets.add(aUnit);
      unitGroupSets.add(bUnit);
      unitsGroup = [...unitGroupSets]; // 解出单位数组
      if(unitSortTemplate.indexOf(aUnit) < 0) {
        return 1;
      }
      if (unitSortTemplate.indexOf(bUnit) < 0) {
        return -1;
      }
      return unitSortTemplate.indexOf(aUnit) - unitSortTemplate.indexOf(bUnit);
    });
    if (pointData.length < 2) { // length < 2不会执行排序函数~
      unitsGroup = sortedPointData.map(e => e.pointUnit);
    }
    sortedPointData.forEach((e, i) => {
      const pointName = `${(!noDeviceName && !seriesInefficient) ? e.deviceName : ''} ${e.pointName || ''}`; // 诊断事件的零电流、组串低效、固定物遮挡不展示设备名称
      const pointFullName = `${pointName}${e.pointUnit ? `(${e.pointUnit})`: ''}`;
      colors.push(this.lineColors[i % this.lineColors.length]);
      if(e.isConnected === 0 && (noDeviceName || seriesInefficient)){ // 诊断事件零电流、组串低效、固定物遮挡未接组串为灰色
        colors.splice((i + 1), 1, '#999');
      }
      if (noAlarmTime || seriesInefficient) { // 诊断事件组串低效、电压异常、并网延时、固定物遮挡事件的曲线与图例颜色，默认绿色
        colors.splice(i, 1, '#60c060');
      }else if(fixedShelter){
        colors.splice(i + 1, 1, '#60c060');
      }
      if (e.isWarned && pageKey === 'diagnose' && (noAlarmTime || seriesInefficient)) { // 诊断事件组串低效、电压异常、并网延时、固定物遮挡事件的告警曲线与图例颜色为黄色
        colors.splice(i, 1, '#f9b600');
      }else if(e.isWarned && pageKey === 'diagnose' && fixedShelter){
        colors.splice(i + 1, 1, '#f9b600');
      }

      legends.push({
        icon: (e.isConnected === 0 && (noDeviceName || seriesInefficient)) ? 'image:///img/wjr01.png' : '',
        name: pointFullName,
        height: 30,
        itemWidth: 20,
        itemHeight: 10,
        left: `${noAlarmTime ? (7 + i % 4 * 21.5) : (noDeviceName ? (2 + (i + 1) % 8 * 12) : (seriesInefficient ? (2 + i % 8 * 12) : (7 + (i + 1) % 4 * 21.5)))}%`, // 诊断事件的组串低效、电压异常、并网延时中不展示告警时段,所以去除告警时段的位置;  诊断事件零电流、组串低效、固定物遮挡的要一行8列展示
        top: `${noAlarmTime ? (Math.floor(i / 4) * 30) : (noDeviceName ? (Math.floor((i + 1) / 8) * 30) : (seriesInefficient ? (Math.floor(i / 8) * 30) : (Math.floor((i + 1) / 4) * 30)))}`,
        data: [pointFullName],
        textStyle: {
          color: e.isWarned && pageKey === 'diagnose' ? ((noAlarmTime || seriesInefficient || fixedShelter) ? '#f9b600' : '#f5222d') : '#353535', // 诊断事件组串低效、电压异常、并网延时、固定物遮挡事件的异常曲线与图例颜色，默认黄色
        },
        selectedMode: e.isConnected === 0 ? false : true,
      });
      series.push({
        name: pointFullName,
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: unitsGroup.indexOf(e.pointUnit || ''), // 空单位统一以''作为单位
        lineStyle: {
          width: (e.isConnected === 0 && (noDeviceName || seriesInefficient)) ? 0 : 1, // 诊断事件的零电流、组串低效、固定物遮挡未接组串不显示折线
        },
        data: e.value,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        smooth: true,
      });
    });

    const legendHeight = (noDeviceName || seriesInefficient) ? (Math.ceil(legends.length / 8) * 30) : ((delPointIndex !== -1 && pageKey === 'alarm') ? Math.ceil((legends.length + 1) / 4) * 30 : Math.ceil(legends.length / 4) * 30);
    const eachyAxis = { // 生成多y纵坐标, 相同单位对应一个y轴
      // name: '其他测点',
      gridIndex: 0,
      type: 'value',
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    };
    const yAxis = unitsGroup.length > 0 ? unitsGroup.map((e, i) => ({
      ...eachyAxis,
    })) : eachyAxis; // 若返回异常数据导致无单位，使用默认单纵坐标即可
    yAxis[0].splitLine = { // 选一个y轴添加网格线
      lineStyle: {
        type: 'dashed',
      },
    };

    const xAxis = [{
      show: (delPointIndex !== -1 && pageKey === 'alarm') ? false : true,
      gridIndex: 0,
      type: 'category',
      data: time.map(e => moment(e).format('YYYY-MM-DD HH:mm:ss')),
      axisLine: {
        show: false,
      },
      axisLabel: {
        fontSize: 14,
        color: '#353535',
        lineHeight: 21,
        formatter: (value = '') => value.split(' ').join('\n'),
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    }];
    const clientWidth = document.body.clientWidth;
    const grid = [{
      show: true,
      borderColor: '#d4d4d4',
      bottom: (delPointIndex !== -1 && pageKey === 'alarm') ? '37%' : '',
      top: legendHeight,
      left: '7%',
      right: '7%',
      height: (delPointIndex !== -1 && pageKey === 'alarm') ? (clientWidth === 1440 ? 198 : 259) : (clientWidth === 1440 ? 220 : 280),
    }];
    if (delPointIndex !== -1 && pageKey === 'alarm') { // 是告警事件且存在脉冲信号时新增坐标系
      pointData.push(pulseSignalInfo);
      colors.push('#f8e71c');
      legends.push({
        name: '脉冲信号',
        height: 30,
        itemWidth: 20,
        itemHeight: 10,
        left: `${7 + legends.length % 4 * 21.5}%`,
        top: `${Math.floor(legends.length / 4) * 30}`,
        selectedMode: true,
        data: ['脉冲信号'],
        textStyle: {
          color: '#353535',
        },
      });
      yAxis.push({
        gridIndex: 1,
        // name: '脉冲信号',
        type: 'value',
        min: -2,
        max: 2,
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      });
      xAxis.push({
        gridIndex: 1,
        type: 'category',
        data: time.map(e => moment(e).format('YYYY-MM-DD HH:mm:ss')),
        axisLine: {
          show: false,
        },
        axisLabel: {
          fontSize: 14,
          color: '#353535',
          lineHeight: 21,
          formatter: (value = '') => value.split(' ').join('\n'),
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      });
      grid.push({
        show: true,
        borderColor: '#d4d4d4',
        bottom: 100,
        top: '63%',
        left: '7%',
        right: '7%',
        height: 57,
        backgroundColor: 'rgba(252,255,229,0.60)',
      });

      series.push({ // 新增脉冲信号数据
        name: '脉冲信号',
        step: true,
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: unitsGroup.length,
        lineStyle: {
          width: 1,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 2,
          shadowOffsetX: 0,
          shadowOffsetY: 2,
        },
        data: pulseSignalInfo.value,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        smooth: true,
      });
    }

    if (dataAnomaly) { // 是数据事件的高值异常、低值异常的标准值，要追加到原测点组后面
      colors.push('#ffeb00');
      const lastLegend = legends[legends.length - 1];
      const pointInfo = pointData.filter(e => {
        return e.standard || e.standard === 0;
      });
      const standard = pointInfo.length > 0 ? pointInfo[0].standard : ''; // 标准值
      const standardData = (standard || standard === 0) ? `标准值(${pointInfo[0].pointUnit})` : '';
      legends.push({
        name: standardData,
        show: (standard || standard === 0)? true : false,
        height: 30,
        left: `${parseFloat(lastLegend.left.replace('%', '')) + 21.5}%`,
        top: `${Math.floor(legends.length / 4) * 30}%`,
        selectedMode: false,
        data: [standardData],
        textStyle: {
          color: '#353535',
        },
      });
      series.push({ // 新增标准线数据
        name: standardData,
        type: 'line',
        symbol: 'circle',
        data: [],
        xAxisIndex: 0,
        yAxisIndex: 1,
        markLine: {
          silent: true,
          symbol: 'none',
          label: {
            show: false,
          },
          data: [
            {
              yAxis: standard,
              name: 'Y轴水平线',
              lineStyle: {
                type: 'solid',
                width: (dataAnomaly && standard) ? 1 : 0,
                color: '#ffeb00',
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 2,
                shadowOffsetX: 0,
                shadowOffsetY: 2,
              },
            },
          ],
      },
      });
    }

    const option = {
      legend: legends,
      color: colors,
      grid,
      tooltip: {
        trigger: 'axis',
        show: true,
        position: (point, params, dom, rect, size) => {
          const { viewSize, contentSize } = size || {};
          const [viewWidth] = viewSize || [];
          const [tipWidth] = contentSize || [];
          const [pointLeft] = point || [];
          let leftPosition = pointLeft; // 默认随鼠标
          if (viewWidth - pointLeft - 10 <= tipWidth) { // 右侧空间不足以展示浮层
            leftPosition = pointLeft - tipWidth - 5;
          }
          const topPosition = legendHeight + 5; //悬浮框位于图形顶部, 防止溢出。
          return [leftPosition, topPosition];
        },
        extraCssText: 'padding: 5px 10px; background-color: rgba(0,0,0,0.70); box-shadow:0 1px 4px 2px rgba(0,0,0,0.20); border-radius:2px;',
        formatter: (params = []) => {
          const { name } = params[0] || {};
          const periodData = period.filter(e => {
            return moment(name).isBetween(e.beginTime, e.endTime);
          });

          const pointInfo = pointData.filter(e => {
            return e.standard || e.standard === 0;
          });
          const standard = pointInfo.length > 0 ? pointInfo[0].standard : ''; // 标准值
          return (
            `<section class=${styles.chartTooltip}>
              <h3 class=${styles.tooltipTitle}>${name}</h3>
              ${params.map(e => {
                const { color, seriesIndex, value, seriesName } = e || {};
                const eachFullData = sortedPointData[(noAlarmTime || seriesInefficient) ? seriesIndex: seriesIndex - 1] || {}; // 诊断事件组串低效、电压异常、并网延时中不展示告警时段,所以去除告警时段的位置
                // 解析全数据使用， 因为系列中有个首条空线， series需减一对应。
                const { isWarned, pointName, deviceName, isConnected } = eachFullData;
                const lineFullName = `${deviceName} ${pointName || ''}`;
                return (
                  `<p class=${(isWarned && pageKey === 'diagnose') ? ((noAlarmTime || seriesInefficient || fixedShelter) ? styles.specialWarnedItem : styles.warnedItem) : (isConnected === 0 && (noDeviceName || seriesInefficient) ? styles.connected : styles.eachItem)}>
                    <span class=${styles.tipIcon}>
                      <span class=${styles.line} style="background-color:${color}"></span>
                      <span class=${styles.rect} style="background-color:${color}"></span>
                    </span>
                    <span class=${styles.tipName}>${(delPointIndex >= 0 && pageKey === 'alarm') ? seriesName : lineFullName}</span>
                    <span class=${styles.tipValue}>${isConnected === 0 ? '--' : dataFormats(value, '--', 2, true)}</span>
                  </p>`
                );
              }).join('')}
              <p class=${(dataAnomaly && (standard || standard === 0)) ? styles.eachItem : styles.noWarnItem}>
                <span class=${styles.tipIcon}>
                  <span class=${styles.line} style="background-color: #ffeb00"></span>
                  <span class=${styles.rect} style="background-color: #ffeb00"></span>
                </span>
                <span class=${styles.tipName}>标准值</span>
                <span class=${styles.tipValue}>${dataFormats(standard, '--', 2, true)}</span>
              </p>
              <p class=${(periodData.length > 0 && !noAlarmTime && !seriesInefficient && (dataAnomaly || fixedShelter || pageKey === 'alarm')) ? styles.eachItem : styles.noWarnItem}>
                <span class=${styles.warningIcon}></span>
                <span class=${styles.tipName}>告警时长</span>
                <span class=${styles.tipValue}>${periodData.length > 0 ? dataFormats(periodData[0].warningDuration, '--', 2, true) : '--'}h</span>
              </p>
            </section>`
          );
        },
      },
      axisPointer: {
        link: {xAxisIndex: 'all'},
        type: 'line',
        lineStyle: {
          color: '#000',
        },
      },
      xAxis,
      yAxis,
      series, // 若返回异常空数据, 则需要置空
    };
    if (pointData.length > 0) {
      option.dataZoom = [
        {
          show: true,
          height: 20,
          bottom: (delPointIndex !== -1 && pageKey === 'alarm') ? 10 : 16,
          xAxisIndex: (delPointIndex !== -1 && pageKey === 'alarm') ? [0, 1] : [0],
        }, {
          type: 'inside',
          xAxisIndex: (delPointIndex !== -1 && pageKey === 'alarm') ? [0, 1] : [0],
        },
      ];
    }
    lineChart.clear();
    lineChart.setOption(option);
  }

  render(){
    const { eventAnalysisInfo, analysisEvent, pageKey } = this.props;
    const { data = {} } = eventAnalysisInfo || {};
    const { pointData } = data;
    const { eventCode } = analysisEvent;
    const noDeviceName = ['NB1035', 'NB1037', 'NB1036'].includes(eventCode); // 一行8个
    const clientWidth = document.body.clientWidth;
    const calcHeight = (pageKey === 'alarm' ? (clientWidth === 1440 ? 335 : 428) : (clientWidth === 1440 ? 335 : 372)) + (noDeviceName ? Math.ceil(pointData.length / 8) * 30 : Math.ceil(pointData.length / 4) * 30);

    return (
      <div className={styles.analysisChart}>
        {/* <div className={styles.legends}>
          <span className={styles.period}>告警时段</span>
          {legend.map((e, i) => (
            <span key={e} className={styles.eachLegend}>
              <span className={styles.legendIcon}>
                <span style={{ backgroundColor: this.lineColors[i % this.lineColors.length]}} className={styles.legendLine} />
                <span style={{ backgroundColor: this.lineColors[i % this.lineColors.length]}} className={styles.legendRound} />
              </span>
              <span className={styles.legendName}>{e}</span>
            </span>
          ))}
        </div> */}
        <div style={{width: '100%', height: `${calcHeight}px`}} ref={(ref) => { this.lineRef = ref; } } />
      </div>
    );
  }
}

export default ChartLine;



