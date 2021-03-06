import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Link } from 'react-dom';
import { dataFormats, getDefaultData } from '../../../../../../utils/utilFunc';
import { divideFormarts, chartPowerPoint } from '../../../PvCommon/PvDataformat';
import { Gradient1, Gradient2, barRadius, chartsLoading, themeConfig, chartsNodata } from '../../../../../../utils/darkConfig';
import moment from 'moment';
import styles from './detailCharts.scss';

class DayPower extends Component {
    static propTypes = {
        powerTime: PropTypes.number,
        onChange: PropTypes.func,
        dayPowerData: PropTypes.array,
        powerUnit: PropTypes.string,
    }
    constructor() {
        super();
        this.state = {
            intervalTime: 0,
        };
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
        if (this.props.theme !== prevProps.theme) {
            this.drawCharts(this.props, true);
        }
    }


    themeColor = {
        dark: {
            dayPower: Gradient1,
            equipmentHours: Gradient2,
            instantaneous: '#f8b14e',
        },
        light: {
            dayPower: '#199475',
            equipmentHours: '#c7ceb2',
            instantaneous: '#f9b600',
        },

    }

    drawCharts = (params, themeChange) => {
        const { dayPowerData = [], powerUnit, loading, theme } = params;
        const dayPower = dayPowerData.map(e => chartPowerPoint(divideFormarts(e.dayPower, powerUnit), '--', 2, true)); // 发电量
        const filterDayPower = dayPowerData.filter(e => e.dayPower);
        const equipmentHours = dayPowerData.map(e => dataFormats(e.equipmentHours, '--', 2, true)); // 等日用小时
        const filterEquipmentHours = dayPowerData.filter(e => e.equipmentHours);
        const instantaneous = dayPowerData.map(e => dataFormats(divideFormarts(e.instantaneous, 'MJ'), '--', 2, true)); // 辐射值
        const filterInstantaneous = dayPowerData.filter(e => e.instantaneous);
        const powerGraphic = (filterDayPower.length === 0 && filterEquipmentHours.length === 0 && filterInstantaneous.length === 0
        );
        const graphic = chartsNodata(!powerGraphic, theme);
        const chartsBox = document.getElementById('powerDiagram');
        let powerDiagram = echarts.init(chartsBox, themeConfig[theme]);
        if (themeChange) {
            powerDiagram.dispose();
            powerDiagram = echarts.init(chartsBox, themeConfig[theme]);
        }
        chartsLoading(powerDiagram, loading, theme);
        let color = color = ['#a42b2c', '#c7ceb2', '#3e97d1', '#199475'];
        const powerOption = {
            graphic: graphic,
            color: color,
            title: {
                text: '日发电量与等效时',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'normal',
                },
                top: 8,
                left: 10,
            },
            legend: {
                left: 'center',
                top: 30,
                itemWidth: 10,
                itemHeight: 5,
            },
            grid: {
                top: 85,
                left: '20%',
                right: '10%',
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
                    type: 'shadow',
                },
            },

            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    data: dayPowerData && dayPowerData.map(e => e.date),
                    axisLabel: {
                        interval: 0,
                        formatter: (value) => {
                            return moment(value).format('MM-DD');
                        },
                    },
                    axisTick: { show: false },
                    // boundaryGap: [true, true],
                },
            ],
            yAxis: [
                {
                    name: '等效时(h)',
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                    },
                    nameTextStyle: {
                        padding: [0, 10, 0, 0],
                    },
                    offset: 50,
                    splitLine: {
                        show: false,
                    },
                }, {
                    name: `发电量(${powerUnit})`,
                    type: 'value',
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}',
                    },
                    nameTextStyle: {
                        padding: [0, 0, 0, 50],
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
            dataZoom: [{
                type: 'slider',
                realtime: true,
                filterMode: 'filter',
                startValue: dayPower.length > 0 && dayPower.length - 7,
                endValue: dayPower.length > 0 && dayPower.length - 1,
                bottom: 15,
                handleSize: '80%',
                showDetail: false,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                // backgroundColor: 'rgba(213,219,228,.8)',
                // handleIcon:'none',
                height: '11px',
                zoomLock: true,
                handleStyle: {
                    width: '16px',
                    height: '16px',
                    borderRadius: '100%',
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                },
            }],
            series: [
                {
                    name: '日发电量',
                    type: 'bar',
                    color: this.themeColor[theme].dayPower,
                    data: getDefaultData(dayPower),
                    barWidth: 6,
                    yAxisIndex: 1,
                    ...barRadius,
                },
                {
                    name: '日等效时',
                    type: 'bar',
                    data: getDefaultData(equipmentHours),
                    color: this.themeColor[theme].equipmentHours,
                    barWidth: 6,
                    yAxisIndex: 0,
                    ...barRadius,
                },
                {
                    name: '累计辐射',
                    type: 'line',
                    data: getDefaultData(instantaneous),
                    color: this.themeColor[theme].instantaneous,
                    yAxisIndex: 2,
                },
            ],
        };
        powerDiagram.setOption(powerOption, 'notMerge');
        powerDiagram.resize();
    }

    render() {
        const productionAnalysis = '#/statistical/stationaccount/production';
        return (
            <div id="powerDiagram" style={{ display: 'flex', flex: 1 }}></div>
        );
    }

}


export default DayPower;
