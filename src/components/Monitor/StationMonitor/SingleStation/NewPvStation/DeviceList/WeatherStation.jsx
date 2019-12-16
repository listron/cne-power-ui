

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { Tooltip } from 'antd';
import { dataFormats } from '../../../../../../utils/utilFunc';
import DeviceAlarmTable from '../../../DeviceMonitor/DeviceMonitorCommon/DeviceAlarmTable';
import moment from 'moment';
import echarts from 'echarts';
import { themeConfig, chartsNodata } from '../../../../../../utils/darkConfig';

class WeatherStation extends Component {
    static propTypes = {
        getWeatherDetail: PropTypes.func,
        match: PropTypes.object,
        weatherstationDetail: PropTypes.object,
        deviceAlarmList: PropTypes.array,
        weatherList: PropTypes.array,
        radiationchartTime: PropTypes.number,
        getStationDeviceList: PropTypes.func,
        getRadiationchart: PropTypes.func,
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {
            alarmSwitch: false,
            firstLoad: true,
        };
    }

    componentDidMount() {
        const { stationCode } = this.props.match.params;
        this.getData(stationCode);
        this.drawChart(this.props);

    }

    componentWillReceiveProps(nextProps) {
        const { stationCode } = this.props.match.params;
        const nextParams = nextProps.match.params;
        const nextStation = nextParams.stationCode;
        const { radiationchartTime, theme } = this.props;
        if (nextStation !== stationCode) {
            this.getData(nextStation);
        }
        if (radiationchartTime !== nextProps.radiationchartTime || theme !== nextProps.theme) {
            this.drawChart(nextProps);
        }
    }


    getData = stationCode => {
        this.props.getStationDeviceList({ stationCode, deviceTypeCode: 203 });//获取气象站的单设备数据
        this.props.getWeatherDetail({ stationCode });
        this.props.getRadiationchart({ stationCode });
    }

