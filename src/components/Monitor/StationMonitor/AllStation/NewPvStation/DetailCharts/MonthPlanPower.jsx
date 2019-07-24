import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Link } from 'react-dom';
import { dataFormats, getDefaultData } from '../../../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../../../constants/echartsNoData.js';
import { divideFormarts, chartPowerPoint } from '../../../PvCommon/PvDataformat';
import moment from 'moment';
import styles from './detailCharts.scss';


class MonthPlanPower extends Component {
    static propTypes = {
        monthPlanPowerData: PropTypes.array,
        powerTime: PropTypes.number,
        powerUnit: PropTypes.string,
    }
    constructor() {
        super();
    }

    componentDidMount() {
        this.drawCharts(this.props);
    }

    componentDidUpdate(prevProps) {
        const { powerTime, loading } = this.props;
        const preTime = prevProps.dayPowerTime;
        if (powerTime !== preTime || loading !== prevProps.loading) { // 数据重新请求后重绘。
            this.drawCharts(this.props);
        }
    }

    drawCharts = (params) => {
        const { monthPlanPowerData = [], powerUnit, loading } = params;
        const monthPower = monthPlanPowerData.map(e => chartPowerPoint(divideFormarts(e.monthPower, powerUnit), '--', 2, true)); // 月发电量
        const filterMonthPower = monthPlanPowerData.filter(e => e.dayPower);
        const monthPlanPower = monthPlanPowerData.map(e => chartPowerPoint(divideFormarts(e.monthPlanPower, powerUnit), '--', 2, true)); // 月计划发电量
        const filterMonthPlanPower = monthPlanPowerData.filter(e => e.equipmentHours);
        const instantaneous = monthPlanPowerData.map(e => dataFormats(divideFormarts(e.instantaneous, 'MJ'), '--', 2, true)); // 辐射值
        const filterInstantaneous = monthPlanPowerData.filter(e => e.instantaneous);
        const powerGraphic = (filterMonthPower.length === 0 && filterMonthPlanPower.length === 0 && filterInstantaneous.length === 0
        ) ? showNoData : hiddenNoData;
        const chartsBox = document.getElementById('monthPlanPowerChart');
        const powerDiagram = echarts.init(chartsBox, 'darkTheme');
        loading ? powerDiagram.showLoading('default', { color: '#199475' }) : powerDiagram.hideLoading();
        const lineColor = '#dfdfdf';
        const fontColor = '#666';
        let color = color = ['#ceebe0', '#fbe6e3', '#f9b600'];
        const powerOption = {
            graphic: powerGraphic,
            color: color,
            title: {
                text: '月累计与计划发电量（截止昨天）',
                textStyle: {
                    color: '#000',
                    fontSize: 14,
                    fontWeight: 'normal',
                },
                top: 8,
                left: 10,
            },
            legend: {
                left: 'center',
                top: 35,
                textStyle: {
                    color: fontColor,
                },
                itemWidth: 10,
                itemHeight: 5,
            },
            grid: {
                top: 95,
                left: '15%',
                right: '15%',
                bottom: 40,
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fff',
                textStyle: {
                    color: fontColor,
                    fontSize: 12,
                },
                extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
                padding: 0,
                formatter: (params) => {
                    let paramsItem = '';
                    params.forEach(item => {
                        return paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${item.color}"> </span> 
                        ${item.seriesName} :  ${item.value}</div>`;
                    });
                    return (
                        `<div class=${styles.tooltipBox}>
                            <div class=${styles.axisValue}>${params[0].name}</div>
                            <div class=${styles.tooltipContainer}> ${paramsItem}</div>
                        </div>`
                    );
                },
                axisPointer: {
                    type: 'cross',
                },
            },

            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: monthPlanPowerData && monthPlanPowerData.map(e => e.date),
                    axisLine: {
                        lineStyle: {
                            color: '#dfdfdf',
                        },
                    },
                    axisLabel: {
                        color: fontColor,
                        interval: 0,
                        formatter: (value) => {
                            return moment(value).format('MM');
                        },
                    },
                    axisTick: { show: false },
                },
            ],

            yAxis: [
                {
                    name: `发电量(${powerUnit})`,
                    type: 'value',
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}',
                        color: fontColor,
                    },
                    nameTextStyle: {
                        color: fontColor,
                        padding: [0, 0, 0, 30],
                    },
                    axisLine: {
                        lineStyle: {
                            color: lineColor,
                        },
                    },
                    axisTick: {
                        show: true,
                        color: lineColor,
                    },
                    splitLine: {
                        show: false,
                    },
                }, {
                    name: '累计辐射(MJ/m²)',
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                        color: fontColor,
                    },
                    nameTextStyle: {
                        color: fontColor,
                        padding: [0, 30, 0, 0],
                    },
                    axisLine: {
                        lineStyle: {
                            color: lineColor,
                        },
                    },
                    axisTick: {
                        // show: false,
                        color: lineColor,
                    },
                    splitLine: {
                        show: false,
                    },
                },
            ],
            series: [
                {
                    name: '累计发电量',
                    type: 'line',
                    data: getDefaultData(monthPower),
                    yAxisIndex: 0,
                    smooth: true,
                    color: '#ceebe0',
                    areaStyle: {
                        color: '#ceebe0',
                    },
                    symbol: 'none',
                },
                {
                    name: '计划发电量',
                    type: 'line',
                    smooth: true,
                    data: getDefaultData(monthPlanPower),
                    yAxisIndex: 0,
                    color: '#fbe6e3',
                    areaStyle: {
                        color: '#fbe6e3',
                    },
                    symbol: 'none',
                },
                {
                    name: '累计辐射',
                    type: 'line',
                    data: getDefaultData(instantaneous),
                    yAxisIndex: 1,
                    color: '#f9b600',
                },
            ],
        };
        powerDiagram.setOption(powerOption, 'notMerge');
        powerDiagram.resize();
    }

    render() {
        const productionAnalysis = '#/statistical/stationaccount/production';
        return (
            <div id="monthPlanPowerChart" style={{ display: 'flex', flex: 1 }}></div>
        );
    }

}





export default MonthPlanPower;
