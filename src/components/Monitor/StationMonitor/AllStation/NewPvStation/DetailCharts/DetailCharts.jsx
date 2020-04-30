import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './detailCharts.scss';
import echarts from 'echarts';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { showNoData, hiddenNoData } from '../../../../../../constants/echartsNoData';
import { dataFormats, handleRights } from '../../../../../../utils/utilFunc';
import DayPower from './DayPower';
import MonthPlanPower from './MonthPlanPower';
import MonthPower from './MonthPower';
import CneButton from '@components/Common/Power/CneButton';


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
        monthPlanPowerLoading: PropTypes.bool,
        dayPowerLoading: PropTypes.bool,
        monthPowerLoading: PropTypes.bool,
    }
    render() {
        const { stationDataSummary = {}, monitorPvUnit, detailVisible } = this.props;
        const { dayPowerTime, dayPowerData, monthPlanPowerData, monthPlanPowerTime, monthPowerData, monthPowerTime, theme } = this.props;
        const { powerUnit, realCapacityUnit, realTimePowerUnit } = monitorPvUnit;
        const [statisticsRight, pvReportStationRight] = handleRights(['statistics', 'pvReport_station']);
        return (
            <div className={`${styles.showCharts} ${!detailVisible && styles.hideCharts} ${styles[theme]}`} >
                <div className={`${styles.tags} ${(!statisticsRight || !pvReportStationRight) && styles.noRight}`}>
                    <CneButton lengthMode="long"><Link to={{ pathname: '/monitor/alarm/realtime', state: { stationType: '1' } }}> 查看告警 {dataFormats(stationDataSummary.alarmNum, '--')} </Link></CneButton>
                    {statisticsRight && <CneButton lengthMode="short"><Link to={'/statistical/stationaccount/allstation'}> 统计分析  </Link></CneButton>}
                    {pvReportStationRight && <CneButton lengthMode="short"><Link to={'/report/pvstation/station'} > 电站报表  </Link></CneButton>}
                </div>
                <div className={styles.hideDetail} onClick={() => { this.props.detailChange({ detailVisible: false }); }}>
                    <i className="iconfont icon-go"></i>
                </div>
                <div className={styles.chartsBox}>
                    <DayPower
                        dayPowerData={dayPowerData}
                        powerTime={dayPowerTime}
                        powerUnit={powerUnit}
                        loading={this.props.dayPowerLoading}
                        theme={this.props.theme}
                    />
                </div>
                <div className={styles.chartsBox}>
                    <MonthPower
                        monthPowerData={monthPowerData}
                        powerTime={monthPowerTime}
                        powerUnit={powerUnit}
                        loading={this.props.monthPowerLoading}
                        theme={this.props.theme}
                    />
                </div>
                <div className={styles.chartsBox}>
                    <MonthPlanPower
                        monthPlanPowerData={monthPlanPowerData}
                        powerTime={monthPlanPowerTime}
                        powerUnit={powerUnit}
                        loading={this.props.monthPlanPowerLoading}
                        theme={this.props.theme}
                    />
                </div>

            </div>
        );
    }
}

export default DetailCharts
    ;
