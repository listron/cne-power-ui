import React from "react";
import echarts from 'echarts';
import PropTypes from 'prop-types';
import { showNoData, hiddenNoData } from '../../../../constants/echartsNoData';

/* 
  1 必填   graphId 图表的id名
  2 必填   data
    xData=[];
    yData=[]  
  3 type 
    efficiency   设备转换效率
    duration  设备故障时长
    frequency  设备故障次数
    capacity   装机容量
*/

class Charts extends React.Component {
    static propTypes = {
        graphId: PropTypes.string,
        yAxisName: PropTypes.string,
        xAxisName: PropTypes.string,
        dateType: PropTypes.string,
        title: PropTypes.string,
    };

    constructor(props, context) {
        super(props, context)
    }

    componentDidMount() {
        this.drawChart(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.drawChart(nextProps);
    }

    getYaxisName = (type) => {
        let result = " ";
        switch (type) {
            case "efficiency":
                result = '转换效率(%)';
                break;
            case "duration":
                result = '故障时长(h)';
                break;
            case "frequency":
                result = '故障次数(次)';
                break;
            case "capacity":
                result = '装机容量(MW)';
                break;
            default:
                result = " ";
        }
        return result;
    };

    getColor = (type) => {
        let result = " ";
        switch (type) {
            case "efficiency":
                result = '#c7ceb2';
                break;
            case "duration":
                result = '#f9b600';
                break;
            case "frequency":
                result = '#3e97d1';
                break;
            case "capacity":
                result = '#199475';
                break;
            default:
                result = "";
        }
        return result;
    };

    getTitle = (type) => {
        let result = " ";
        switch (type) {
            case "efficiency":
                result = '各厂家设备转换效率对比图';
                break;
            case "duration":
                result = '各厂家设备故障时长对比图';
                break;
            case "frequency":
                result = '各厂家设备故障次数对比图';
                break;
            case "capacity":
                result = '各厂家装机容量对比图';
                break;
            default:
                result = "";
        }
        return result;
    };


    getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示
        const length = data.length;
        let replaceData = [];
        for (let i = 0; i < length; i++) { replaceData.push('--') }
        let realData = data.some(e => e || e === 0) ? data : replaceData;
        return realData
    }

    drawChart = (params) => {
        const { graphId, xData, yData, hasData, type } = params;
        const targetChart = echarts.init(document.getElementById(graphId));
        let color = this.getColor(type);
        const lineColor = '#f1f1f1';
        const fontColor = '#333';
        const confluenceTenMinGraphic = (hasData || hasData === false) && (hasData === true ? hiddenNoData : showNoData) || " ";
        const targetMonthOption = {
            graphic: confluenceTenMinGraphic,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: { color: fontColor },
                },
                backgroundColor: '#fff',
                padding: 10,
                textStyle: {
                    color: 'rgba(0, 0, 0, 0.65)',
                    fontSize: 12,
                },
                extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)',
                formatter: function (params) {
                    let paramsItem = '';
                    params.map((item, index) => {
                        return paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${color[index]}"> </span> 
            ${params[index].seriesName} :${params[index].value === 0 || params[index].value ? params[index].value : '--'}${(params[index].seriesName === '计划完成率' || params[index].seriesName === 'PR') && '%' || ''}
            </div>`
                    });
                    return `<div class=${styles.tooltipTitle}> ${params[0].name}</div>
           ${paramsItem}`
                }
            },
            title: {
                text: this.getTitle(type),
                left: '23',
                top: 'top',
                textStyle: {
                    color: fontColor,
                    fontSize: 14,
                    fontWeight: 'normal',
                }
            },
            color: this.getColor(type),
            grid: {
                right: '20%',
                left: '12%'
            },
            legend: {
                left: 'center',
                itemWidth: 8,
                itemHeight: 5,
            },
            xAxis: {
                type: 'category',
                data: xData,
                axisPointer: {
                    type: 'line',
                    snap: true,
                    lineStyle: {
                        width: 38,
                        color: 'rgba(150,150,150,0.3)'
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: lineColor,
                    }
                },
                axisLabel: {
                    color: fontColor,
                },
                axisTick: {
                    show: false,
                },
            },
            yAxis: [
                {
                    type: 'value',
                    name: this.getYaxisName(type),
                    axisLabel: { formatter: '{value}', color: fontColor },
                    nameTextStyle: { color: fontColor },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: lineColor,
                        }
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        lineStyle: {
                            color: lineColor,
                            type: 'dashed'
                        }
                    },
                }
            ],
            series: {
                name: this.getYaxisName(type),
                type: 'bar',
                data: this.getDefaultData(yData),
                itemStyle: { barBorderRadius: 3 },
                barWidth: 5,
            },
        };
        targetChart.setOption(targetMonthOption, { notMerge: true })
        targetChart.resize();
    }

    render() {
        const { graphId } = this.props;
        return (
            <div id={graphId}></div>
        )
    }
}

export default (Charts)
