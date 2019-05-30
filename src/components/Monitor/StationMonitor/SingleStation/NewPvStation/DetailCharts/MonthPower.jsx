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

    componentDidUpdate(prevProps, prevState) { // 数据重新请求后重绘。
        const { powerTime, loading, intervalTime } = this.props;
        const preTime = prevProps.powerTime;
        if (powerTime !== preTime || prevState.intervalTime !== intervalTime) {
            this.drawCharts(this.props);
        }
    }

    onChangeTimePower = (e) => { // 改变 日／月／年
        const { stationCode } = this.props;
        const intervalTime = e.target.value;
        setTimeout(() => { this.setState({ intervalTime }) }, 0)
        this.props.onChange({ stationCode, intervalTime });
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
        let { powerData = [], powerUnit, loading } = params;
        const { intervalTime } = this.state;
        const actualPower = powerData.map(e => chartPowerPoint(divideFormarts(e.actualPower, powerUnit), '--', 2, true));  // 发电量
        const filterMonthPower = powerData.filter(e => e.actualPower);
        const theoryPower = powerData.map(e => chartPowerPoint(divideFormarts(e.theoryPower, powerUnit), '--', 2, true)); // 计划发电量
        const filterMonthPlanPower = powerData.filter(e => e.theoryPower);
        const instantaneous = powerData.map(e => dataFormats(divideFormarts(e.instantaneous, 'MJ'), '--', 2, true)); // 辐射值
        const filterInstantaneous = powerData.filter(e => e.instantaneous);
        const completeRate = powerData.map(e => dataFormats(e.completeRate, '--', 2, true));  // 完成率
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
                bottom: intervalTime === 0 ? 60 : 40,
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
                    data: powerData.map(e => e.time),
                    axisLine: {
                        lineStyle: {
                            color: lineColor,
                        },
                    },
                    axisLabel: {
                        color: fontColor,
                        interval: 0,
                        formatter: (value) => {
                            const { intervalTime } = this.state;
                            if (intervalTime === 0) {
                              return moment(value).format('MM-DD');
                            }
                            if (intervalTime === 1) {
                                return moment(value).format('MM');
                            }
                            if (intervalTime === 2) {
                                return moment(value).format('YYYY');
                            }
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
            dataZoom: [{
                type: 'slider',
                show:intervalTime===0,
                realtime: intervalTime===0,
                filterMode: 'filter',
                startValue: powerData.length > 0 && powerData.length - 7,
                endValue: powerData.length > 0 && powerData.length - 1,
                bottom: 15,
                handleSize: '80%',
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                backgroundColor: 'rgba(213,219,228,.8)',
                height: '11px',
                zoomLock: true,
                handleStyle: {
                    width: '16px',
                    height: '16px',
                    borderRadius: '100%',
                    color: '#fff',
                    shadowBlur: 3,
                }
            }],
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