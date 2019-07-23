import React, { useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { Link } from 'react-dom';
import { dataFormats, numWithComma, getDefaultData } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData.js';
import moment from 'moment';
import styles from './windCommon.scss';
import { Radio } from 'antd';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class PowerDiagram extends Component {
    static propTypes = {
        scatterData: PropTypes.object,
        powerTime: PropTypes.number,
        onChange: PropTypes.func,
    }
    constructor() {
        super();
        this.state = {
            intervalTime: 0,
        }
    }
    componentDidMount() {
        this.drawCharts(this.props)
    }

    componentDidUpdate(prevProps) {
        const { powerTime, loading } = this.props;
        const preTime = prevProps.powerTime;
        if (powerTime !== preTime || loading !== prevProps.loading) { // 数据重新请求后重绘。
            this.drawCharts(this.props);
        }
    }

    onChangeTimePower = (e) => { // 改变 日／月／年
        const intervalTime = e.target.value;
        this.setState({ intervalTime });
        this.props.onChange({ intervalTime })
        // this.drawCharts({ powerData: [],loading:false })
    }

    unitFormarts = (data, quantity) => {
        if (isNaN(data) || (!data && data !== 0)) {
            return '--';
        }
        return data / quantity
    }

    drawCharts = (params) => {
        let { powerData, loading } = params;
        const { intervalTime } = this.state;
        const actualPower = powerData.map(e => dataFormats(this.unitFormarts(e.actualPower, 10000), '--', 2, true));  // 实际发电量
        const filterActualPower = powerData.filter(e => e.actualPower);
        const theoryPower = powerData.map(e => dataFormats(this.unitFormarts(e.theoryPower, 10000), '--', 2, true)); // 计划发电量
        const filterTheoryPower = powerData.filter(e => e.theoryPower);
        const instantaneous = powerData.map(e => dataFormats(e.instantaneous, '--', 2, true)); // 风速／累计曝幅值
        const filterInstantaneous = powerData.filter(e => e.instantaneous);
        const completeRate = powerData.map(e => dataFormats(e.completeRate, '--', 2, true));  // 完成率
        const powerGraphic = (filterActualPower.length === 0 && filterTheoryPower.length === 0 && !loading && filterInstantaneous.length === 0
        ) ? showNoData : hiddenNoData;
        const chartsBox = document.getElementById('powerDiagram');
        const powerDiagram = echarts.init(chartsBox);
        loading ? powerDiagram.showLoading('default', { color: '#199475' }) : powerDiagram.hideLoading();
        const lineColor = '#666';
        let color = color = ['#a42b2c', '#c7ceb2', '#3e97d1', '#199475'];
        const powerOption = { //实际发电量 计划发电量
            graphic: powerGraphic,
            color: color,
            title: {
                text: '发电量',
                textStyle: {
                    color: lineColor,
                    fontSize: 14,
                    fontWeight: 'normal',
                },
                top: 8,
                left: 10,
            },
            grid: {
                // right: 15,
                // top: 70,
                // left:15,
                // bottom:45,
                // containLabel:true,
                right: 60,
                top: 70,
                left: 68,
            },
            legend: {
                left: 'center',
                bottom: 10,
                textStyle: {
                    color: lineColor,
                },
                itemWidth: 10,
                itemHeight: 5,
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fff',
                textStyle: {
                    color: lineColor,
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
                    boundaryGap: false,
                    data: powerData && powerData.map(e => intervalTime === 0 ? moment(e.time).format('MM-DD') : e.time),
                    axisLine: {
                        lineStyle: {
                            color: '#dfdfdf',
                        },
                    },
                    axisLabel: {
                        color: lineColor,
                        interval: 0,
                        // rotate:20,
                    },
                    axisTick: { show: false },
                    boundaryGap: [true, true],
                }
            ],
            yAxis: [
                {
                    name: '电量(万kWh)',
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                        color: lineColor,
                        margin: 4,
                    },
                    nameTextStyle: {
                        color: lineColor,
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#f1f1f1',
                            type: 'dotted',
                        }
                    }
                }, {
                    name: '平均风速(m/s)',
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                        color: lineColor,
                        margin: 4,
                    },
                    nameTextStyle: {
                        color: lineColor,
                        padding: [0, 80, 0, 0],
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#f1f1f1',
                            type: 'dotted',
                        }
                    }
                }, {
                    name: '完成率',
                    type: 'value',
                    offset: 17,
                    axisLabel: {
                        formatter: '{value}%',
                        color: lineColor,
                    },
                    nameTextStyle: {
                        color: lineColor,
                        padding: [0, 0, 0, 30],
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#dfdfdf',
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    }
                }
            ],
            series: [
                {
                    name: '实际发电量',
                    type: 'bar',
                    color: '#a42b2c',
                    data: getDefaultData(actualPower),
                    barWidth: 14,
                },
                {
                    name: '计划发电量',
                    type: 'bar',
                    data: getDefaultData(theoryPower),
                    color: '#c7ceb2',
                    barWidth: 14,
                },
                {
                    name: '平均风速',
                    type: 'line',
                    data: getDefaultData(instantaneous),
                    color: '#3e97d1',
                    yAxisIndex: 1,
                }, {
                    name: '完成率',
                    type: 'line',
                    color: '#199475',
                    data: getDefaultData(completeRate),
                    yAxisIndex: 2,
                }
            ]
        }
        if (intervalTime === 0) { // 日 不显示部分坐标轴与数据。
            powerOption.yAxis[1].nameTextStyle.padding = 0;
            powerOption.yAxis = powerOption.yAxis.filter(e => e.name !== '完成率');
            powerOption.series = powerOption.series.filter(e => e.name !== '计划发电量' && e.name !== '完成率');
        }
        powerDiagram.setOption(powerOption, 'notMerge');
        powerDiagram.resize();
    }

    render() {
        const productionAnalysis = `#/statistical/stationaccount/production`;
        return (
            <div className={styles.powerDiagramBox} >
                <div id="powerDiagram" style={{ display: 'flex', flex: 1 }}></div>
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





export { PowerDiagram }