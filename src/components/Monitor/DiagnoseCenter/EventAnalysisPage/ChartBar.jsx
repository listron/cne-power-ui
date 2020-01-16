
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { dataFormats } from '@utils/utilFunc';
import styles from './eventAnalysis.scss';

class ChartBar extends PureComponent {
  static propTypes = {
    eventAnalysisLoading: PropTypes.bool,
    eventAnalysisInfo: PropTypes.object,
  };

  componentDidMount(){
    const { eventAnalysisInfo } = this.props;
    const { data = [] } = eventAnalysisInfo || {};
    this.drawChart(data);
  }

  componentWillReceiveProps(nextProps){
    const preAnalysiInfo = this.props.eventAnalysisInfo;
    const preLoading = this.props.eventAnalysisLoading;
    const { eventAnalysisInfo, eventAnalysisLoading } = nextProps;
    if (eventAnalysisLoading && !preLoading) { // 数据加载中
      this.chartLoading();
    }
    if (eventAnalysisInfo !== preAnalysiInfo) {
      const { data = [] } = eventAnalysisInfo || {};
      this.drawChart(data);
    }
  }

  chartLoading = () => {
    const barChart = echarts.init(this.lineRef);
    barChart.showLoading();
  }

  drawChart = (data = []) => {
    const barChart = echarts.init(this.barRef);
    barChart.hideLoading();
    const xNames = [], baseData = [], theoryData = [], lineData = [];
    data.forEach((e) => {
      xNames.push(e.name);
      baseData.push(e.gen);
      theoryData.push(e.theoryGen);
      lineData.push(e.diff);
    });
    const option = {
      // legend: {
      //   data: [{
      //     name: '逆变器直流发电量(kWh)',
      //     color: '#ceebe0',
      //     icon: 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iOHB4IiBoZWlnaHQ9IjhweCIgdmlld0JveD0iMCAwIDggOCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNTEuMyAoNTc1NDQpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPlJlY3RhbmdsZSAzPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlNjcmVlbjIt5ZGK6K2mIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iMy3mjInpkq7lkozooajljZUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MTYuMDAwMDAwLCAtNTIxLjAwMDAwMCkiIGZpbGw9IiNEOEQ4RDgiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtMyIgeD0iNDE2IiB5PSI1MjEiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHJ4PSIyIj48L3JlY3Q+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=',
      //   }, {
      //     name: '方阵理论发电量(kWh)',
      //     icon: 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iOHB4IiBoZWlnaHQ9IjhweCIgdmlld0JveD0iMCAwIDggOCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNTEuMyAoNTc1NDQpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPlJlY3RhbmdsZSAzIENvcHk8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iU2NyZWVuMi3lkYroraYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSIzLeaMiemSruWSjOihqOWNlSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQzNS4wMDAwMDAsIC01MjEuMDAwMDAwKSIgZmlsbD0iIzk3OTc5NyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTQzNyw1MjIgQzQzNi40NDc3MTUsNTIyIDQzNiw1MjIuNDQ3NzE1IDQzNiw1MjMgTDQzNiw1MjcgQzQzNiw1MjcuNTUyMjg1IDQzNi40NDc3MTUsNTI4IDQzNyw1MjggTDQ0MSw1MjggQzQ0MS41NTIyODUsNTI4IDQ0Miw1MjcuNTUyMjg1IDQ0Miw1MjcgTDQ0Miw1MjMgQzQ0Miw1MjIuNDQ3NzE1IDQ0MS41NTIyODUsNTIyIDQ0MSw1MjIgTDQzNyw1MjIgWiBNNDM3LDUyMSBMNDQxLDUyMSBDNDQyLjEwNDU2OSw1MjEgNDQzLDUyMS44OTU0MzEgNDQzLDUyMyBMNDQzLDUyNyBDNDQzLDUyOC4xMDQ1NjkgNDQyLjEwNDU2OSw1MjkgNDQxLDUyOSBMNDM3LDUyOSBDNDM1Ljg5NTQzMSw1MjkgNDM1LDUyOC4xMDQ1NjkgNDM1LDUyNyBMNDM1LDUyMyBDNDM1LDUyMS44OTU0MzEgNDM1Ljg5NTQzMSw1MjEgNDM3LDUyMSBaIiBpZD0iUmVjdGFuZ2xlLTMtQ29weSI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+',
      //   }, {
      //     name: '对比差值(%)',
      //     color: '#ff9900',
      //     icon: 'path://M681.38649,914 C682.148892,914 683.387172,914 685.05,914 C685.574671,914 686,914.447715 686,915 C686,915.552285 685.574671,916 685.05,916 C683.395287,916 682.145906,916 681.38649,916 C681.458399,915.583252 681.494354,915.256592 681.494354,915.02002 C681.494354,914.783447 681.458399,914.443441 681.38649,914 Z M671.590869,916 C670.781787,916 669.568164,916 667.95,916 C667.425329,916 667,915.552285 667,915 C667,914.447715 667.425329,914 667.95,914 C669.599694,914 670.766022,914 671.590869,914 C671.520725,914.443358 671.485654,914.776691 671.485654,915 C671.485654,915.221136 671.520725,915.554469 671.590869,916 Z M676.5,919 C674.290861,919 672.5,917.209139 672.5,915 C672.5,912.790861 674.290861,911 676.5,911 C678.709139,911 680.5,912.790861 680.5,915 C680.5,917.209139 678.709139,919 676.5,919 Z',
      //   }],
      // },
      grid: {
        show: true,
        borderColor: '#d4d4d4',
        top: 0,
        bottom: 60,
        left: '7%',
        right: '7%',
      },
      tooltip: {
        trigger: 'axis',
        show: true,
        extraCssText: 'padding: 5px 10px; background-color: rgba(0,0,0,0.70); box-shadow:0 1px 4px 2px rgba(0,0,0,0.20); border-radius:2px;',
        formatter: (params = []) => {
          const { name, value: theoryValue } = params[0] || {};
          const { value: baseValue } = params[1] || {};
          const { value: rateValue } = params[2] || {};
          return (
            `<section class=${styles.chartTooltip}>
              <h3 class=${styles.tooltipTitle}>${name}</h3>
              <div>
                <p class=${styles.eachItem}>
                  <span class=${styles.tipRect} style="background-color: #7D8C87"></span>
                  <span class=${styles.tipName} style="flex: 0 0 176px">逆变器直流发电量(kWh)</span>
                  <span class=${styles.tipValue}>${dataFormats(baseValue, '--', 2, true)}</span>
                </p>
                <p class=${styles.eachItem}>
                  <span class=${styles.tipRect} style="background-color: #6E6F6F"></span>
                  <span class=${styles.tipName} style="flex: 0 0 176px">方阵理论发电量(kWh)</span>
                  <span class=${styles.tipValue}>${dataFormats(theoryValue, '--', 2, true)}</span>
                </p>
                <p class=${styles.eachItem}>
                  <span class=${styles.tipIcon}>
                    <span class=${styles.line} style="background-color: #ff9900"></span>
                    <span class=${styles.rect} style="background-color: #ff9900"></span>
                  </span>
                  <span class=${styles.tipName} style="flex: 0 0 176px">对比差值(%)</span>
                  <span class=${styles.tipValue}>${dataFormats(rateValue, '--', 2, true)}</span>
                </p>
              </div>
            </section>`
          );
        },
      },
      xAxis: {
        type: 'category',
        data: xNames,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: [
        {
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
        }, {
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
        },
      ],
      series: [
        {
          name: '方阵理论发电量(kWh)',
          type: 'bar',
          barWidth: 34,
          barGap: '-100%',
          itemStyle: {
            color: '#FFF',
            borderWidth: 1,
            borderColor: '#199475',
            barBorderRadius: [2, 2, 0, 0],
          },
          data: theoryData,
        }, {
          name: '逆变器直流发电量(kWh)',
          type: 'bar',
          itemStyle: {
            color: '#CEEBE0',
          },
          barWidth: 34,
          data: baseData,
        }, {
          name: '对比差值(%)',
          type: 'line',
          data: lineData,
          yAxisIndex: 1,
          itemStyle: {
            color: '#ff9900',
          },
        },
      ],
    };
    if (data.length > 0) {
      option.dataZoom = [
        {
          show: true,
          height: 20,
          bottom: 12,
        }, {
          type: 'inside',
        },
      ];
    }
    barChart.setOption(option);
  }

  render(){
    return (
      <div className={styles.analysisChart}>
        <div style={{width: '100%', height: '600px'}} ref={(ref) => { this.barRef = ref; } } />
      </div>
    );
  }
}

export default ChartBar;
