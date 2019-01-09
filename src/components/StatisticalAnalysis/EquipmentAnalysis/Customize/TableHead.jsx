import React, { Component } from "react";
import styles from "./customize.scss";
import PropTypes from 'prop-types';
import { Select } from 'antd';
import moment from 'moment';
import StationSelect from "../../../Common/StationSelect";
const Option = Select.Option;

class CustomizeTable extends Component {
    static propTypes = {
        stations: PropTypes.array,
        stationCode: PropTypes.array,
        manufacturer: PropTypes.string,
        getManufacturer: PropTypes.func,
        getDevicemode: PropTypes.func,
        getDetailData: PropTypes.func,
        devicemodeList: PropTypes.array,
        manufacturerList: PropTypes.array,
        anotherManufacturerList: PropTypes.array,
        deviceTypeCode: PropTypes.string,
        anotherDevicemodeList: PropTypes.array,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        type: PropTypes.string,
    }

    constructor(props, context) {
        super(props, context)
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
        const stationCode = [];
        const { type } = this.props;
        value.forEach(e => stationCode.push(e.stationCode))
        this.props.getManufacturer({ params: { stationCode: stationCode }, resultName: this.getName(type)[0] })
    }

    manufacturerSelect = (value) => { // 厂家选择
        const { stationCode, type } = this.props;
        this.props.getDevicemode({ params: { stationCode: stationCode, manufacturer: value }, resultName: this.getName(type)[1] })
    }

    devicemodeListSelect = (value) => { // 设备选择
        const { stationCode, deviceTypeCode, startDate, endDate, manufacturer, type } = this.props;
        const params = { stationCode, deviceTypeCode, startDate, endDate, deviceModeIds: [value], manufacturer }
        this.props.getDetailData({ params, resultName: this.getName(type)[2] })
    }


    render() {
        const { stations, manufacturerList,anotherManufacturerList, anotherDevicemodeList, devicemodeList, type, } = this.props;
        const manufacturer=type==='base'?manufacturerList:anotherManufacturerList;
        const device=type==='base'?devicemodeList:anotherDevicemodeList;
        return (
            <div className={styles.selectCondition}>
                <StationSelect
                    data={stations.filter(e => e.stationType === 1)}
                    holderText={"全部电站"}
                    onChange={this.stationSelected}
                    style={{ width: 120 }}
                />
                <Select style={{ width: 120, marginLeft: 4 }} placeholder={'厂家选择'} onChange={this.manufacturerSelect}>
                    {manufacturer.map(e => {
                        return <Option value={e.manufacturer} key={e.manufacturer}>{e.manufacturer}</Option>
                    })}
                </Select>
                <Select style={{ width: 120, marginLeft: 4 }} placeholder={'设备选择'} onChange={this.devicemodeListSelect}>
                    {device.map(e => {
                        return <Option value={e.deviceModeId} key={e.deviceModeId}>{e.deviceModeName}</Option>
                    })}
                </Select>
            </div>
        )
    }
}

export default CustomizeTable