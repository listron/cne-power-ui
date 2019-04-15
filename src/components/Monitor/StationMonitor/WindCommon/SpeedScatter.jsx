import React from 'react';
import echarts from 'echarts';
import { Link } from 'react-dom';
import { dataFormats, numWithComma } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData.js';
import moment from 'moment';
import styles from './windCommon.scss';


const SpeedScatter = ({ ...rest }) => {
    const { scatterData = {} } = rest;
    const { stationsMonthsData = [], yesterdayData = [] } = scatterData;
    const chartsBox = document.getElementById('SpeedScatterGraph');
    const Graphic = (stationsMonthsData.length === 0 && yesterdayData.length === 0) ? showNoData : hiddenNoData;
    const lineColor = '#666';
    const fontColor = '#333';
    if (chartsBox) {
        const SpeedScatterGraph = echarts.init(chartsBox);
        stationsMonthsData.length > 0 ? SpeedScatterGraph.hideLoading() : SpeedScatterGraph.showLoading('default', { color: '#199475' });
        const scatterOption = {
            graphic: Graphic,
            color: ['#c7ceb2', '#199475'],
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
            },
            tooltip: {
                trigger: 'item',
                enterable: true,
                show: true,
                backgroundColor: '#fff',
                axisPointer: {
                    // type: 'cross',
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
                                <div class=${styles.tooltipCont}> <span></span> 等效时${dataFormats(params.data[1], '--', 2, true)}</div>
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
                        color: '#dfdfdf',
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
                            color: '#dfdfdf',
                        },
                    },
                    max: 'dataMax',
                    axisLabel: {
                        color: lineColor,
                    },
                    axisTick: {
                        show: false,
                    },
                }
            ],
            series: [
                {
                    name: '近三个月',
                    type: 'scatter',
                    symbolSize: 5,
                    emphasis: {
                        symbolSize: 8,
                    },
                    data: stationsMonthsData.map((item) => {
                        const { windSpeed, equipmentHours, stationName, date, stationCode } = item;
                        return [windSpeed, equipmentHours, date, stationName, stationCode]
                    })
                },
                {
                    name: '昨日',
                    type: 'scatter',
                    symbolSize: 5,
                    emphasis: {
                        symbolSize: 8,
                    },
                    data: yesterdayData.map((item) => {
                        const { windSpeed, equipmentHours, stationName, date, stationCode } = item;
                        return [windSpeed, equipmentHours, date, stationName, stationCode]
                    })
                }
            ]
        };
        SpeedScatterGraph.setOption(scatterOption, 'notMerge');
        SpeedScatterGraph.resize();
    }


    return (
        <div id="SpeedScatterGraph" className={styles.SpeedScatterGraph}></div>
    )
}




export { SpeedScatter }