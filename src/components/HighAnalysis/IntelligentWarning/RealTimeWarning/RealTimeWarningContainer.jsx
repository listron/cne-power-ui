import React, { Component } from "react";
import styles from './realTimeWarning.scss';
import RealTimeWarningTop from './RealTimeWarningTop';
import RealTimeWarningFilter from './RealTimeWarningFilter';
import RealTimeWarningTable from './RealTimeWarningTable';


class RealTimeWarningContainer extends Component {
    static propTypes = {
    }
    constructor(props, context) {
        super(props, context)
    }
    componentDidMount() {
        const { getRealtimeWarningStatistic, getRealtimeWarning, warningStatus, warningType, warningTypeStatus, endTime, startTime, deviceTypeCode, warningLevel, stationCode, orderField, orderCommand, deviceName, durationType, } = this.props;
        const params = { warningTypeStatus, endTime, startTime, deviceTypeCode, warningLevel, stationCode, orderField, orderCommand, deviceName, durationType }
        getRealtimeWarningStatistic({ warningStatus, warningType })
        getRealtimeWarning(params)
        this.realtimeSetInterval = setInterval(() => this.realtimeWarningSetInterval(), 10000);
    }
    onChangeFilter = (value) => {
        console.log(value,'这是container的value');
        clearInterval(this.realtimeSetInterval)
        const { getRealtimeWarning,  warningTypeStatus, endTime, startTime, deviceTypeCode, warningLevel, stationCode, orderField, orderCommand, deviceName, durationType, } = this.props;
        const params = { warningTypeStatus, endTime, startTime, deviceTypeCode, warningLevel, stationCode, orderField, orderCommand, deviceName, durationType }
        getRealtimeWarning({  ...value })
    }

    realtimeWarningSetInterval = () => {
        const { getRealtimeWarningStatistic, getRealtimeWarning, warningStatus, warningType, warningTypeStatus, endTime, startTime, deviceTypeCode, warningLevel, stationCode, orderField, orderCommand, deviceName, durationType, } = this.props;
        const params = { warningTypeStatus, endTime, startTime, deviceTypeCode, warningLevel, stationCode, orderField, orderCommand, deviceName, durationType }
        getRealtimeWarningStatistic({ warningStatus, warningType })
        getRealtimeWarning(params)
    }


    render() {

        const { stations, deviceTypes } = this.props;
        return (
            <div className={styles.realTimeWarningContainer}>
                <RealTimeWarningTop {...this.props} warningTypeStatus={1} />
                <RealTimeWarningFilter {...this.props} stations={stations} deviceTypes={deviceTypes} onSearch={this.onChangeFilter} />
                <RealTimeWarningTable {...this.props} />
            </div>
        )
    }
}
export default (RealTimeWarningContainer)