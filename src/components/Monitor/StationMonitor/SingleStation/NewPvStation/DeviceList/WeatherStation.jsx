

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { dataFormats } from '../../../../../../utils/utilFunc';
import DeviceAlarmTable from '../../../DeviceMonitor/DeviceMonitorCommon/DeviceAlarmTable';
import moment from 'moment';
import echarts from 'echarts';
import { showNoData, hiddenNoData } from '../../../../../../constants/echartsNoData.js';

class WeatherStation extends Component {
    static propTypes = {
        getWeatherDetail: PropTypes.func,
        match: PropTypes.object,
    }

    constructor(props) {
        super(props);
        this.state = {
            alarmSwitch: false,
            firstLoad: true,
        }
    }

    componentDidMount() {
        const { stationCode } = this.props.match.params;
        this.getData(stationCode);
        this.drawChart(this.props)

    }

    componentWillReceiveProps(nextProps) {
        const { stationCode } = this.props.match.params;
        const nextParams = nextProps.match.params;
        const nextStation = nextParams.stationCode;
        const { radiationchartTime } = this.props;
        if (nextStation !== stationCode) {
            this.getData(nextStation);
        }
        if (radiationchartTime !== nextProps.radiationchartTime) {
            this.drawChart(nextProps)
        }
    }


    getData = stationCode => {
        this.props.getStationDeviceList({ stationCode, deviceTypeCode: 203 });//获取气象站的单设备数据
        this.props.getWeatherDetail({ stationCode })
        this.props.getRadiationchart({ stationCode })
    }

