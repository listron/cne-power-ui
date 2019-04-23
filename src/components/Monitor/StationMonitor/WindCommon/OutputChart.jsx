import React from 'react';
import echarts from 'echarts';
import { Link } from 'react-dom';
import { dataFormats, numWithComma } from '../../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData.js';
import moment from 'moment';
import styles from './windCommon.scss';


const OutputChart = ({ ...rest }) => {
    const { capabilityData, yAxisUnit } = rest;
    let yAxisType = `功率(${yAxisUnit})`
    const chartsBox = document.getElementById('capabilityDiagram');
    const capabilityPower = capabilityData.map(e => dataFormats(e.stationPower, '--', 2, true));
    const capabilityRadiation = capabilityData.map(e => dataFormats(e.instantaneous, '--', 2, true));
    const filterCapabilityPower = capabilityData.filter(e => e.stationPower);
    const filterCapabilityRadiation = capabilityData.filter(e => e.instantaneous);
    const capabilityGraphic = (filterCapabilityPower.length === 0 && filterCapabilityRadiation.length === 0) ? showNoData : hiddenNoData;
    if (chartsBox) {
        const capabilityDiagram = echarts.init(chartsBox);
        const lineColor = '#666';
        const color = ['#c57576', '#3e97d1'];
        const fontColor = '#333';
        let labelInterval = 47 // 10min数据如果不缺失，此时为6(每小时6条)*8(8小时) - 1(除去间隔本身) = 47 个展示一个
        const totalLength = capabilityData.length;
        if (totalLength < 144 && totalLength > 0) { //假如返回数据不全
            labelInterval = parseInt(totalLength / 3) - 1;
        }
        const minPower = Math.min(...capabilityPower);
        const minRadiation = Math.min(...capabilityRadiation);
        const capabilityOption = {//出力图
            graphic: capabilityGraphic,
            title: {
                text: '出力图',
                textStyle: {
                    color: fontColor,
                    fontSize: 14,
                    fontWeight: 'normal',
                },
                top: 8,
                left: 10,
            },
            legend: {
                left: 'center',
                bottom: 10,
                textStyle: {
                    color: lineColor,
                    fontSize: 12,
                },
                itemWidth: 24,
                itemHeight: 6,
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: { color: '#666' },
                },
                backgroundColor: '#fff',
                textStyle: {
                    color: 'rgba(0, 0, 0, 0.65)',
                    fontSize: 12,
                },
                // alwaysShowContent:true,
                extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
                padding: 0,
                formatter: param => {
                    let paramsItem = '';
                    param.map((item) => {
                        return paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${item.color}"> </span> 
                      ${item.seriesName} ${item.value}  </div>`
                    });
                    return (
                        `<div class=${styles.tooltipBox}>
                            <div class=${styles.axisValue}>${param[0].axisValue}</div>
                            <div class=${styles.tooltipContainer}> ${paramsItem}</div>
                        </div>`
                    )
                },
            },
            color: color,
            calculable: true,
            xAxis: {
                type: 'category',
                splitNumber: 4,
                boundaryGap: false,
                data: capabilityData && capabilityData.map(e => {
                    return moment(moment.utc(e.utc).toDate()).format('MM-DD HH:mm');
                }),
                axisLine: {
                    lineStyle: {
                        color: '#dfdfdf',
                    },
                },
                axisLabel: {
                    color: lineColor,
                    interval: labelInterval,
                },
                axisTick: {
                    show: false,
                },
                axisPointer: {
                    label: {
                        show: false,
                    }
                },
            },
            yAxis: [
                {
                    name: yAxisType,
                    type: 'value',
                    min: minPower < 0 ? minPower : 0,
                    axisLabel: {
                        formatter: '{value}',
                        color: lineColor,
                    },
                    nameTextStyle: {
                        color: lineColor,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#dfdfdf',
                        },
                    },
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                },
                {
                    name: '风速(m/s)',
                    type: 'value',
                    min: minRadiation < 0 ? minRadiation : 0,
                    axisLabel: {
                        formatter: '{value}',
                        color: lineColor,
                    },
                    nameTextStyle: {
                        color: lineColor,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#dfdfdf',
                        },
                    },
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                }
            ],
            series: [
                {
                    name: '功率',
                    type: 'line',
                    smooth: true,
                    data: capabilityPower,
                    yAxisIndex: 0,
                    areaStyle: {
                        color: '#fff2f2',
                    },
                },
                {
                    name: '风速',
                    type: 'line',
                    data: capabilityRadiation,
                    yAxisIndex: 1,
                    lineStyle: {
                        type: 'dotted',
                    },
                }
            ]
        }
        capabilityDiagram.setOption(capabilityOption,'notMerge');
        capabilityDiagram.resize();
    }

    const resourceAnalysis = `#/statistical/stationaccount/resource`;
    return (
        <div className={styles.capabilityBox}>
            <div id="capabilityDiagram" className={styles.capabilityDiagram}></div>
            {/* <a href={'javascript:void(0)'} className={styles.link}><i className="iconfont icon-more"></i></a> */}
        </div>
    )
}




export { OutputChart }