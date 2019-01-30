import React from "react";
import echarts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../../../constants/echartsNoData';
class barGraph extends React.Component {
    constructor(props, context) {
        super(props, context)
    }

    componentDidMount() {
        this.drawChart(this.props);

    }
    componentWillReceiveProps(nextProps) {
        this.drawChart(nextProps);
    }

    getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示
        const length = data.length;
        let replaceData = [];
        for (let i = 0; i < length; i++) { replaceData.push('--') }
        let realData = data.some(e => e || e === 0) ? data : replaceData;
        return realData
    }

    drawChart = (params) => {
        const { graphId, yAxisName, xAxisName, title, dayCompleteRate, dayCompleteRateDateData, dayCompleteRateLastYearData, dayCompleteRateThatYearData, lastYear, currentYear, hasData } = params;
        const targetChart = echarts.init(document.getElementById(graphId));
        targetChart.resize();
        let color = ['#a42b2c', '#199475', '#f9b600'];
        const lineColor = '#f1f1f1';
        const fontColor = '#333';
        const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
        const targetDayOption = {
            graphic: confluenceTenMinGraphic,
            title: {
                text: title,
                left: '23',
                top: 'top',
                show: title ? 'show' : false,
                textStyle: {
                    color: fontColor,
                    fontSize: 14,
                    fontWeight: 'normal',
                }
            },
            color: color,
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross', label: { color: fontColor } },
                backgroundColor: '#fff',
                padding: 10,
                textStyle: {
                    color: 'rgba(0, 0, 0, 0.65)',
                    fontSize: 12,
                },
                extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
                formatter: function (params) {
                    let paramsItem = '';
                    params.forEach((item, index) => {
                        return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${item.color};vertical-align: 3px;margin-right: 3px;"> </span> ${item.seriesName} :${item.value === 0 || item.value ? item.value : '--'}${item.seriesType === 'line' && '%' || ''}</div>`
                    });
                    return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${params[0].name} </span><span style="float: right">${xAxisName} </span>
                    </div>${paramsItem}`
                }
            },
            legend: {
                // icon: 'circle',
                left: 'center',
                itemWidth: 8,
                itemHeight: 5,
            },
            grid: {
                left: '8%',
                right: '8%',
            },
            xAxis: [
                {
                    type: 'category',
                    data: dayCompleteRateDateData,
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: lineColor, }
                    },
                    axisLabel: {
                        color: fontColor,
                    },
                    axisTick: {
                        show: false,
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: yAxisName,
                    nameTextStyle: {
                        color: fontColor,
                    },
                    // min: 0,
                    splitNumber: 5,
                    scale: true,
                    axisLabel: {
                        color: fontColor,
                    },
                    axisLine: {
                        show: false,
                        lineStyle: { color: lineColor, }
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        // show:false,
                        lineStyle: {
                            color: fontColor,
                            type: 'dashed'
                        }
                    },
                },
                {
                    type: 'value',
                    name: '同比',
                    nameTextStyle: {
                        color: fontColor,
                    },
                    axisLabel: {
                        formatter: '{value} %',
                        color: fontColor,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                        lineStyle: { color: lineColor, }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: lineColor,
                            type: 'dashed'
                        }
                    },
                }
            ],
            series: [
                {
                    name: lastYear,
                    type: 'line',
                    lineStyle: {
                        type: 'dashed'
                    },
                    data:this.getDefaultData(dayCompleteRateLastYearData) 
                },
                {
                    name: currentYear,
                    type: 'line',
                    areaStyle: {
                        color: '#ceebe0'
                    },
                    data: this.getDefaultData(dayCompleteRateThatYearData)
                },
                {
                    name: '同比',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.getDefaultData(dayCompleteRate)
                }
            ]
        };
        targetChart.setOption(targetDayOption)

    }
    render() {
        const { graphId } = this.props;
        return (
            <div id={graphId} style={{ width: '100%', height: "300px", }}> </div>
        )
    }
}
export default (barGraph)
