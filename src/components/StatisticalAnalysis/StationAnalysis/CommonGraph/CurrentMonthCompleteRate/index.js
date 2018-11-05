import React from "react";
import echarts from 'echarts';

class barGraph extends React.Component {
    constructor(props, context) {
        super(props, context)
    }

    componentDidMount() {
        this.drawChart(this.props);
        const { graphId, yAxisName, xAxisName, dateType } = this.props;

    }
    componentWillReceiveProps(nextProps) {
        this.drawChart(nextProps);
    }

    drawChart = (params) => {
        const { graphId, yAxisName, xAxisName, title,dayCompleteRate,dayCompleteRateDateData,dayCompleteRateLastYearData,dayCompleteRateThatYearData,lastYear,currentYear } = params;
        const targetChart = echarts.init(document.getElementById(graphId));
        targetChart.resize();
        let color = ['#a42b2c', '#199475', '#f9b600'];
        const targetDayOption = {
            title: {
                text: title,
                left: '23',
                top: 'top',
                show: title ? 'show' : false,
                textStyle: {
                    color: '#666',
                    fontSize: 14,
                    fontWeight: 'normal',
                }
            },
            color: color,
            tooltip: {
              trigger: 'axis',
                axisPointer: { type: 'cross' },
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
                        return paramsItem += `<div> <span style="display: inline-block;width: 5px;height: 5px;border-radius: 50%;background:${color[index]};vertical-align: 3px;margin-right: 3px;"> </span> ${params[index].seriesName} :${params[index].value}</div>`
                    });
                    return `<div  style="border-bottom: 1px solid #ccc;padding-bottom: 7px;margin-bottom: 7px;width:180px;overflow:hidden;"> <span style="float: left">${params[0].name} </span><span style="float: right">${xAxisName} </span>
                    </div>${paramsItem}`
                }
            },
            legend: {
                icon: 'circle',
                left: 'center',
                itemWidth: 5,
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
                    // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#dfdfdf',
                        }
                    },
                    axisLabel: {
                        color: '#666',
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
                        color: '#666',
                    },
                    // min: 0,
                    splitNumber: 5,
                    scale: true,
                    axisLabel: {
                        color: '#666',
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        // show:false,
                        lineStyle: {
                            color: '#666',
                            type: 'dashed'
                        }
                    },
                },
                {
                    type: 'value',
                    name: '同比',
                    nameTextStyle: {
                        color: '#666',
                    },
                    axisLabel: {
                        formatter: '{value} %',
                        color: '#666',
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#f1f1f1',
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
                    data: dayCompleteRateLastYearData
                    // data: [320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name: currentYear,
                    type: 'line',
                    areaStyle: {
                        color: '#ceebe0'
                    },
                    data: dayCompleteRateThatYearData
                    // data: [820, 932, 901, 934, 1290, 1330, 1320]
                },
                {
                    name: '同比',
                    type: 'line',
                    yAxisIndex: 1,
                    data: dayCompleteRate
                    // data: [120, 132, 101, 134, 90, 230, 210, 340]
                }
            ]
        };
        targetChart.setOption(targetDayOption)

    }
    render() {
        const { graphId, dateType } = this.props;
        return (
            <div id={graphId} style={{ width: '100%', height: "300px", }}> </div>
        )
    }
}
export default (barGraph)
