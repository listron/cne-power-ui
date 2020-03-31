

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './schematic.scss';
import { dataFormats } from '../../../../../../utils/utilFunc';
import { Button, Icon } from 'antd';



class Schematic extends Component {
    static propTypes = {
        deviceTypeList: PropTypes.array,
        changeSingleStationStore: PropTypes.func,
        sketchmapData: PropTypes.object,
        getSketchmap: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            activeCarousel: 0,
            activeInvertType: '201',
        };
    }

    componentDidMount() {
        const { stationCode } = this.props.match.params;
        this.getData(stationCode);
    }

    componentWillReceiveProps(nextProps) {
        const { stationCode } = this.props.match.params;
        const nextParams = nextProps.match.params;
        const nextStation = nextParams.stationCode;
        if (nextStation !== stationCode) {
            this.timeOutId && clearTimeout(this.timeOutId);
            this.getData(nextStation);
        }
    }

    componentWillUnmount() {
        this.timeOutId && clearTimeout(this.timeOutId);
    }

    getData = stationCode => {
        this.props.getSketchmap({ stationCode }); // 获取流程图的数据
        this.timeOutId = setTimeout(() => {
            this.getData(stationCode);
        }, 60000);
    }

    getEveryData = (deviceTypeCode) => {
        const { sketchmapData } = this.props;
        return sketchmapData[deviceTypeCode] && sketchmapData[deviceTypeCode]['summaryInfo'] || {};
    }


    dealData = (deviceTypeCode, id, point) => {
        const { sketchmapData } = this.props;
        const listData = sketchmapData[deviceTypeCode] && sketchmapData[deviceTypeCode].summaryInfo;
        if (listData) {
            if (listData instanceof Array) {
                return listData.length > 0 && listData[0].summaryInfo && dataFormats(listData[0].summaryInfo[id], '--', point, true) || '--';
            }
            return dataFormats(listData[id], '--', point, true);
        }
        return '--';
    }

    prev = (e) => { // 集电线路向前
        e.stopPropagation();
        const { activeCarousel } = this.state;
        this.setState({
            activeCarousel: activeCarousel - 1,
        });
    }

    next = (e) => { // 集电线路向后
        e.stopPropagation();
        const { activeCarousel } = this.state;
        this.setState({
            activeCarousel: activeCarousel + 1,
        });
    }

    changeInverType = (e, value) => { // 改变组串式还是集中式
        e.stopPropagation();
        this.setState({
            activeInvertType: value,
        });
    }

    changeTypeCode = (value) => {
        this.props.changeSingleStationStore({ deviceTypeCode: value });
    }


    render() {
        const { deviceTypeList, sketchmapData, theme } = this.props;
        const deviceTypeArr = deviceTypeList.map(e => e.deviceTypeCode);
        const commonList = {
            '509': {
                summaryInfo: [
                    { 'id': 'connectedSize', name: '支路-接入数', unit: '个', point: 2, allNumber: true }, // totalSize 接入总数
                    { 'id': 'normalSize', name: '支路-正常数', unit: '个', point: 2 },
                    { 'id': 'smallerSize', name: '支路-偏低数', unit: '个', point: 2, hot: true },
                    { 'id': 'exceptionSize', name: '支路-异常数', unit: '个', point: 2, hot: true },
                    { 'id': 'largerSize', name: '支路-偏高数', unit: '个', point: 2, hot: true },
                ],
            },
            '202': {
                summaryInfo: [
                    { 'id': 'totalSize', name: '汇流箱总数', unit: '台', point: 0, allNumber: true },
                    { 'id': 'normalSize', name: '正常数', unit: '台', point: 2 },
                    { 'id': 'smallerSize', name: '离散率≥10%数', unit: '台', point: 0, hot: true },
                    { 'id': 'largerSize', name: '离散率≥20%数', unit: '台', point: 0, hot: true },
                    { 'id': 'breakSize', name: '通讯中断数', unit: '台', point: 0, hot: true },
                ],
            },
            '304': {
                summaryInfo: [
                    { 'id': 'totalSize', name: '箱变总数', unit: '台', point: 0, allNumber: true },
                    { 'id': 'normalSize', name: '正常数', unit: '台', point: 2 },
                    { 'id': 'breakSize', name: '通讯中断', unit: '台', point: 0, hot: true },
                ],
            },
            '301': {
                high: {
                    summaryInfo: [
                        { 'id': 'HP', name: 'P', unit: 'MW', point: 2 },
                        { 'id': 'HQ', name: 'Q', unit: 'MVar', point: 2 },
                        { 'id': 'HCos', name: 'Cos', unit: '', point: 2 },
                        { 'id': 'HUab', name: 'Uab', unit: 'kV', point: 2 },
                    ],
                },
                low: {
                    summaryInfo: [
                        { 'id': 'LP', name: 'P', unit: 'MW', point: 2 },
                        { 'id': 'LQ', name: 'Q', unit: 'MVar', point: 2 },
                        { 'id': 'LCos', name: 'Cos', unit: '', point: 2 },
                        { 'id': 'LUab', name: 'Uab', unit: 'kV', point: 2 },
                    ],
                },

            },
            '201': {
                summaryInfo: [
                    { 'id': 'totalSize', name: '逆变器总数', unit: '台', point: 0, allNumber: true },
                    { 'id': 'normalSize', name: '正常运行数', unit: '台', point: 0 },
                    { 'id': 'limitSize', name: '限电运行数', unit: '台', point: 0, hot: true },
                    { 'id': 'stopSize', name: '正常停机数', unit: '台', point: 0 },
                    { 'id': 'exceptionSize', name: '故障停机数', unit: '台', point: 0, hot: true },
                    { 'id': 'breakSize', name: '通讯中断数', unit: '台', point: 0, hot: true },
                ],
            },
            'all': {
                summaryInfo: [
                    { 'id': 'totalSize', name: '逆变器数', unit: '台', point: 0, allNumber: true },
                    { 'id': 'normalSize', name: '正常运行数', unit: '台', point: 0 },
                    { 'id': 'limitSize', name: '限电运行数', unit: '台', point: 0, hot: true },
                    { 'id': 'stopSize', name: '正常停机数', unit: '台', point: 0 },
                    { 'id': 'exceptionSize', name: '故障停机数', unit: '台', point: 0, hot: true },
                    { 'id': 'breakSize', name: '通讯中断数', unit: '台', point: 0, hot: true },
                ],
            },
        };
        const { activeCarousel, activeInvertType } = this.state;
        const invertType = deviceTypeArr.includes('206') && deviceTypeArr.includes('201');
        const invertTypeCode = (!invertType && deviceTypeArr.includes('206')) ? '206' : '201';
        return (
            <div className={`${styles.schematic} ${styles[theme]}`}>
                <div className={styles.schematicBox}>
                    <img src={`${theme === 'dark' ? '/img/schematic02.png' : '/img/schematic01.png'}`} />
                    <div className={styles.lines}>
                        {deviceTypeArr.includes('509') &&
                            <div className={styles.pvmodule}>
                                <div className={styles.verticalLine} />
                            </div>
                        }
                        {deviceTypeArr.includes('202') &&
                            <div className={styles.confluence}>
                                <div className={styles.verticalLine} />
                            </div>
                        }
                        {(deviceTypeArr.includes('201') || deviceTypeArr.includes('206')) &&
                            <div className={styles.inverter}>
                                <div className={styles.verticalLine} />
                            </div>
                        }
                        {deviceTypeArr.includes('302') &&
                            <div className={styles.integrateLine}>
                                <div className={styles.verticalLine} />
                            </div>
                        }
                        {deviceTypeArr.includes('304') &&
                            <div className={styles.boxtransformer}>
                                <div className={styles.verticalLine} />
                            </div>
                        }
                        {deviceTypeArr.includes('301') &&
                            <div className={styles.boosterStation}>
                                <div className={styles.verticalLine}>
                                    <span className={styles.horizontal} />
                                </div>
                            </div>
                        }
                    </div>
                    <div className={styles.detailBox}>
                        {deviceTypeArr.includes('509') && // 光伏组件
                            <div className={styles.pvmodule} onClick={() => { this.changeTypeCode('509'); }}>
                                <div className={styles.title}>支路电流</div>
                                {commonList['509'].summaryInfo.map((e, index) => {
                                    const number = this.dealData('509', e.id, e.point);
                                    return (<div className={`${styles.column} ${e.hot && `${number}` !== '0' && styles.hot} ${e.allNumber && styles.allNumber}`} key={index}>
                                        <div>{e.name} </div>
                                        <div> {number} <span> {e.unit}</span></div>
                                    </div>);
                                })}
                            </div>
                        }
                        {deviceTypeArr.includes('202') && // 汇流箱
                            <div className={styles.confluence} onClick={() => { this.changeTypeCode('202'); }}>
                                <div className={styles.title}>汇流箱状态</div>
                                {commonList['202'].summaryInfo.map((e, index) => {
                                    const number = this.dealData('202', e.id, e.point);
                                    return (<div className={`${styles.column} ${e.hot && `${number}` !== '0' && styles.hot} ${e.allNumber && styles.allNumber}`} key={index}>
                                        <div>{e.name} </div>
                                        <div> {number} <span> {e.unit}</span></div>
                                    </div>);
                                })}
                            </div>
                        }
                        {!invertType && (deviceTypeArr.includes('201') || deviceTypeArr.includes('206')) &&// 逆变器（集中）／组合式逆变器
                            <div className={styles.inverter} onClick={() => { this.changeTypeCode(invertTypeCode); }}>
                                <div className={styles.title}>{deviceTypeArr.includes('201') ? '逆变器（集中）' : '逆变器（组串）'}</div>
                                {commonList['201'].summaryInfo.map((e, index) => {
                                    const number = this.dealData(invertTypeCode, e.id, e.point);
                                    return (<div className={`${styles.column} ${e.hot && `${number}` !== '0' && styles.hot} ${e.single && styles.singleLine} ${e.allNumber && styles.allNumber}`} key={index}>
                                        <div>{e.name} </div>
                                        <div> {number} <span> {e.unit}</span></div>
                                    </div>);
                                })}
                            </div>
                        }
                        {invertType && // 分布式
                            <div className={styles.inverter} onClick={() => { this.changeTypeCode(activeInvertType); }}>
                                <div className={styles.title}> 逆变器状态 </div>
                                <div className={`${styles.column}`}>
                                    <div>逆变器总数 </div>
                                    <div> {+this.getEveryData('201').totalSize + +this.getEveryData('206').totalSize} <span> 台</span></div>
                                </div>
                                <div className={`${styles.inverterButton}`}>
                                    <span className={`${activeInvertType === '201' && styles.activeButton}`} onClick={(e) => { this.changeInverType(e, '201'); }}>集中式</span>
                                    <span className={`${activeInvertType === '206' && styles.activeButton}`} onClick={(e) => { this.changeInverType(e, '206'); }}>组串式</span>
                                </div>
                                {commonList['all'].summaryInfo.map((e, index) => {
                                    const number = this.dealData(activeInvertType, e.id, e.point);
                                    return (<div className={`${styles.column} ${e.hot && `${number}` !== '0' && styles.hot} ${e.single && styles.singleLine}`} key={index}>
                                        <div>{e.name} </div>
                                        <div> {number} <span> {e.unit}</span></div>
                                    </div>);
                                })}
                            </div>
                        }
                        {deviceTypeArr.includes('304') && // 箱变
                            <div className={styles.boxtransformer} onClick={() => { this.changeTypeCode('304'); }}>
                                <div className={styles.title}>箱变状态</div>
                                {commonList['304'].summaryInfo.map((e, index) => {
                                    const number = this.dealData('304', e.id, e.point);
                                    return (<div className={`${styles.column} ${e.hot && `${number}` !== '0' && styles.hot} ${e.allNumber && styles.allNumber}`} key={index}>
                                        <div>{e.name} </div>
                                        <div> {number} <span> {e.unit}</span></div>
                                    </div>);
                                })}
                            </div>
                        }
                        {deviceTypeArr.includes('302') && // 集电线路
                            <div className={styles.integrateLine} onClick={() => { this.changeTypeCode('302'); }}>
                                <div className={styles.title}> 集电线路 </div>
                                <div className={`${styles.column}`}>
                                    <div> 集电线路数</div>
                                    <div> {sketchmapData['302'] && sketchmapData['302'].summaryInfo.length || '--'} <span> 个</span></div>
                                </div>
                                {/* <div className={`${styles.column}`}>
                                    <div> 总功率</div>
                                    <div> {sketchmapData['302'] && sketchmapData['302'].summaryInfo.length > 0 && dataFormats(sketchmapData['302'].summaryInfo[0]['summaryInfo']['totalPower'], '--', 2) || '--'} <span> kWh</span></div>
                                </div> */}
                                <div className={styles.lineWrap}>
                                    <i className={`${'iconfont icon-content'} ${styles.prev} ${activeCarousel === 0 && styles.disabled}`} onClick={this.prev} />
                                    <div className={styles.carousel}>
                                        {sketchmapData['302'] && sketchmapData['302'].summaryInfo.length > 0 && sketchmapData['302'].summaryInfo.map((e, index) => {

                                            return (<div className={`${styles.everyCarousel} ${activeCarousel === index && styles.active}`} key={index}>
                                                <div className={styles.title}> 集电线路{index + 1}</div>
                                                <div className={`${styles.column}`} key={index}>
                                                    <div>P </div>
                                                    <div> {dataFormats(e['summaryInfo']['P'], '--', 2, true)} MW</div>
                                                </div>
                                                <div className={`${styles.column}`}>
                                                    <div> Q </div>
                                                    <div> {dataFormats(e['summaryInfo']['Q'], '--', 2, true)} MVar</div>
                                                </div>
                                                <div className={`${styles.column}`}>
                                                    <div> Cos </div>
                                                    <div> {dataFormats(e['summaryInfo']['Cos'], '--', 2, true)} </div>
                                                </div>
                                                <div className={`${styles.column}`}>
                                                    <div> Uab </div>
                                                    <div> {dataFormats(e['summaryInfo']['Uab'], '--', 2, true)} kV</div>
                                                </div>
                                            </div>);
                                        })}
                                    </div>
                                    <i className={`${'iconfont icon-content'} ${styles.next}  ${sketchmapData['302'] && activeCarousel === sketchmapData['302'].summaryInfo.length - 1 && styles.disabled}`} onClick={this.next} />
                                </div>

                            </div>
                        }
                        {deviceTypeArr.includes('301') && // 升压站
                            <div className={styles.boosterStation} onClick={() => { this.changeTypeCode('301'); }}>
                                <div className={styles.highPressure}>
                                    <div className={styles.title}>主变高压侧</div>
                                    {commonList['301']['high'].summaryInfo.map((e, index) => {
                                        const number = this.dealData('301', e.id, e.point);
                                        return (<div className={`${styles.column} ${e.hot && `${number}` !== '0' && styles.hot}`} key={index}>
                                            <div>{e.name} </div>
                                            <div> {number} <span> {e.unit}</span></div>
                                        </div>);
                                    })}
                                </div>
                                <div className={styles.lowPressure}>
                                    <div className={styles.title}>主变低压侧</div>
                                    {commonList['301']['low'].summaryInfo.map((e, index) => {
                                        const number = this.dealData('301', e.id, e.point);
                                        return (<div className={`${styles.column} ${e.hot && `${number}` !== '0' && styles.hot}`} key={index}>
                                            <div>{e.name} </div>
                                            <div> {number} <span> {e.unit}</span></div>
                                        </div>);
                                    })}</div>
                            </div>
                        }
                        <div className={styles.meter} onClick={() => { this.changeTypeCode('0'); }}></div>
                        <div className={styles.weather} onClick={() => { this.changeTypeCode('203'); }}></div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Schematic;
