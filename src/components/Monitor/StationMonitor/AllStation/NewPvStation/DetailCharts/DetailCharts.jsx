import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './detailCharts.scss';
import echarts from 'echarts';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { showNoData, hiddenNoData } from '../../../../../../constants/echartsNoData';
import { dataFormats } from '../../../../../../utils/utilFunc';
import DayPower from './DayPower';
import MonthPlanPower from './MonthPlanPower';
import MonthPower from './MonthPower';


class DetailCharts extends Component {
    static propTypes = {
        stationDataSummary: PropTypes.object,
        detailChange: PropTypes.func,
        dayPowerTime: PropTypes.number,
        dayPowerData: PropTypes.array,
        monthPlanPowerTime: PropTypes.number,
        monthPlanPowerData: PropTypes.array,
        monthPowerTime: PropTypes.number,
        monthPowerData: PropTypes.array,
        monitorPvUnit: PropTypes.object,
        detailVisible: PropTypes.bool,
    }
    render() {
        const { stationDataSummary = {}, monitorPvUnit,detailVisible } = this.props;
        const { dayPowerTime, dayPowerData, monthPlanPowerData, monthPlanPowerTime,monthPowerData,monthPowerTime } = this.props;
        const { powerUnit, realCapacityUnit, realTimePowerUnit } = monitorPvUnit;
        return (
            <div className={`${styles.showCharts} ${!detailVisible && styles.hideCharts}`}>
                <div className={styles.tags}>
                    <Link to={{ pathname: `/monitor/alarm/realtime`, state: { stationType: '0' } }}> 查看告警 {dataFormats(stationDataSummary.alarmNum, '--')} </Link>
                    <Link to={`javascript:void(0)`} className={styles.noLink}> 统计分析  </Link>
                    <Link to={`/monitor/report/powerReport`} > 报表查询  </Link>
                </div>
                <div className={styles.hideDetail} onClick={() => { this.props.detailChange({ detailVisible: false }) }}>
                    <i className="iconfont icon-upstream"></i>
                </div>
                <div className={styles.deviceStatus}>
                    <div className={styles.deviceStaTitle}> <span>设备状态</span> {/* <i className="iconfont icon-more"></i>  */}
                    </div>
                    <div className={styles.deviceStaCont}>
                        <span>{'异常支路数'} {dataFormats(stationDataSummary['anomalousBranchNum'], '--')}</span>
                        <span>{'低效逆变器'} {dataFormats(stationDataSummary['lowEfficiencyInverterNum'], '--')}</span>
                    </div>
                </div>
                <div className={styles.chartsBox}>
                    <DayPower dayPowerData={dayPowerData} powerTime={dayPowerTime} powerUnit={powerUnit} />
                </div>
                <div className={styles.chartsBox}>
                    <MonthPower monthPowerData={monthPowerData} powerTime={monthPowerTime} powerUnit={powerUnit} />
                </div>
                <div className={styles.chartsBox}>
                    <MonthPlanPower monthPlanPowerData={monthPlanPowerData} powerTime={monthPlanPowerTime} powerUnit={powerUnit} />
                </div>

            </div>
        )
    }
}

export default DetailCharts