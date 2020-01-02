import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './detailCharts.scss';
import echarts from 'echarts';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { dataFormats } from '../../../../../../utils/utilFunc';
import { transferCapacityUnit } from '../../../PvCommon/PvDataformat';
import MonthPlanPower from './MonthPlanPower';
import MonthPower from './MonthPower';
import OutputTenMin from './OutputTenMin';


class DetailCharts extends Component {
    static propTypes = {
        workList: PropTypes.object,
        monthPowerData: PropTypes.array,
        alarmNum: PropTypes.number,
        powerData: PropTypes.array,
        powerTime: PropTypes.number,
        powerDataLoading: PropTypes.bool,
        getPowerDataTenMin: PropTypes.func,
        monitorPvUnit: PropTypes.object,
        singleStationData: PropTypes.object,
        match: PropTypes.object,
        detailVisible: PropTypes.bool,
        detailChange: PropTypes.func,
        theme: PropTypes.string,
        getCapabilityDiagram: PropTypes.func,
    }




    render() {
        const { singleStationData, alarmNum, monitorPvUnit, detailVisible, workList, theme = 'light' } = this.props;
        const { powerUnit, realTimePowerUnit, realCapacityUnit } = monitorPvUnit;
        const { stationCode } = this.props.match.params;
        const stationDataSummary = singleStationData || {};
        const showCapacityUnit = transferCapacityUnit(stationDataSummary.stationCapacity, realCapacityUnit);//计算装机容量的单位
        return (
            <div className={`${styles.showCharts} ${!detailVisible && styles.hideCharts} ${styles[theme]}`}>
                <div className={styles.tags}>
                    <Link to={`/monitor/alarm/realtime?stationCode=${stationCode}`}> 查看告警 {dataFormats(alarmNum, '--')} </Link>
                    <Link to={`/statistical/stationaccount/allstation/${stationCode}`}> 统计分析  </Link>
                </div>
                <div className={styles.hideDetail} onClick={() => { this.props.detailChange({ detailVisible: false }); }}>
                    <i className="iconfont icon-go"></i>
                </div>
                <div className={styles.deviceStatus}>
                    <div className={styles.deviceStaTitle}> <span>电站工单</span> {/* <i className="iconfont icon-more"></i>  */}
                    </div>
                    <div className={styles.deviceStaCont}>
                        <span>{'今日新增'} {dataFormats(workList.worklistNewNum, '--')}</span>
                        <span>{'处理中'} {dataFormats(workList.worklistHandleNum, '--')}</span>
                        <span>{'今日完成'} {dataFormats(workList.worklistCompleteNum, '--')}</span>
                    </div>
                </div>
                <div className={styles.chartsBox}>
                    <OutputTenMin {...this.props}
                        yXaisName={'辐射(W/m²)'}
                        stationCode={stationCode}
                        yAxisUnit={showCapacityUnit}
                        capabilityDataTime={this.props.capabilityDataTime}
                        loading={this.props.capabilityLoading}
                        capabilityData={this.props.capabilityData}
                        onChange={this.props.getCapabilityDiagram}
                        theme={theme}
                    />
                </div>
                <div className={styles.chartsBox}>
                    <MonthPower
                        powerData={this.props.powerData}
                        powerTime={this.props.powerTime}
                        powerUnit={powerUnit}
                        loading={this.props.powerDataLoading}
                        onChange={this.props.getPowerDataTenMin}
                        stationCode={stationCode}
                        theme={theme}
                    />
                </div>
                <div className={styles.chartsBox}>
                    <MonthPlanPower
                        monthPlanPower={this.props.monthPlanPower}
                        powerUnit={powerUnit}
                        loading={this.props.monthPlanPowerLoading}
                        theme={theme}
                    />
                </div>

            </div>
        );
    }
}

export default DetailCharts;
