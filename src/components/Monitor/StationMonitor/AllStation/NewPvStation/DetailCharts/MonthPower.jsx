import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Link } from 'react-dom';
import { dataFormats, getDefaultData } from '../../../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../../../constants/echartsNoData.js';
import { divideFormarts, chartPowerPoint } from '../../../PvCommon/PvDataformat';
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
        const equipmentHoursObj = [{
            name: '利用小时(h)',
            type: 'value',
            axisLabel: {
                formatter: '{value}',
            },
            splitLine: {
                show: false,
            },
        }];
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
            {
                name: '完成率',
                type: 'value',
                offset: 40,
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

    seriesType = ({ monthPower, monthPlanPower, completeRate, equipmentHours }) => { // 根据不同的类型，series不同
        const { chartType } = this.state;
        const monthPowerObj = [{
            name: '月发电量',
            type: 'bar',
            color: '#3e97d1',
            data: getDefaultData(monthPower),
            yAxisIndex: 0,
            barWidth: 6,
        }, {
            name: '计划发电量',
            type: 'bar',
            color: '#fbe6e3',
            data: getDefaultData(monthPlanPower),
            yAxisIndex: 0,
            barWidth: 6,
        }, {
            name: '完成率',
            type: 'line',
            color: '#199475',
            data: getDefaultData(completeRate),
            yAxisIndex: 2,
        }];
        const equipmentHoursObj = [{
            name: '利用小时',
            type: 'bar',
            color: '#c7ceb2',
            barWidth: 6,
            data: getDefaultData(equipmentHours),
        }];
        return chartType === 'monthPower' ? monthPowerObj : equipmentHoursObj;
    }

    drawCharts = (params) => {
        const { monthPowerData = [], powerUnit, loading } = params;
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
        ) ? showNoData : hiddenNoData;
        const monthPowerChart = echarts.init(document.getElementById('powerChart'), 'darkTheme');
        // loading ? monthPowerChart.showLoading('default', { color: '#199475' }) : monthPowerChart.hideLoading();
        monthPowerChart.resize();
        const lineColor = '#dfdfdf';
        const fontColor = '#666';
        const yAxisType = this.yAxisType(powerUnit);
        const seriesType = this.seriesType({ monthPower, monthPlanPower, completeRate, equipmentHours });
        const powerOption = {
            graphic: powerGraphic,
            title: {
                text: '月发电量与利用小时（截止昨天）',
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
            yAxis: [
                ...yAxisType,
                {
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
                        <RadioButton value={'equipmentHours'} key={'equipmentHours'}>利用小时</RadioButton>
                    </RadioGroup>
                </div>
                {/* <a href={'javascript:void(0)'} className={styles.link}><i className="iconfont icon-more"></i></a> */}
            </div>
        );
    }

}





export default MonthPower;
