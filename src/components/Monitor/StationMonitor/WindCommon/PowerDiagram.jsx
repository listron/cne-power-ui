import React, { useState, useEffect } from 'react';
import echarts from 'echarts';
import { Link } from 'react-dom';
import { dataFormats, numWithComma, getDefaultData } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData.js';
import moment from 'moment';
import styles from './windCommon.scss';
import { Radio } from 'antd';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;


const PowerDiagram = ({ ...rest }) => {
    const { powerData, getRealMonitorPower, stopRealCharstData } = rest;
    const [intervalTime, setIntervalTime] = useState(0);
    useEffect(() => {
        let startTime = moment().subtract(5, 'day').format('YYYY-MM-DD')// 默认是6天前;
        if (intervalTime === 1) {
            startTime = moment().subtract(5, 'month').format('YYYY-MM-DD')
        } else if (intervalTime === 2) {
            startTime = moment().subtract(5, 'year').format('YYYY-MM-DD')
        }
        let endTime = moment().format('YYYY-MM-DD');
        stopRealCharstData('power');
        getRealMonitorPower({ intervalTime, startTime, endTime })
        return () => {
            stopRealCharstData('power');
        }
    }, [intervalTime]);

    const onChangeTimePower = (e) => { // 改变 日／月／年
        const intervalTime = e.target.value;
        setIntervalTime(intervalTime);
    }

    const unitFormarts = (data, quantity) => {
        if (isNaN(data) || (!data && data !== 0)) {
            return '--';
        }
        return data / quantity
    }

   
    const actualPower = powerData.map(e => dataFormats(unitFormarts(e.actualPower,10000), '--', 2, true));  // 实际发电量
    const filterActualPower = powerData.filter(e => e.actualPower);
    const theoryPower = powerData.map(e => dataFormats(unitFormarts(e.theoryPower,10000), '--', 2, true)); // 计划发电量
    const filterTheoryPower = powerData.filter(e => e.theoryPower);
    const instantaneous = powerData.map(e => dataFormats(e.instantaneous, '--', 2, true)); // 风速／累计曝幅值
    const filterInstantaneous = powerData.filter(e => e.instantaneous);
    const completeRate = powerData.map(e => dataFormats(e.completeRate, '--', 2, true));  // 完成率
    const powerGraphic = (filterActualPower.length === 0 && filterTheoryPower.length === 0 && filterInstantaneous.length === 0
    ) ? showNoData : hiddenNoData;
    const chartsBox = document.getElementById('powerDiagram');
    if (chartsBox) {
        const powerDiagram = echarts.init(chartsBox);
        powerData.length > 0 ? powerDiagram.hideLoading() : powerDiagram.showLoading('default', { color: '#199475' });
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
                right: 90,
                top: 70,
                left:70,
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
                        ${item.seriesName} :  ${item.value}${item.seriesName==='完成率' && '%'}</div>`
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
                        interval: 0
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
                    },
                    nameTextStyle: {
                        color: lineColor,
                        padding: [0, 30, 0, 0],
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
                    offset: 40,
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
            powerOption.grid.right = '10%';
            powerOption.yAxis[1].nameTextStyle.padding = 0;
            powerOption.yAxis = powerOption.yAxis.filter(e => e.name !== '完成率');
            powerOption.series = powerOption.series.filter(e => e.name !== '计划发电量' && e.name !== '完成率');
        }
        powerDiagram.setOption(powerOption, 'notMerge');
        powerDiagram.resize();
    }

    const productionAnalysis = `#/statistical/stationaccount/production`;
    return (
        <div className={styles.powerDiagramBox} >
            <div id="powerDiagram" style={{ display: 'flex', flex: 1 }}></div>
            <div className={styles.powerRadio}>
                <RadioGroup defaultValue={0} size="small" onChange={onChangeTimePower} >
                    <RadioButton value={0}>日</RadioButton>
                    <RadioButton value={1}>月</RadioButton>
                    <RadioButton value={2}>年</RadioButton>
                </RadioGroup>
            </div>
            {/* <a href={'javascript:void(0)'} className={styles.link}><i className="iconfont icon-more"></i></a> */}
        </div>
    )
}




export { PowerDiagram }