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
        // stationCode: PropTypes.number,
    }
    constructor() {
        super();
        this.state = {
            intervalTime: 0
        }
    }
    componentDidMount() {
        this.drawCharts(this.props)
    }

    componentDidUpdate(prevProps,prevState){ // 数据重新请求后重绘。
        const { powerTime, loading,intervalTime } = this.props;
        const preTime = prevProps.powerTime;
        if (powerTime !== preTime || prevState.intervalTime !==intervalTime) {
            this.drawCharts(this.props);
        }
    }

    onChangeTimePower = (e) => { // 改变 日／月／年
        const {stationCode} =this.props;
        const intervalTime = e.target.value;
        setTimeout(()=>{this.setState({ intervalTime })},0)
        this.props.onChange({ stationCode,intervalTime });
    }

    yAxisType = () => { // 左侧y轴的数据
        const { intervalTime } = this.state;
        const lineColor = '#dfdfdf';
        const fontColor = '#666';
        const dayObj = []
        const monthObj = [
            {
                name: '完成率',
                type: 'value',
                offset: 40,
                position: 'right',
                axisLabel: {
                    formatter: '{value}%',
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
                    // show: false,
                    color: lineColor,
                },
                splitLine: {
                    show: false,
                }
            }]; 
        return intervalTime === 0 ? dayObj : monthObj;
    }

    seriesType = ({ actualPower, theoryPower, completeRate }) => { // 根据不同的类型，series不同
        const { intervalTime } = this.state;
        const dayObj = [{
            name: '实际发电量',
            type: 'bar',
            color: '#3e97d1',
            data: getDefaultData(actualPower),
            yAxisIndex: 0,
            barWidth: 6,
        }];
        const monthObj = [{
            name: '实际发电量',
            type: 'bar',
            color: '#3e97d1',
            data: getDefaultData(actualPower),
            yAxisIndex: 0,
            barWidth: 6,
        }, {
            name: '计划发电量',
            type: 'bar',
            color: '#fbe6e3',
            data: getDefaultData(theoryPower),
            yAxisIndex: 0,
            barWidth: 6,
        }, {
            name: '完成率',
            type: 'line',
            color: '#199475',
            data: getDefaultData(completeRate),
            yAxisIndex: 2,
        }];
        return intervalTime === 0 ? dayObj : monthObj;
    }

    drawCharts = (params) => {
        let { monthPowerData = [], powerUnit, loading } = params;
        const { intervalTime } = this.state;
        const actualPower = monthPowerData.map(e => chartPowerPoint(divideFormarts(e.actualPower, powerUnit), '--', 2, true));  // 发电量
        const filterMonthPower = monthPowerData.filter(e => e.actualPower);
        const theoryPower = monthPowerData.map(e => chartPowerPoint(divideFormarts(e.theoryPower, powerUnit), '--', 2, true)); // 计划发电量
        const filterMonthPlanPower = monthPowerData.filter(e => e.theoryPower);
        const instantaneous = monthPowerData.map(e => dataFormats(divideFormarts(e.instantaneous, 'MJ'), '--', 2, true)); // 辐射值
        const filterInstantaneous = monthPowerData.filter(e => e.instantaneous);
        const completeRate = monthPowerData.map(e => dataFormats(e.completeRate, '--', 2, true));  // 完成率
        const powerGraphic = (filterMonthPower.length === 0 && filterMonthPlanPower.length === 0 && filterInstantaneous.length === 0
        ) ? showNoData : hiddenNoData;
        const monthPowerChart = echarts.init(document.getElementById('powerChart'));
        // loading ? monthPowerChart.showLoading('default', { color: '#199475' }) : monthPowerChart.hideLoading();
        monthPowerChart.resize();
        const lineColor = '#dfdfdf';
        const fontColor = '#666';
        const yAxisType = this.yAxisType(powerUnit);
        const seriesType = this.seriesType({ actualPower, theoryPower, completeRate });
        let powerOption = {
            graphic: powerGraphic,
            title: {
                text: '发电量（截止昨天）',
                textStyle: {
                    color: '#000',
                    fontSize: 14,
                    fontWeight: 'normal',
                },
                top: 8,
                left: 10,
            },
            grid: {
                right: intervalTime === 0 ? '13%' : '20%',
                top: 100,
                left: '13%',
                bottom: 40,
            },
            legend: {
                left: 'center',
                top: 42,
                textStyle: {
                    color: fontColor,
                },
                itemWidth: 10,
                itemHeight: 5,
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
                        ${item.seriesName} :  ${item.value}${item.seriesName === '完成率' && '%' || ''}</div>`
                    });
                    return (
                        `<div class=${styles.tooltipBox}>
                            <div class=${styles.axisValue}>${params[0].name}</div>
                            <div class=${styles.tooltipContainer}> ${paramsItem}</div>
                        </div>`
                    )
                }
            },
            axisPointer: {
                type: 'line',
                snap: true,
                lineStyle: {
                    width: 38,
                    color: 'rgba(150,150,150,0.3)'
                }
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    data: monthPowerData.map(e => e.date),
                    axisLine: {
                        lineStyle: {
                            color: lineColor,
                        },
                    },
                    axisLabel: {
                        color: fontColor,
                        interval: 0,
                        formatter: (value) => {
                            return moment(value).format('MM')
                        }
                    },
                    axisTick: { show: false },
                    boundaryGap: true,
                }
            ],
            yAxis: [
                ...yAxisType,
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
                    },
                    axisLine: {
                        lineStyle: {
                            color: lineColor,
                        },
                    },
                    axisTick: {
                        color: lineColor,
                    },
                    splitLine: {
                        show: false,
                    }
                },
                {
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
                    }
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
            ]
        }
        monthPowerChart.setOption(powerOption, 'notMerge');
    }

    render() {
        const productionAnalysis = `#/statistical/stationaccount/production`;
        return (
            <div className={styles.powerDiagramBox} >
                <div id="powerChart" style={{ display: 'flex', flex: 1 }} className={styles.powerChart}></div>
                <div className={styles.powerRadio}>
                    <RadioGroup defaultValue={0} size="small" onChange={this.onChangeTimePower} >
                        <RadioButton value={0}>日</RadioButton>
                        <RadioButton value={1}>月</RadioButton>
                        <RadioButton value={2}>年</RadioButton>
                    </RadioGroup>
                </div>
                {/* <a href={'javascript:void(0)'} className={styles.link}><i className="iconfont icon-more"></i></a> */}
            </div>
        )
    }

}





export default MonthPower