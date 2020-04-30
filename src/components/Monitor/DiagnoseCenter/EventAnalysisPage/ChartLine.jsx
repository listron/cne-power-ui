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
    isChartLoading: PropTypes.bool,
  };

  componentDidMount(){
    const { eventAnalysisInfo, analysisEvent } = this.props;
    const { period = [], data = {}, dataDays, branchPeriod = [] } = eventAnalysisInfo || {};
    const { interval, eventCode, pointCode } = analysisEvent;
    this.drawChart(period, data, interval, eventCode, dataDays, pointCode, branchPeriod);
    window.addEventListener('resize', this.onChartResize);
  }

  componentWillReceiveProps(nextProps){
    const preAnalysiInfo = this.props.eventAnalysisInfo;
    const preLoading = this.props.isChartLoading;
    const { eventAnalysisInfo, analysisEvent, isChartLoading } = nextProps;
    const lineChart = echarts.init(this.lineRef);
    if (isChartLoading && !preLoading) {
      lineChart.showLoading('default', { text: '', color: '#199475' });
    }
    if (eventAnalysisInfo !== preAnalysiInfo) {
      const { period = [], data = {}, dataDays, branchPeriod = [] } = eventAnalysisInfo || {};
      const { interval, eventCode, pointCode } = analysisEvent;
      this.drawChart(period, data, interval, eventCode, dataDays, pointCode, branchPeriod);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onChartResize);
  }

  lineColors = ['#4d90fd', '#60c060', '#ff8d83', '#00cdff', '#9f98ff', '#d5c503', '#2ad7ab', '#b550b2', '#3e97d1', '#83bcc4', '#cc6500', '#5578c2', '#86acea', '#d3b08e', '#7286f1', '#512ca8', '#33cc27', '#bfbf95', '#986cff'];

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

  pointDataSorter = (pointData = []) => { // 基于单位对对象数组排序;
    const unitSortTemplate = ['W/m2', 'kW', 'V', 'A'];
    let unitsGroup = [];
    const unitGroupSets = new Set();
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
    return { unitsGroup, sortedPointData };
  }

  getTooltipPosition = legendHeight => (point, params, dom, rect, size) => {
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
  }

  onChartResize = () => {
    const lineChart = echarts.getInstanceByDom(this.lineRef);
    if (lineChart && lineChart.resize) {
      const clientWidth = document.body.clientWidth;
      const clientHeight = document.body.clientHeight;
      lineChart.resize({
        height: clientWidth >= 1680 ? (clientHeight - 461) : (clientHeight - 381),
      });
    }
  }

  drawChart = (period = [], data = {}, interval, eventCode, dataDays, pointCode, branchPeriod) => {
    const { pageKey } = this.props;
    const lineChart = echarts.init(this.lineRef);
    const { time = [], pointData = [] } = data;
    lineChart.hideLoading();

    const isDiagnoseBranch = ['NB1235', 'NB1236', 'NB1237', 'NB1238', 'NB1239', 'NB1036'].includes(eventCode);
    // 诊断事件-奇偶组串、遮挡组串, 零值组串, 低效组串, 降压组串: 不展示告警时段, 8列展示, 不展示设备名称;
    const dataAnomaly = ['NB2035', 'NB2036'].includes(eventCode); // 数据事件的高值异常、低值异常展示标准线
    let delPointIndex = -1;
    const pulseSignalInfo = pointData.find((e, index) => { // 找到脉冲信号的数据 及所在索引
      if (e.pointCode === pointCode) {
        delPointIndex = index;
      }
      return e.pointCode === pointCode;
    });
    if (delPointIndex >= 0 && pageKey === 'alarm') { // 如果存在脉冲信号，将脉冲信号抽出
      pointData.splice(delPointIndex, 1);
    }

    let legends = [], colors = [], series = []; // 诊断事件-组串类不展示告警时段, 其他都展示
    if (!isDiagnoseBranch) { // 展示告警时段
      legends = [{
        name: '告警时段',
        icon: 'rect',
        height: 30,
        left: '7%',
        top: 0,
        itemWidth: 14,
        selectedMode: false,
        data: ['告警时段'],
        textStyle: {
          color: '#353535',
        },
      }];
      colors = ['rgba(251,230,227,0.50)']; // 图标依次着色
      const markAreaData = period.map(e => { // 告警事件段数据规范。
        const { beginTime, endTime } = e || {};
        return [{
          xAxis: this.timeFormat(beginTime, interval),
        }, {
          xAxis: this.timeFormat(endTime, interval),
        }];
      });
      series = [{ // 初始化series;
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
    }
    const lengendColType = isDiagnoseBranch ? 8 : 4; // lengend一行排布模式: 诊断事件-组串类情况下8列，其余情况下4个。
    const { unitsGroup, sortedPointData } = this.pointDataSorter(pointData); // 得到排序后的单位与新数组
    sortedPointData.forEach((e, i) => {
      const pointName = `${isDiagnoseBranch ? '' : e.deviceName} ${e.pointName || ''}`; // 诊断事件的组串类不展示设备名称
      const pointFullName = `${pointName}${e.pointUnit ? `(${e.pointUnit})`: ''}`;
      let lineStyleColor = '';
      if (e.pointName === '瞬时辐照度') { // 瞬时辐照度, 固定使用橙色;  
        colors.push('#ff9900');
        lineStyleColor = '#ff9900';
      } else if (e.isConnected === 0 && isDiagnoseBranch) { // 诊断事件 - 未接组串为灰色
        colors.push('#999');
        lineStyleColor = '#999';
      } else if (isDiagnoseBranch) { // 诊断事件 - 组串 默认绿色#60c060, 异常红色#f5222d
        colors.push('#60c060');
        const curWarningBranch = branchPeriod.find(brach => e.pointCode === brach.pointCode) || {};
        const curWarningPeriod = curWarningBranch.warningPeriod || [];
        const warningDays = curWarningPeriod.filter(w => w.beginTime).map(w => moment(w.beginTime).startOf('day'));
        const linearGradientData = [{ offset: 0, color: '#60c060' }];
        const minDay = moment(time[0]).startOf('day');
        const totalDays = 7, eachPercent = 1 / totalDays, gradientLength = eachPercent / 100; // 总数据, 渐变间隔(一天), 渐变区间(百分之一) 
        warningDays.forEach(eachday => {
          const dayDiff = eachday.diff(minDay, 'days'); // 当前告警日 比 最小日(7天最初天) 大的日期
          if (dayDiff >= 0 && dayDiff <= 7) {
            linearGradientData.push({ offset: dayDiff * eachPercent + gradientLength, color: '#f5222d' });
            linearGradientData.push({ offset: (dayDiff + 1) * eachPercent - gradientLength, color: '#f5222d' });
            linearGradientData.push({ offset: (dayDiff + 1) * eachPercent, color: '#60c060' });
          }
        });
        // colors.push(new echarts.graphic.LinearGradient(0, 0, 1, 0, linearGradientData));
        lineStyleColor = {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: linearGradientData,
        };
      } else { // 使用默认配色
        lineStyleColor = this.lineColors[i % this.lineColors.length];
        colors.push(this.lineColors[i % this.lineColors.length]);
      }

      legends.push({
        icon: (e.isConnected === 0 && isDiagnoseBranch) ? 'image:///img/wjr01.png' : '',
        name: pointFullName,
        height: 30,
        itemWidth: 20,
        itemHeight: 10,
        left: `${isDiagnoseBranch ? (2 + i % 8 * 12) : (7 + (i + 1) % 4 * 21.5)}%`, // 诊断事件-组串: 8列, 其余展示告警时段且4列展示;
        top: `${Math.floor((isDiagnoseBranch ? i : i + 1) / lengendColType) * 30}`,
        data: [pointFullName],
        textStyle: {
          color: e.isWarned ? (isDiagnoseBranch ? '#f9b600' : '#f5222d') : '#353535', // 诊断事件-组串，正常黄色, 告警红色, 其余所有默认
        },
        selectedMode: e.isConnected === 0 ? false : true,
      });
      series.push({
        name: pointFullName,
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: unitsGroup.indexOf(e.pointUnit || ''), // 空单位统一以''作为单位
        lineStyle: {
          width: (e.isConnected === 0 && isDiagnoseBranch) ? 0 : 1, // 诊断事件组串不显示折线
          color: lineStyleColor,
        },
        data: e.value,
        symbol: 'circle',
        symbolSize: 5,
        // showSymbol: (e.isConnected === 0 && isDiagnoseBranch) ? false : true,
        showSymbol: false,
        smooth: true,
      });
    });
    const clientWidth = document.body.clientWidth;
    const legendNum = (delPointIndex !== -1 && pageKey === 'alarm') ? legends.length + 1 : legends.length; // 告警事件和有脉冲信号的情况下, 额外添加一个lengend；
    const legnedRows = Math.ceil(legendNum / lengendColType);
    const legendHeight = legnedRows * 30;
    const originGridHeight = (clientWidth > 1680 ? 300 : 200) + (3 - (legnedRows > 3 ? 3 : legnedRows)) * 30; // 大于1680屏幕分辨率的grid高度最小为300，小于1680屏幕分辨率的grid高度最小为200
    const eachyAxis = { // 生成多y纵坐标, 相同单位对应一个y轴
      // name: '其他测点',
      gridIndex: 0,
      type: 'value',
      nameTextStyle: {
        color: 'transparent',
      },
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
    const yAxis = unitsGroup.length > 0 ? unitsGroup.map((e, i) => {
      const diagnoseBrancnAxis = isDiagnoseBranch ? { // 诊断事件组串类: 只会返回电压(电流) + 辐照两个轴, 电压电流(左),辐照(右)
        name: e === 'W/m2' ? '瞬时辐照度(W/m2)' : (e === 'A' ? '电流(A)' : '电压(V)'),
        nameTextStyle: {
          color: '#353535',
          fontSize: 12,
        },
        nameGap: 10,
        axisLabel: {
          show: true,
        },
        position: e === 'W/m2' ? 'right' : 'left',
        axisLine: {
          show: true,
        },
      } : {};
      return {
        name: e,
        ...eachyAxis,
        ...diagnoseBrancnAxis,
      };
    }) : eachyAxis; // 若返回异常数据导致无单位，使用默认单纵坐标即可
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
    const grid = [{
      show: true,
      borderColor: '#d4d4d4',
      bottom: (delPointIndex !== -1 && pageKey === 'alarm') ? '37%' : '',
      top: isDiagnoseBranch ? (legendHeight + 18) : legendHeight,
      left: '7%',
      right: '7%',
      height: originGridHeight - (isDiagnoseBranch ? 18 : 0),
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
      grid[0].height = originGridHeight - 57;
      grid.push({
        show: true,
        borderColor: '#d4d4d4',
        bottom: 100,
        top: legendHeight + originGridHeight - 57,
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
        position: this.getTooltipPosition(legendHeight),
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
                const eachFullData = sortedPointData[isDiagnoseBranch ? seriesIndex: seriesIndex - 1] || {}; // 诊断事件组串不展示告警时段,所以去除告警时段的位置
                // 解析全数据使用， 因为系列中有个首条空线， series需减一对应。
                const { isWarned, pointName, deviceName, isConnected } = eachFullData;
                const lineFullName = `${deviceName} ${pointName || ''}`;
                return (
                  `<p class=${(isWarned && pageKey === 'diagnose') ? (isDiagnoseBranch ? styles.specialWarnedItem : styles.warnedItem) : (isConnected === 0 && isDiagnoseBranch ? styles.connected : styles.eachItem)}>
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
              <p class=${(periodData.length > 0 && !isDiagnoseBranch) ? styles.eachItem : styles.noWarnItem}>
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
    // const clientWidth = document.body.clientWidth;
    // const clientHeight = document.body.clientHeight;
    // const calcHeight = clientWidth >= 1680 ? (clientHeight - 461) : (clientHeight - 381);
    return (
      <div className={styles.analysisChart} ref={(ref) => { this.lineRef = ref; } } />
    );
  }
}

export default ChartLine;




