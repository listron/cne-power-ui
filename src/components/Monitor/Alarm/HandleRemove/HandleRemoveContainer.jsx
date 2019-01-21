import React, { Component } from "react";
import styles from './handleRemove.scss'
import WarningStatisticTop from '../commonArea/WarningStatisticTop';
import HandleRemoveFilter from './HandleRemoveFilter';
import HandleRemoveTable from './HandleRemoveTable';




class HandleRemoveContainer extends Component {
    static propTypes = {
    }
    constructor(props, context) {
        super(props, context)
    }
    componentDidMount() {
        const { getHandleRemoveStatistic, warningStatus, warningType } = this.props
        getHandleRemoveStatistic({ warningStatus, warningType })
        this.queryTransferFrom()
    }
    onChangeFilter = (value) => {

        this.queryTransferFrom(value)
    }

    queryTransferFrom = (value) => {
        const { getHandleRemoveList, warningTypeStatus, warningType,stationType, rangTime, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType, pageSize, pageNum, } = this.props;
        const params = { warningTypeStatus, warningType,stationType, rangTime, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType, pageSize, pageNum, }
        getHandleRemoveList({ ...params, ...value })
    }
    render() {
        const { stations, deviceTypes, } = this.props;

        return (
            <div className={styles.handleRemoveContainer}>
                <WarningStatisticTop {...this.props} warningStatus={'2'} />
                <HandleRemoveFilter {...this.props} stations={stations} deviceTypes={deviceTypes} onSearch={this.onChangeFilter} />
                <HandleRemoveTable {...this.props} />
            </div>
        )
    }
}
export default (HandleRemoveContainer)