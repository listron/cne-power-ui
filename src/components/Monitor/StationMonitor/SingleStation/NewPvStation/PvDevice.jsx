import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import styles from './pvStation.scss';
const Option = Select.Option;


class PvDevice extends Component {
    static propTypes = {

    }

    deviceSelect = (value) => {
        console.log('value', value)
    }

    render() {
        const deviceTypeFlow = [
            {
                "deviceTypeCode": 509,
                "deviceTypeId": null,
                "deviceTypeName": "光伏组件"
            },
            {
                "deviceTypeCode": 202,
                "deviceTypeId": null,
                "deviceTypeName": "汇流箱"
            },
            {
                "deviceTypeCode": 206,
                "deviceTypeId": null,
                "deviceTypeName": "组串式逆变器"
            },
            {
                "deviceTypeCode": 201,
                "deviceTypeId": null,
                "deviceTypeName": "集中式逆变器"
            },
            {
                "deviceTypeCode": 304,
                "deviceTypeId": null,
                "deviceTypeName": "箱变"
            },
            {
                "deviceTypeCode": 302,
                "deviceTypeId": null,
                "deviceTypeName": "集电线路"
            },
            {
                "deviceTypeCode": 301,
                "deviceTypeId": null,
                "deviceTypeName": "升压站"
            },
        ]
        return (
            <div className={`${styles.pvDeviceCont} ${styles.pvDeviceContnormal} ${styles.darkContnormal}`}>
                <Select
                    defaultValue={'picture'}
                    style={{ width: 120 }}
                    suffixIcon={<i className={'iconfont icon-content'}></i>}
                    open={true}
                    onChange={this.deviceSelect}>
                    <Option value={'picture'}>{'示意图'}</Option>
                    {deviceTypeFlow.map((item) => {
                        return <Option value={item.deviceTypeCode}>{item.deviceTypeName}</Option>
                    })}
                </Select>
            </div>
        )
    }
}

export default PvDevice