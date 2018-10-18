import React from "react";

import echarts from 'echarts';


class WeatherStatus extends React.Component {
    constructor(props, context) {
        super(props, context)
    }

    componentDidMount() {
        const { graphId, yAxisName, xAxisName, dateType } = this.props;

        const targetChart = echarts.init(document.getElementById(graphId));


        const targetMonthOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['晴', '阴', '雨', '雪', '霾', '其他']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false,
                  },
            },
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },
            series: [
                {
                    name: '晴',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [320, 302, 301, 334, 390, 330, 320]
                },
                {
                    name: '阴',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '雨',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: '雪',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [150, 212, 201, 154, 190, 330, 410]
                },
                {
                    name: '霾',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [820, 832, 901, 934, 1290, 1330, 1320]
                }, {
                    name: '其他',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [150, 212, 201, 154, 190, 330, 410]
                },
            ]
        };


        targetChart.setOption(targetMonthOption)
        targetChart.resize();


    }
    componentWillReceiveProps(nextProps) {
        const { graphId, yAxisName, xAxisName, dateType } = nextProps;

        const targetChart = echarts.init(document.getElementById(graphId));
        const targetMonthOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['晴', '阴', '雨', '雪', '霾', '其他']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: {
                type: 'value'
            },
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },
            series: [
                {
                    name: '晴',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [320, 302, 301, 334, 390, 330, 320]
                },
                {
                    name: '阴',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '雨',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: '雪',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [150, 212, 201, 154, 190, 330, 410]
                },
                {
                    name: '霾',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [820, 832, 901, 934, 1290, 1330, 1320]
                }, {
                    name: '其他',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: [150, 212, 201, 154, 190, 330, 410]
                },
            ]
        };
        targetChart.setOption(targetMonthOption)
        targetChart.resize();



    }
    render() {
        const { graphId, dateType } = this.props;
        return (

            <div id={graphId} style={{ display:'flex',flex:1, }}> </div>

        )
    }
}
export default (WeatherStatus)