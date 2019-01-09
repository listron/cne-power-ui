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
        const { getRealtimeWarningStatistic,  warningStatus, warningType,}=this.props
        getRealtimeWarningStatistic({ warningStatus, warningType })
        this.realtimeWarningSetInterval(),
        this.realtimeSetInterval = setInterval(() => this.realtimeWarningSetInterval(), 100000);
    }
    onChangeFilter = (value) => {
        clearInterval(this.realtimeSetInterval)
        this.realtimeWarningSetInterval(value)
    }

    realtimeWarningSetInterval = (value) => {
        const {  getRealtimeWarning, warningTypeStatus,  rangTime, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType, } = this.props;
        const params = { warningTypeStatus,  rangTime, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType }
        getRealtimeWarning({...params,...value})
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