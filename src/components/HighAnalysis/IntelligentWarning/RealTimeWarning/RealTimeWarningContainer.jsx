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
        const { warningTypeStatus,warningStatus, warningType, getRealtimeWarningStatistic,getRealtimeWarning,endTime,startTime,deviceTypeCode,warningLevel,stationCode } = this.props;
        const params={endTime,startTime,deviceTypeCode,warningLevel,stationCode,warningTypeStatus}
        getRealtimeWarningStatistic({ warningStatus, warningType })
        getRealtimeWarning(params)
         this.realtimeSetInterval = setInterval(() =>  this.realtimeWarningSetInterval , 10000);
    }
    onChangeFilter = (value) => {
        const { stationCode, warningLevel, stationType, deviceTypeCode, warningConfigName, startTime, deviceName, isTransferWork, isRelieveAlarm, orderField, orderCommand,warningTypeStatus } = this.props;
        const params = { stationCode, warningLevel, stationType, deviceTypeCode, warningConfigName, startTime, deviceName, isTransferWork, isRelieveAlarm, orderField, orderCommand,warningTypeStatus }
        this.props.getRealtimeWarning({ ...params, ...value })
      }
    
    realtimeWarningSetInterval=()=>{
        const { warningTypeStatus, warningType, getRealtimeWarningStatistic,getRealtimeWarning,endTime,startTime,deviceTypeCode,warningLevel,stationCode } = this.props;
        const params={endTime,startTime,deviceTypeCode,warningLevel,stationCode,warningTypeStatus}
    }
    

    render() {

        const { stations, deviceTypes } = this.props;
        return (
            <div className={styles.realTimeWarningContainer}>
                <RealTimeWarningTop {...this.props} warningTypeStatus={1} />
                <RealTimeWarningFilter {...this.props} stations={stations} deviceTypes={deviceTypes} onSearch={this.onChangeFilter}  />
                <RealTimeWarningTable {...this.props} />
            </div>
        )
    }
}
export default (RealTimeWarningContainer)