    drawChart = (params) => {
        // let { radiationchartData = [] } = params;
        const radiationchartData = [
            { hour: '01:00', instantaneous: Math.random() * 1000 },
            { hour: '02:00', instantaneous: Math.random() * 1000 },
            { hour: '03:00', instantaneous: Math.random() * 1000 },
            { hour: '04:00', instantaneous: Math.random() * 1000 },
            { hour: '05:00', instantaneous: Math.random() * 1000 },
            { hour: '06:00', instantaneous: Math.random() * 1000 },
            { hour: '07:00', instantaneous: Math.random() * 1000 },
            { hour: '08:00', instantaneous: Math.random() * 1000 },
            { hour: '11:00', instantaneous: Math.random() * 1000 },
            { hour: '12:00', instantaneous: Math.random() * 1000 },
            { hour: '23:00', instantaneous: Math.random() * 1000 },
            { hour: '24:00', instantaneous: Math.random() * 1000 },
        ]
        const instantaneous = radiationchartData.map(e => dataFormats(e.instantaneous, '--', 2, true)); // 辐射值
        const filterInstantaneous = radiationchartData.filter(e => e.instantaneous);
        const powerGraphic = (filterInstantaneous.length === 0) ? showNoData : hiddenNoData;
        const chartsBox = document.getElementById('radiationchart');
        const powerDiagram = echarts.init(chartsBox);
        const lineColor = '#dfdfdf';
        const fontColor = '#666';
        let color = ['#f9b600'];
        const powerOption = {
            graphic: powerGraphic,
            color: color,
            grid: {
                top: 40,
                left: '8%',
                right: '8%',
                bottom: 40,
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
                        ${item.seriesName} :  ${item.value}</div>`
                    });
                    return (
                        `<div class=${styles.tooltipBox}>
                            <div class=${styles.axisValue}>${params[0].name}</div>
                            <div class=${styles.tooltipContainer}> ${paramsItem}</div>
                        </div>`
                    )
                }
            },
           
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: radiationchartData && radiationchartData.map(e => e.hour),
                    axisLine: {
                        lineStyle: {
                            color: '#dfdfdf',
                        },
                    },
                    axisLabel: {
                        color: fontColor,
                        interval: 0,
                    },
                    axisTick: { show: false },
                }
            ],
            yAxis: [
                {
                    name: `辐射强度（W/m²)`,
                    type: 'value',
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}',
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
                        show: true,
                        color: lineColor,
                    },
                    splitLine: {
                        show: false,
                    }
                }
            ],
            series: [
                {
                    name: '辐射强度',
                    type: 'line',
                    data: instantaneous,
                    symbol: 'none',
                },
            ]
        }
        powerDiagram.setOption(powerOption, 'notMerge');
        powerDiagram.resize();
    }

    render() {
        const { loading, weatherstationDetail = {}, deviceAlarmList = [], radiationchartDat = [] } = this.props;
        console.log('stationDeviceList', deviceAlarmList, radiationchartDat)
        const { stationCode } = this.props.match.params;
        const waether = [
            {
                "id": "397267738019861",
                "stationCode": 504,
                "temperature": "4℃~20℃",
                "weather": "多云转晴",
                "weatherDate": "2019-05-27",
                "weatherId": "01,00",
                "weatherSummary": "晴",
                "wind": "持续无风向微风"
            },
            {
                "id": "397630125885461",
                "stationCode": 504,
                "temperature": "5℃~19℃",
                "weather": "晴转多云",
                "weatherDate": "2019-05-28",
                "weatherId": "00,01",
                "weatherSummary": "晴",
                "wind": "持续无风向微风"
            },
            {
                "id": "397992505362453",
                "stationCode": 504,
                "temperature": "3℃~18℃",
                "weather": "晴转多云",
                "weatherDate": "2019-05-29",
                "weatherId": "00,01",
                "weatherSummary": "晴",
                "wind": "持续无风向微风"
            },
            {
                "id": "398354901616661",
                "stationCode": 504,
                "temperature": "4℃~18℃",
                "weather": "晴转多云",
                "weatherDate": "2019-05-30",
                "weatherId": "00,01",
                "weatherSummary": "晴",
                "wind": "持续无风向微风"
            },
            {
                "id": "398717281093653",
                "stationCode": 504,
                "temperature": "4℃~18℃",
                "weather": "晴转多云",
                "weatherDate": "2019-05-31",
                "weatherId": "00,01",
                "weatherSummary": "晴",
                "wind": "持续无风向微风"
            },
        ];
        let deatilData = [
            { id: 'instantaneous', name: '瞬时辐射', unit: 'W/m²', point: '2', },
            { id: 'temp', name: '环境温度', unit: '℃', point: '2', },
            { id: 'componentTemp', name: '组件温度', unit: '℃', point: '2', },
            { id: 'humidity', name: '湿度', unit: 'g/m3', point: '2', },
            { id: 'pressure', name: '压力', unit: 'Pa', point: '2', },
            { id: 'windSpeed', name: '风速', unit: 'm/s', point: '2', },
            { id: 'windDirect', name: '风向', unit: '°', point: '2', },
            { id: 'radiatioQuantity', name: '辐射量', unit: 'MJ/m²', point: '2', },
        ]
        return (
            <div className={styles.weatherStation}>
                <div className={styles.datailWrap}>
                    <div className={styles.detail}>
                        {deatilData.map((e, index) => {
                            return (<div className={styles.everyDetail} key={index}>
                                <div>{e.name}</div>
                                <div className={styles.detailId}>{dataFormats(weatherstationDetail[e.id], '--', e.point, true)}
                                    <span className={styles.detailUnit}>{e.unit}</span></div>
                            </div>)
                        })}
                    </div>
                    <div className={styles.weatherList}>
                        {waether.map((e, index) => {
                            const weekArray = ['日', '一', '二', '三', '四', '五', '六']
                            let date = ['昨天', '今天', '明天', '后天', '星期'];
                            let dateInner = (index === waether.length - 1) ? '星期' + weekArray[moment(e.weatherDate).get('weekday')] : date[index]
                            return (<div className={styles.weatherDay} key={index}>
                                <div className={styles.weatherDate}>{e.weatherDate} <span> {dateInner}</span></div>
                                {waether.length > 0 &&
                                    <React.Fragment>
                                        <div className={styles.weatherIcon}><img src={`/img/weathercn/${e.weatherId.split(',')[0]}.png`} /></div>
                                        <div>{e.weather}</div>
                                        <div>{e.temperature}</div>
                                        <div>{e.wind}</div>
                                    </React.Fragment>
                                    || <div className={styles.weatherNoData}>'暂无数据'</div>
                                }

                            </div>)
                        })}
                    </div>
                </div>
                <div className={styles.charts}>
                    <div id={'radiationchart'} style={{ width: '100%', height: '100%' }}></div>
                </div>
                <div className={styles.alarmBox}>
                    <DeviceAlarmTable
                        deviceAlarmList={deviceAlarmList}
                        stationCode={stationCode}
                        deviceDetail={{ deviceTypeName: '实时告警' }}
                        style={{ padding: `0px 29px 32px 23px`, border: 'none' }}
                    />
                </div>
            </div>
        )
    }
}

export default WeatherStation;
