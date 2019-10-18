import React, { Component } from 'react';
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
        match: PropTypes.object,
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

    componentDidUpdate(prevProps, prevState) { // 数据重新请求后重绘。
        const { powerTime, theme } = this.props;
        const preTime = prevProps.powerTime;
        if (powerTime !== preTime || prevState.intervalTime !== this.state.intervalTime || prevProps.theme !== theme) {
            this.drawCharts(this.props);
        }
        const { stationCode } = prevProps;
        const nextStationCode = this.props.stationCode;
        if (nextStationCode !== stationCode) {
            this.setState({ intervalTime: 0 });
        }
    }

    onChangeTimePower = (e) => { // 改变 日／月／年
        const { stationCode } = this.props;
        const intervalTime = e.target.value;
        setTimeout(() => { this.setState({ intervalTime }); }, 0);
        this.props.onChange({ stationCode, intervalTime });
    }

    yAxisType = () => { // 左侧y轴的数据
        const { intervalTime } = this.state;
        const dayObj = [];
        const monthObj = [
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
        return intervalTime === 0 ? dayObj : monthObj;
    }

    themeColor = {
        dark: {
            actualPower: Gradient1,
            theoryPower: Gradient2,
            completeRate: '#4d5fe2',
            instantaneous: '#f8b14e',
        },
        light: {
            actualPower: '#3e97d1',
            theoryPower: '#fbe6e3',
            completeRate: '#199475',
            instantaneous: '#f9b600',
        },

    }

    seriesType = ({ actualPower, theoryPower, completeRate, theme }) => { // 根据不同的类型，series不同
        const { intervalTime } = this.state;
        const dayObj = [{
            name: '实际发电量',
            type: 'bar',
            color: this.themeColor[theme]['actualPower'],
            data: getDefaultData(actualPower),
            yAxisIndex: 0,
            barWidth: 6,
            ...barRadius,
        }];
        const monthObj = [{
            name: '实际发电量',
            type: 'bar',
            color: this.themeColor[theme]['actualPower'],
            data: getDefaultData(actualPower),
            yAxisIndex: 0,
            barWidth: 6,
            ...barRadius,
        }, {
            name: '计划发电量',
            type: 'bar',
            color: this.themeColor[theme]['theoryPower'],
            data: getDefaultData(theoryPower),
            yAxisIndex: 0,
            barWidth: 6,
            ...barRadius,
        }, {
            name: '完成率',
            type: 'line',
            color: this.themeColor[theme]['completeRate'],
            data: getDefaultData(completeRate),
            yAxisIndex: 2,
        }];
        return intervalTime === 0 ? dayObj : monthObj;
    }

    drawCharts = (params) => {
        const { powerData = [], powerUnit, loading, theme } = params;
        const { intervalTime } = this.state;
        const xData = powerData.map(e => e.time);
        const actualPower = powerData.map(e => chartPowerPoint(divideFormarts(e.actualPower, powerUnit), '--', 2, true)); // 发电量
        const filterMonthPower = powerData.filter(e => e.actualPower);
        const theoryPower = powerData.map(e => chartPowerPoint(divideFormarts(e.theoryPower, powerUnit), '--', 2, true)); // 计划发电量
        const filterMonthPlanPower = powerData.filter(e => e.theoryPower);
        const instantaneous = powerData.map(e => dataFormats(divideFormarts(e.instantaneous, 'MJ'), '--', 2, true)); // 辐射值
        const filterInstantaneous = powerData.filter(e => e.instantaneous);
        const completeRate = powerData.map(e => dataFormats(e.completeRate, '--', 2, true)); // 完成率
        const powerGraphic = !loading && (filterMonthPower.length === 0 && filterMonthPlanPower.length === 0 && filterInstantaneous.length === 0
        );

        let monthPowerChart = echarts.init(document.getElementById('powerChart'), themeConfig[theme]);
        if (monthPowerChart) {
            monthPowerChart.dispose();
            monthPowerChart = echarts.init(document.getElementById('powerChart'), themeConfig[theme]);
        }
        chartsLoading(monthPowerChart, loading, theme);
        const graphic = chartsNodata(!powerGraphic, theme);
        monthPowerChart.resize();
        const yAxisType = this.yAxisType(powerUnit);
        const seriesType = this.seriesType({ actualPower, theoryPower, completeRate, theme });
        const powerOption = {
            graphic: graphic,
            title: {
                text: '发电量（截止昨天）',
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
                itemWidth: 10,
                itemHeight: 5,
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    let paramsItem = '';
                    params.forEach(item => {
                        const color = item.color.colorStops && item.color.colorStops[1].color || item.color;
                        paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color}"></span>
                        ${item.seriesName}:${item.value}${item.seriesName === '完成率' && '%' || ''}</div>`;
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
                    data: xData,
                    axisLabel: {
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
                        },
                    },
                    axisTick: { show: false },
                    boundaryGap: true,
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
                    splitLine: {
                        show: false,
                    },
                },
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
                ...yAxisType,

            ],
            series: [
                ...seriesType,
                {
                    name: '累计辐射',
                    type: 'line',
                    data: getDefaultData(instantaneous),
                    color: this.themeColor[theme]['instantaneous'],
                    yAxisIndex: 1,
                },
            ],
        };

        if (intervalTime === 0) {
            powerOption.dataZoom = [{
                type: 'slider',
                show: true,
                realtime: true,
                filterMode: 'filter',
                startValue: powerData.length > 0 && powerData.length - 7,
                endValue: powerData.length > 0 && powerData.length - 1,
                bottom: 15,
                showDetail: false,
                handleSize: '80%',
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                // backgroundColor: 'rgba(213,219,228,.8)',
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
            }];
        }
        monthPowerChart.setOption(powerOption, 'notMerge');
    }

    render() {
        const productionAnalysis = '#/statistical/stationaccount/production';
        const { intervalTime } = this.state;
        return (
            <div className={styles.powerDiagramBox} >
                <div id="powerChart" style={{ display: 'flex', flex: 1 }} className={styles.powerChart}></div>
                <div className={styles.powerRadio}>
                    <RadioGroup defaultValue={0} size="small" onChange={this.onChangeTimePower} value={intervalTime}>
                        <RadioButton value={0}>日</RadioButton>
                        <RadioButton value={1}>月</RadioButton>
                        <RadioButton value={2}>年</RadioButton>
                    </RadioGroup>
                </div>
                {/* <a href={'javascript:void(0)'} className={styles.link}><i className="iconfont icon-more"></i></a> */}
            </div>
        );
    }

}





export default MonthPower;
