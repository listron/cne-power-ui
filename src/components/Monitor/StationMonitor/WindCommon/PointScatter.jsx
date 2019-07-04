import React, { Component } from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import { Link } from 'react-dom';
import { dataFormats } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData.js';
import moment from 'moment';
import styles from './windCommon.scss';


class PointScatter extends Component {
    static propTypes = {
        scatterData: PropTypes.object,
        scatterpointTime: PropTypes.number,
    }
    constructor() {
        super();
    }
    componentDidMount() {
        this.drawCharts(this.props);
    }

    componentDidUpdate(prevProps) {
        const { scatterpointTime } = this.props;
        const preTime = prevProps.scatterpointTime;
        if (scatterpointTime !== preTime) { // 数据重新请求后重绘。
            this.drawCharts(this.props);
        }
    }


    drawCharts = (params) => {
        const { scatterData = {}, type } = params;
        let needData = [];
        if (type === 'windDevice') {
            needData = [
                { name: '近三个月', value: 'monthsChart' },
                { name: '24小时', value: 'dayChart' },
            ];
        }
        const series = needData.map((item) => {
            const data = scatterData[item.value] || [];
            return ({
                name: item.name,
                type: 'scatter',
                symbolSize: 5,
                emphasis: {
                    symbolSize: 8,
                },
                data: data.map((item) => {
                    const { xData, yData, time, deviceName } = item;
                    const formatTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
                    return [dataFormats(xData, '--', 2, true), dataFormats(yData, '--', 2, true), formatTime, deviceName];
                }),
            });
        });
        const chartsBox = document.getElementById('SpeedScatterGraph');
        const Graphic = (needData.length === 0) ? showNoData : hiddenNoData;
        const lineColor = '#666';
        const fontColor = '#333';
        const SpeedScatterGraph = echarts.init(chartsBox);
        scatterData.monthsChart ? SpeedScatterGraph.hideLoading() : SpeedScatterGraph.showLoading('default', { color: '#199475' });
        const scatterOption = {
            graphic: Graphic,
            color: ['#c7ceb2', '#199475', '#e08031'],
            title: {
                text: '24h风功率散点图',
                textStyle: {
                    color: fontColor,
                    fontSize: 14,
                    fontWeight: 'normal',
                },
                top: 8,
                left: 10,
            },
            legend: {
                left: 'center',
                bottom: 10,
                textStyle: {
                    color: lineColor,
                    fontSize: 12,
                },
                itemWidth: 24,
                itemHeight: 6,
            },
            grid: {
                top: 70,
                // left: 70,
            },
            tooltip: {
                trigger: 'item',
                enterable: true,
                show: true,
                backgroundColor: '#fff',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: lineColor,
                    },
                },
                backgroundColor: '#fff',
                textStyle: {
                    color: 'rgba(0, 0, 0, 0.65)',
                    fontSize: 12,
                },
                padding: 0,
                extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
                formatter: (params) => {
                    return (
                        `<div class=${styles.tooltipBox}>
                            <div class=${styles.axisValue}>${params.data[2]}</div>
                            <div class=${styles.tooltipContainer}> 
                                <div class=${styles.tooltipCont}> <span></span> 平均风速 ${params.data[0]}</div>
                                <div class=${styles.tooltipCont}> <span></span> 平均功率 ${dataFormats(params.data[1], '--', 2, true)}</div>
                            </div>
                        </div>`
                    );
                },
            },
            xAxis: {
                type: 'value',
                nameGap: -40,
                name: '风速(m/s)',
                nameTextStyle: {
                    color: lineColor,
                    verticalAlign: 'bottom',
                    padding: [0, 0, 20, 0],
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    onZero: false,
                    lineStyle: {
                        color: '#dfdfdf',
                    },
                },
                min: 0,
                axisLabel: {
                    color: lineColor,
                },
                axisPointer: {
                    label: {
                        show: false,
                    },
                },
                splitLine: {
                    show: false,
                },
            },
            yAxis: [
                {
                    name: '功率(kW)',
                    type: 'value',
                    nameTextStyle: {
                        color: lineColor,
                    },
                    splitLine: {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#dfdfdf',
                        },
                    },
                    axisLabel: {
                        color: lineColor,
                    },
                    axisTick: {
                        show: false,
                    },
                },
            ],
            series: series,
        };
        SpeedScatterGraph.setOption(scatterOption, 'notMerge');
    }

    render() {
        return (
            <div id="SpeedScatterGraph" className={styles.SpeedScatterGraph}></div>
        );
    }
}



export { PointScatter };
