import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Link } from 'react-dom';
import { dataFormats, getDefaultData } from '../../../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../../../constants/echartsNoData.js';
import { divideFormarts, chartPowerPoint } from '../../../PvCommon/PvDataformat';
import { Gradient1, Gradient2, chartsLoading, themeConfig, chartsNodata } from '../../../../../../utils/darkConfig';
import moment from 'moment';
import styles from './detailCharts.scss';


class MonthPlanPower extends Component {
    static propTypes = {
        // monthPlanPower: PropTypes.obejct,
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
        const { monthPlanPower, loading, theme } = this.props;
        const { monthPlanPowerTime } = monthPlanPower;
        const preTime = prevProps.monthPlanPower.monthPlanPowerTime;
        if (monthPlanPowerTime !== preTime || loading !== prevProps.loading || prevProps.theme !== theme) { // 数据重新请求后重绘。
            this.drawCharts(this.props);
        }

    }

    themeColor = {
        dark: {
            monthPower: Gradient1,
            monthPlanPowers: Gradient2,
            instantaneous: '#f8b14e',
        },
        light: {
            monthPower: '#ceebe0',
            monthPlanPowers: '#fbe6e3',
            instantaneous: '#f9b600',
        },
    }


    drawCharts = (params) => {
        const { monthPlanPower = {}, powerUnit, theme = 'light' } = params;
        const { monthPlanPowerData = [], loading } = monthPlanPower;
        const monthPower = monthPlanPowerData.map(e => chartPowerPoint(divideFormarts(e.monthPower, powerUnit), '--', 2, true)); // 月发电量
        const filterMonthPower = monthPlanPowerData.filter(e => e.dayPower);
        const monthPlanPowers = monthPlanPowerData.map(e => chartPowerPoint(divideFormarts(e.monthPlanPower, powerUnit), '--', 2, true)); // 月计划发电量
        const filterMonthPlanPower = monthPlanPowerData.filter(e => e.equipmentHours);
        const instantaneous = monthPlanPowerData.map(e => dataFormats(divideFormarts(e.instantaneous, 'MJ'), '--', 2, true)); // 辐射值
        const filterInstantaneous = monthPlanPowerData.filter(e => e.instantaneous);
        const powerGraphic = !loading && (filterMonthPower.length === 0 && filterMonthPlanPower.length === 0 && filterInstantaneous.length === 0
        );
        const chartsBox = document.getElementById('monthPlanPowerChart');
        let powerDiagram = echarts.init(chartsBox, themeConfig[theme]);
        if (powerDiagram) {
            powerDiagram.dispose();
            powerDiagram = echarts.init(chartsBox, themeConfig[theme]);
        }
        chartsLoading(powerDiagram, loading, theme);
        const graphic = chartsNodata(!powerGraphic, theme);
        const powerOption = {
            graphic: graphic,
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
                        paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"> </span> 
                        ${item.seriesName} :  ${item.value}</div>`;
                    });
                    return (
                        `<div class=${styles.tooltipBox}>
                            <div class=${styles.axisValue}>${params[0].name}</div>
                            <div class=${styles.tooltipContainer}> ${paramsItem}</div>
                        </div>`
                    );
                },
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: monthPlanPowerData && monthPlanPowerData.map(e => e.month),
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
                    color: this.themeColor[theme]['monthPower'],
                    areaStyle: {
                        color: this.themeColor[theme]['monthPower'],
                    },
                    symbol: 'none',
                },
                {
                    name: '计划发电量',
                    type: 'line',
                    smooth: true,
                    data: getDefaultData(monthPlanPowers),
                    yAxisIndex: 0,
                    color: this.themeColor[theme]['monthPlanPowers'],
                    areaStyle: {
                        color: this.themeColor[theme]['monthPlanPowers'],
                    },
                    z: 1,
                    symbol: 'none',
                },
                {
                    name: '累计辐射',
                    type: 'line',
                    data: getDefaultData(instantaneous),
                    yAxisIndex: 1,
                    color: this.themeColor[theme]['instantaneous'],
                },
            ],
        };
        powerDiagram.setOption(powerOption, 'notMerge');
        powerDiagram.resize();
    }

    render() {
        return (
            <div id="monthPlanPowerChart" style={{ width: 440, height: 278 }}></div>
        );
    }

}





export default MonthPlanPower;
