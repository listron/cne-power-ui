import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './handleRemove.scss';
import WarningStatisticTop from '../commonArea/WarningStatisticTop';
import HandleRemoveFilter from './HandleRemoveFilter';
import HandleRemoveTable from './HandleRemoveTable';




class HandleRemoveContainer extends Component {
    static propTypes = {
        getHandleRemoveStatistic: PropTypes.func,
        warningTypeStatus: PropTypes.string,
        warningStatus: PropTypes.string,
        warningType: PropTypes.string,
        getHandleRemoveList: PropTypes.func,
        changeHandleRemoveStore: PropTypes.func,
        getHandleRemoveInfo: PropTypes.func,
        getHandleRemoveTransfer: PropTypes.func,
        onChangeFilter: PropTypes.func,
        relieveInfo: PropTypes.object,
        handleRemoveList: PropTypes.array,
        theme: PropTypes.string,
    }
    constructor(props, context) {
        super(props, context);
    }
    componentDidMount() {
        const { getHandleRemoveStatistic, warningStatus, warningType } = this.props;
        getHandleRemoveStatistic({ warningStatus, warningType });
        this.queryTransferFrom();
    }
    onChangeFilter = (value) => {

        this.queryTransferFrom(value);
    }

    queryTransferFrom = (value) => {
        const { getHandleRemoveList, warningTypeStatus, warningType, stationType, rangTime, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType, pageSize, pageNum } = this.props;
        const params = { warningTypeStatus, warningType, stationType, rangTime, deviceTypeCode, warningLevel, stationCodes, orderField, orderCommand, deviceName, durationType, pageSize, pageNum };
        getHandleRemoveList({ ...params, ...value });
    }
    render() {
        const { stations, deviceTypes, theme } = this.props;

        return (
            <div className={`${styles.handleRemoveContainer} ${styles[theme]}`}>
                <WarningStatisticTop {...this.props} warningStatus={'2'} />
                <HandleRemoveFilter {...this.props} stations={stations} deviceTypes={deviceTypes} onSearch={this.onChangeFilter} />
                <HandleRemoveTable {...this.props} onChangeFilter={this.onChangeFilter} />
            </div>
        );
    }
}
export default (HandleRemoveContainer)
;