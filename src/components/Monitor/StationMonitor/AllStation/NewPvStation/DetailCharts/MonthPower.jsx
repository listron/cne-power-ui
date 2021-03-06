import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Link } from 'react-dom';
import { dataFormats, getDefaultData } from '../../../../../../utils/utilFunc';
import { divideFormarts, chartPowerPoint } from '../../../PvCommon/PvDataformat';
import { Gradient1, Gradient2, barRadius, chartsLoading, themeConfig, chartsNodata } from '../../../../../../utils/darkConfig';
import moment from 'moment';
import styles from './detailCharts.scss';
import { Radio } from 'antd';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class MonthPower extends Component {
    static propTypes = {
        scatterData: PropTypes.object,
        powerTime: PropTypes.number,
        onChange: PropTypes.func,
        powerUnit: PropTypes.string,
    }
    constructor() {
        super();
        this.state = {
            chartType: 'monthPower',
        };
    }
    componentDidMount() {
        this.drawCharts(this.props);
    }

    componentWillReceiveProps(nextProps) { // 数据重新请求后重绘。
        const { powerTime, loading } = this.props;
        const preTime = nextProps.powerTime;
        if (powerTime !== preTime) {
            this.drawCharts(nextProps);
        }
        if (this.props.theme !== nextProps.theme) {
            this.drawCharts(nextProps, true);
        }
    }

    onChangeTimePower = (e) => { // 改变 发电量和等效时
        const chartType = e.target.value;
        this.setState({ chartType }, () => {
            this.drawCharts(this.props);
        });
    }

    yAxisType = () => { // 左侧y轴的数据
        const { chartType } = this.state;
        const { powerUnit } = this.props;
        const raduis = {
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
        };
        const equipmentHoursObj = [{
            name: '等效时(h)',
            type: 'value',
            axisLabel: {
                formatter: '{value}',
            },
            splitLine: {
                show: false,
            },
        }, raduis];
        const monthPowerObj = [
            {
                name: `发电量(${powerUnit})`,
                type: 'value',
                position: 'left',
                axisLabel: {
                    formatter: '{value}',
                },
                splitLine: {
                    show: false,
                },
            },
            raduis,
            {
                name: '完成率',
                type: 'value',
                offset: 45,
                position: 'right',
                axisLabel: {
                    formatter: '{value}%',
                },
                nameTextStyle: {
                    padding: [0, 0, 0, 30],
                },
                splitLine: {
                    show: false,
                },
            }];
        return chartType === 'monthPower' ? monthPowerObj : equipmentHoursObj;
    }

    themeColor = {
        dark: {
            monthPower: Gradient1,
            monthPlanPower: Gradient2,
            completeRate: '#4d5fe2',
            equipmentHours: Gradient2,
        },
        light: {
            monthPower: '#3e97d1',
            monthPlanPower: '#FF9000', //#e08031 #fbe6e3  #f5c8c1
            completeRate: '#199475',
            equipmentHours: '#c7ceb2',
        },

    }
    // monthPlanPower: '',

    seriesType = ({ monthPower, monthPlanPower, completeRate, equipmentHours }) => { // 根据不同的类型，series不同
        const { chartType } = this.state;
        const { theme = 'light' } = this.props;
        const monthPowerObj = [{
            name: '月发电量',
            type: 'bar',
            color: this.themeColor[theme].monthPower,
            data: getDefaultData(monthPower),
            yAxisIndex: 0,
            barWidth: 6,
            ...barRadius,
        }, {
            name: '计划发电量',
            type: 'bar',
            color: this.themeColor[theme].monthPlanPower,
            data: getDefaultData(monthPlanPower),
            itemStyle: {
                color: this.themeColor[theme].monthPlanPower,
            },
            yAxisIndex: 0,
            barWidth: 6,
            ...barRadius,
        }, {
            name: '完成率',
            type: 'line',
            color: this.themeColor[theme].completeRate,
            data: getDefaultData(completeRate),
            yAxisIndex: 2,
        }];
        const equipmentHoursObj = [{
            name: '等效时',
            type: 'bar',
            color: this.themeColor[theme].equipmentHours,
            barWidth: 6,
            data: getDefaultData(equipmentHours),
            ...barRadius,
        }];
        return chartType === 'monthPower' ? monthPowerObj : equipmentHoursObj;
    }




    drawCharts = (params, themeChange) => {
        const { monthPowerData = [], powerUnit, loading, theme } = params;
        const { chartType } = this.state;
        const monthPower = monthPowerData.map(e => chartPowerPoint(divideFormarts(e.monthPower, powerUnit), '--', 2, true)); // 发电量
        const filterMonthPower = monthPowerData.filter(e => e.monthPower);
        const monthPlanPower = monthPowerData.map(e => chartPowerPoint(divideFormarts(e.monthPlanPower, powerUnit), '--', 2, true)); // 计划发电量
        const filterMonthPlanPower = monthPowerData.filter(e => e.monthPlanPower);
        const equipmentHours = monthPowerData.map(e => dataFormats(e.equipmentHours, '--', 2, true)); // 利用小时
        const filterEquipmentHours = monthPowerData.filter(e => e.equipmentHours);
        const instantaneous = monthPowerData.map(e => dataFormats(divideFormarts(e.instantaneous, 'MJ'), '--', 2, true)); // 辐射值
        const filterInstantaneous = monthPowerData.filter(e => e.instantaneous);
        const completeRate = monthPowerData.map(e => dataFormats(e.completeRate, '--', 2, true)); // 完成率
        const powerGraphic = (filterMonthPower.length === 0 && filterMonthPlanPower.length === 0 && filterInstantaneous.length === 0
        );
        const graphic = chartsNodata(!powerGraphic, theme);
        let monthPowerChart = echarts.init(document.getElementById('powerChart'), themeConfig[theme]);
        if (themeChange) {
            monthPowerChart.dispose();
            monthPowerChart = echarts.init(document.getElementById('powerChart'), themeConfig[theme]);
        }
        chartsLoading(monthPowerChart, loading, theme);
        const yAxisType = this.yAxisType(powerUnit);
        const seriesType = this.seriesType({ monthPower, monthPlanPower, completeRate, equipmentHours });
        const powerOption = {
            graphic: graphic,
            title: {
                text: '月发电量与等效时（截止昨天）',
                top: 8,
                left: 10,
            },
            grid: {
                right: chartType === 'monthPower' ? '20%' : '13%',
                top: 100,
                left: '13%',
                bottom: 40,
            },
            legend: {
                left: 'center',
                top: 42,
                itemWidth: 10,
                itemHeight: 5,
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    let paramsItem = '';
                    params.forEach(item => {
                        const color = item.color.colorStops && item.color.colorStops[1].color || item.color;
                        paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"> </span> 
                        ${item.seriesName} :  ${item.value}${item.seriesName === '完成率' && '%' || ''}</div>`;
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
                    snap: true,
                },
            },

            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    data: monthPowerData.map(e => e.date),
                    axisLabel: {
                        interval: 0,
                        formatter: (value) => {
                            return moment(value).format('MM');
                        },
                    },
                    axisTick: { show: false },
                    boundaryGap: true,
                },
            ],
            yAxis: yAxisType,
            series: [
                ...seriesType,
                {
                    name: '累计辐射',
                    type: 'line',
                    data: getDefaultData(instantaneous),
                    color: '#f9b600',
                    yAxisIndex: 1,
                },
            ],
        };
        monthPowerChart.setOption(powerOption, 'notMerge');
    }

    render() {
        const productionAnalysis = '#/statistical/stationaccount/production';
        return (
            <div className={styles.powerDiagramBox} >
                <div id="powerChart" style={{ display: 'flex', flex: 1 }} className={styles.powerChart}></div>
                <div className={styles.powerRadio}>
                    <RadioGroup defaultValue={'monthPower'} size="small" onChange={this.onChangeTimePower} >
                        <RadioButton value={'monthPower'} key={'monthPower'} >发电量</RadioButton>
                        <RadioButton value={'equipmentHours'} key={'equipmentHours'}>等效时</RadioButton>
                    </RadioGroup>
                </div>
                {/* <a href={'javascript:void(0)'} className={styles.link}><i className="iconfont icon-more"></i></a> */}
            </div>
        );
    }

}





export default MonthPower;
