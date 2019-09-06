import React, { Component } from 'react';
import styles from './customize.scss';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import moment from 'moment';
import StationSelect from '../../../Common/StationSelect';
const Option = Select.Option;

class TableHead extends Component {
    static propTypes = {
        stations: PropTypes.array,
        stationCode: PropTypes.number,
        manufacturer: PropTypes.string,
        getManufacturer: PropTypes.func,
        getDevicemode: PropTypes.func,
        getDetailData: PropTypes.func,
        onChange: PropTypes.func,
        devicemodeList: PropTypes.array,
        manufacturerList: PropTypes.array,
        anotherManufacturerList: PropTypes.array,
        deviceTypeCode: PropTypes.string,
        anotherDevicemodeList: PropTypes.array,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        type: PropTypes.string,
        deviceTypeNameLike: PropTypes.string,
        theme: PropTypes.string,
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            stationCode: null, // 电站编码
            manufacturer: null, //生产厂商
            deviceModeId: null, //设备型号ID
        };
    }


    getName = (type) => {
        let result = [];
        switch (type) {
            case 'base': result = ['manufacturerList', 'devicemodeList', 'detailData']; break;
            case 'compared': result = ['anotherManufacturerList', 'anotherDevicemodeList', 'anotherDetailData']; break;
            default: result = []; break;
        }
        return result;
    }

    stationSelected = (value) => { // 电站选择
        const { type, deviceTypeNameLike } = this.props;
        const stationCode = value.length > 0 ? value[0].stationCode : null;
        this.setState({ stationCode, manufacturer: null, deviceModeId: null });
        this.props.getManufacturer({ params: { stationCode: stationCode, deviceTypeNameLike }, resultName: this.getName(type)[0] });
        this.props.onChange({ stationCode, deviceModeId: null, manufacturer: null });
    }

    manufacturerSelect = (value) => { // 厂家选择
        const { stationCode } = this.state;
        const { type, deviceTypeNameLike } = this.props;
        this.props.getDevicemode({ params: { stationCode: stationCode, manufacturer: value, deviceTypeNameLike }, resultName: this.getName(type)[1] });
        this.setState({ manufacturer: value, deviceModeId: null });
        this.props.onChange({ stationCode, deviceModeId: null, manufacturer: value });
    }

    devicemodeListSelect = (value) => { // 设备选择
        const { startDate, endDate, deviceTypeCode, type, deviceTypeNameLike } = this.props;
        const { stationCode, manufacturer } = this.state;
        const params = { stationCode, deviceTypeCode, startDate, endDate, deviceModeId: value, manufacturer, deviceTypeNameLike };
        this.setState({ deviceModeId: value });
        this.props.onChange({ stationCode, deviceModeId: value, manufacturer });
        this.props.getDetailData({ params, resultName: this.getName(type)[2] });
    }


    render() {
        const { stations, manufacturerList, anotherManufacturerList, anotherDevicemodeList, devicemodeList, type, theme } = this.props;
        const { stationCode, manufacturer, deviceModeId } = this.state;
        const manufacturers = type === 'base' ? manufacturerList : anotherManufacturerList;
        const device = type === 'base' ? devicemodeList : anotherDevicemodeList;
        return (
            <div className={styles.selectCondition}>
                <span ref="wrap" />
                <StationSelect
                    data={stations.filter(e => e.stationType === 1)}
                    holderText={'全部电站'}
                    theme={theme}
                    onChange={this.stationSelected}
                    style={{ width: 120 }}
                />
                <Select
                    style={{ width: 120, marginLeft: 4 }}
                    placeholder={'厂家选择'}
                    onChange={this.manufacturerSelect}
                    disabled={stationCode ? false : true}
                    value={manufacturer}
                    getPopupContainer={() => this.refs.wrap}
                >
                    {manufacturers.map(e => {
                        return <Option value={e.manufacturer} key={e.manufacturer} title={e.manufacturer}>{e.manufacturer}</Option>;
                    })}
                </Select>
                <Select
                    style={{ width: 120, marginLeft: 4 }}
                    placeholder={'设备选择'}
                    onChange={this.devicemodeListSelect}
                    disabled={manufacturer ? false : true}
                    value={deviceModeId}
                    getPopupContainer={() => this.refs.wrap}
                >
                    {device.map(e => {
                        return <Option value={e.deviceModeId} key={e.deviceModeId}>{e.deviceModeName}</Option>;
                    })}
                </Select>
            </div>
        );
    }
}

export default TableHead;