    drawChart = (params) => {
        const { radiationchartData = [], theme } = params;
        const instantaneous = radiationchartData.map(e => dataFormats(e.instantaneous, '--', 2, true)); // 辐射值
        const filterInstantaneous = radiationchartData.filter(e => e.instantaneous);
        const powerGraphic = (filterInstantaneous.length === 0);
        const graphic = chartsNodata(!powerGraphic, theme);
        const chartsBox = document.getElementById('radiationchart');
        let powerDiagram = echarts.init(chartsBox, themeConfig[theme]);
        if (powerDiagram) {
            powerDiagram.dispose();
            powerDiagram = echarts.init(chartsBox, themeConfig[theme]);
        }
        const powerOption = {
            graphic: graphic,
            color: theme === 'light' ? ['#f8b14e'] : ['#f9b600'],
            grid: {
                top: 40,
                left: '8%',
                right: '8%',
                bottom: 40,
            },
            tooltip: {
                trigger: 'axis',
                padding: 0,
                formatter: (params) => {
                    let paramsItem = '';
                    params.forEach(item => {
                        paramsItem += `<div class=${styles.tooltipCont}> <span style="background:${item.color}"> </span> 
                        ${item.seriesName} :  ${item.value}</div>`;
                    });
                    return (
                        `<div class=${styles.tooltipBox}>
                            <div class=${styles.axisValue}>${params[0].name}</div>
                            <div class=${styles.tooltipContainer}> ${paramsItem}</div>
                        </div>`
                    );
                },
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: radiationchartData && radiationchartData.map(e => {
                        return moment(moment.utc(e.utc).toDate()).format('MM-DD HH:mm');
                    }),
                    axisLabel: {
                        formatter: (value) => {
                            return moment(value).format('HH:mm');
                        },

                    },
                    axisTick: { show: false },
                },
            ],
            yAxis: [
                {
                    name: '辐射强度（W/m²)',
                    type: 'value',
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}',
                    },
                    nameTextStyle: {
                        padding: [0, 0, 0, 30],
                    },
                    axisTick: {
                        show: true,
                    },
                    splitLine: {
                        show: false,
                    },
                },
            ],
            series: [
                {
                    name: '辐射强度',
                    type: 'line',
                    data: instantaneous,
                    symbol: 'none',
                },
            ],
        };
        powerDiagram.setOption(powerOption, 'notMerge');
        powerDiagram.resize();
    }

    render() {
        const { loading, weatherstationDetail = {}, deviceAlarmList = [], weatherList = [], theme } = this.props;
        const { stationCode } = this.props.match.params;
        const weather = weatherList.filter(e => moment(e.weatherDate).isBefore(moment().add(3, 'day')));
        const deatilData = [
            { id: 'instantaneous', name: '瞬时辐射', unit: 'W/m²', point: '2' },
            { id: 'temp', name: '环境温度', unit: '℃', point: '2' },
            { id: 'componentTemp', name: '组件温度', unit: '℃', point: '2' },
            { id: 'humidity', name: '湿度', unit: 'g/m3', point: '2' },
            { id: 'pressure', name: '压力', unit: 'Pa', point: '2' },
            { id: 'windSpeed', name: '风速', unit: 'm/s', point: '2' },
            { id: 'windDirect', name: '风向', unit: '°', point: '2' },
            { id: 'radiatioQuantity', name: '辐射量', unit: 'MJ/m²', point: '2', isShow: true },
        ];
        return (
            <div className={styles.weatherStation}>
                <div className={styles.datailWrap}>
                    <div className={styles.detail}>
                        {deatilData.map((e, index) => {
                            let value = dataFormats(weatherstationDetail[e.id], '--', e.point, true);
                            if (e.id === 'radiatioQuantity') {
                                value = dataFormats(weatherstationDetail[e.id] / 1000, '--', e.point, true);
                            }
                            return (<div className={styles.everyDetail} key={index}>
                                <div>{e.name}</div>
                                <div className={styles.detailId}>
                                    <span className={e.isShow && weatherstationDetail.radiatioQuantityValidation && styles.specialColor}></span>{value}
                                    <span className={styles.detailUnit}>{e.unit}</span>
                                    {e.isShow && weatherstationDetail.radiatioQuantityValidation &&
                                    <span className={styles.tooltipName}>
                                        <Tooltip placement="bottom" overlayStyle={{ maxWidth: 500, fontSize: '12px' }} title={weatherstationDetail.radiatioQuantityValidation}>
                                            <i className="iconfont icon-help"></i>
                                        </Tooltip>
                                    </span>}
                                </div>
                            </div>);
                        })}
                    </div>
                    <div className={styles.weatherList}>
                        {weather.map((e, index) => {
                            const weekArray = ['日', '一', '二', '三', '四', '五', '六'];
                            const date = ['昨天', '今天', '明天', '后天', '星期'];
                            const dateInner = (index === weather.length - 1) ? '星期' + weekArray[moment(e.weatherDate).get('weekday')] : date[index];
                            return (<div className={styles.weatherDay} key={index}>
                                <div className={styles.weatherDate}>{e.weatherDate} <span> {dateInner}</span></div>
                                {weather.length > 0 &&
                                    <React.Fragment>
                                        <div className={styles.weatherIcon}><img src={`/img/${theme === 'dark' ? 'darkWeathercn' : 'weathercn'}/${e.weatherId.split(',')[0]}.png`} /></div>
                                        <div>{e.weather}</div>
                                        <div>{e.temperature}</div>
                                        <div>{e.wind}</div>
                                    </React.Fragment>
                                    || <div className={styles.weatherNoData}>'暂无数据'</div>
                                }

                            </div>);
                        })}
                    </div>
                </div>
                <div className={styles.charts}>
                    <div id={'radiationchart'} style={{ width: '100%', height: '100%' }} />
                </div>
                <div className={styles.alarmBox}>
                    <DeviceAlarmTable
                        deviceAlarmList={deviceAlarmList}
                        stationCode={stationCode}
                        deviceDetail={{ deviceTypeName: '实时告警' }}
                        style={{ padding: '0px 29px 32px 23px', border: 'none' }}
                        theme={theme}
                    />
                </div>
            </div>
        );
    }
}

export default WeatherStation;
