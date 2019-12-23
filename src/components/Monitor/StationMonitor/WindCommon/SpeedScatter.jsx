import React, { Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Link } from 'react-dom';
import { dataFormats } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData.js';
import moment from 'moment';
import styles from './windCommon.scss';


class SpeedScatter extends Component {
    static propTypes = {
        scatterData: PropTypes.object,
        scatterTime: PropTypes.number,
    }
    constructor() {
        super();
    }
    componentDidMount() {
        this.drawCharts(this.props)
    }

    componentDidUpdate(prevProps) {
        const { scatterTime, loading } = this.props;
        const preTime = prevProps.scatterTime;
        if (scatterTime !== preTime || loading !== prevProps.loading) { // 数据重新请求后重绘。
            this.drawCharts(this.props);
        }
    }

    drawCharts = (params) => {
        const { scatterData = {}, type, loading } = params;
        let needData = [];
        if (type === 'singleStation') {
            needData = [
                { name: '全部电站', value: 'stationsMonthsData' },
                { name: '本电站', value: 'stationMonthsData' },
                { name: '本电站昨日', value: 'yesterdayData' },
            ]
        }
        if (type === 'allStation') {
            needData = [
                { name: '近三个月', value: 'stationsMonthsData' },
                { name: '昨日', value: 'yesterdayData' },
            ]
        }
        // const scatterData={}
        let series = needData.map((item) => {
            const data = scatterData[item.value] || [];
            return ({
                name: item.name,
                type: 'scatter',
                symbolSize: 5,
                emphasis: {
                    symbolSize: 8,
                },
                data: data.map((item) => {
                    const { windSpeed, equipmentHours, stationName, date, stationCode } = item;
                    const NowEquipmentHours = equipmentHours ? +equipmentHours : equipmentHours;
                    return [dataFormats(windSpeed, '--', 2, true), dataFormats(NowEquipmentHours, '--', 2, true), date, stationName, stationCode]
                })
            })
        })
        const chartsBox = document.getElementById('SpeedScatterGraph');
        const hasData = needData.some(item => {
            return scatterData[item.value] && scatterData[item.value].length > 0
        })
        const Graphic = !hasData ? showNoData : hiddenNoData;
        const lineColor = '#353535';
        const fontColor = '#333';
        const SpeedScatterGraph = echarts.init(chartsBox);
        loading ? SpeedScatterGraph.showLoading('default', { color: '#199475' }) : SpeedScatterGraph.hideLoading();
        const scatterOption = {
            graphic: Graphic,
            color: ['#c7ceb2', '#199475', '#e08031'],
            title: {
                text: '日等效利用小时数散点图（近三个月）',
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
                    }
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
                            <div class=${styles.axisValue}>${params.data[3]}</div>
                            <div class=${styles.tooltipContainer}> 
                                <div class=${styles.tooltipCont}> <span style="background:${params.color}"> </span> ${params.data[2]}</div>
                                <div class=${styles.tooltipCont}> <span></span> 平均风速 ${params.data[0]}</div>
                                <div class=${styles.tooltipCont}> <span></span> 等效时 ${dataFormats(params.data[1], '--', 2, true)}</div>
                            </div>
                        </div>`
                    )
                }
            },
            xAxis: {
                type: 'value',
                nameGap: -40,
                name: '平均风速(m/s)',
                nameTextStyle: {
                    color: lineColor,
                    verticalAlign: 'bottom',
                    padding: [0, 0, 20, 0]
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    onZero: false,
                    lineStyle: {
                        color: '#d4d4d4',
                    },
                },
                axisLabel: {
                    color: lineColor,
                },
                axisPointer: {
                    label: {
                        show: false,
                    }
                },
                splitLine: {
                    show: false
                },
            },
            yAxis: [
                {
                    name: '等效时(h)',
                    type: 'value',
                    nameTextStyle: {
                        color: lineColor,
                    },
                    splitLine: {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#d4d4d4',
                        },
                    },
                    axisLabel: {
                        color: lineColor,
                    },
                    axisTick: {
                        show: false,
                    },
                }
            ],
            series: series
        };
        SpeedScatterGraph.setOption(scatterOption, 'notMerge');
        SpeedScatterGraph.resize();
    }


    render() {
        return (
            <div id="SpeedScatterGraph" className={styles.SpeedScatterGraph}></div>
        )
    }
}



export { SpeedScatter }