import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Link } from 'react-dom';
import { dataFormats, getDefaultData } from '../../../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../../../constants/echartsNoData.js';
import { divideFormarts, chartPowerPoint } from '../../../PvCommon/PvDataformat';
import { Gradient1, Gradient2, barRadius } from '../../../../../../utils/darkConfig';
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
        const { powerTime, theme } = this.props;
        const preTime = prevProps.dayPowerTime;
        if (powerTime !== preTime) { // 数据重新请求后重绘。
            this.drawCharts(this.props);
        }
        if (theme !== prevProps.theme) {
            this.drawCharts(this.props, true);
        }
    }

    themeColor = {
        dark: {
            labelColor: ['#5beda9', '#f47a37', '#f8b14e'],
            chartColor: [Gradient1, Gradient2, '#f8b14e'],
        },
        light: {
            labelColor: ['#ceebe0', '#fbe6e3', '#f9b600'],
            chartColor: ['#ceebe0', '#fbe6e3', '#f9b600'],
        },
    }

    drawCharts = (params, themeChange) => {
        const { monthPlanPowerData = [], powerUnit, loading, theme } = params;
        const monthPower = monthPlanPowerData.map(e => chartPowerPoint(divideFormarts(e.monthPower, powerUnit), '--', 2, true)); // 月发电量
        const filterMonthPower = monthPlanPowerData.filter(e => e.dayPower);
        const monthPlanPower = monthPlanPowerData.map(e => chartPowerPoint(divideFormarts(e.monthPlanPower, powerUnit), '--', 2, true)); // 月计划发电量
        const filterMonthPlanPower = monthPlanPowerData.filter(e => e.equipmentHours);
        const instantaneous = monthPlanPowerData.map(e => dataFormats(divideFormarts(e.instantaneous, 'MJ'), '--', 2, true)); // 辐射值
        const filterInstantaneous = monthPlanPowerData.filter(e => e.instantaneous);
        const powerGraphic = (filterMonthPower.length === 0 && filterMonthPlanPower.length === 0 && filterInstantaneous.length === 0
        ) ? showNoData : hiddenNoData;
        const themeColor = theme === 'dark' ? 'darkTheme' : 'lightTheme';
        const chartsBox = document.getElementById('monthPlanPowerChart');
        let powerDiagram = echarts.init(chartsBox, themeColor);
        if (themeChange) {
            powerDiagram.dispose();
            powerDiagram = echarts.init(chartsBox, themeColor);
        }
        loading ? powerDiagram.showLoading('default', { color: '#199475' }) : powerDiagram.hideLoading();
        const powerOption = {
            graphic: powerGraphic,
            title: {
                text: '月累计与计划发电量（截止昨天）',
                top: 8,
                left: 10,
            },
            legend: {
                left: 'center',
                top: 35,
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
                formatter: (params) => {
                    let paramsItem = '';
                    params.forEach(item => {
                        const color = item.color.colorStops && item.color.colorStops[1].color || item.color;
                        return paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"> </span> 
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
                    axisLabel: {
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
                    },
                    nameTextStyle: {
                        padding: [0, 0, 0, 30],
                    },
                    axisTick: {
                        show: true,
                    },
                    splitLine: {
                        show: false,
                    },
                }, {
                    name: '累计辐射(MJ/m²)',
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                    },
                    nameTextStyle: {
                        padding: [0, 30, 0, 0],
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
                    z: 2,
                    color: this.themeColor[theme].labelColor[0],
                    areaStyle: {
                        color: this.themeColor[theme].chartColor[0],
                    },
                    symbol: 'none',
                },
                {
                    name: '计划发电量',
                    type: 'line',
                    smooth: true,
                    data: getDefaultData(monthPlanPower),
                    yAxisIndex: 0,
                    z: 1,
                    color: this.themeColor[theme].labelColor[1],
                    areaStyle: {
                        color: this.themeColor[theme].chartColor[1],
                    },
                    symbol: 'none',
                },
                {
                    name: '累计辐射',
                    type: 'line',
                    data: getDefaultData(instantaneous),
                    yAxisIndex: 1,
                    color: this.themeColor[theme].labelColor[2],
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
