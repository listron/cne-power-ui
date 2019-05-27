import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import styles from './pvStation.scss';
const Option = Select.Option;
import DeviceList from './DeviceList/DeviceList';

class PvDevice extends Component {
    static propTypes = {
        changeSingleStationStore:PropTypes.func
    }

    deviceSelect = (value) => {
        console.log('value', value)
        this.props.changeSingleStationStore({ deviceTypeCode:value });
    }

    render() {
        // const deviceTypeFlow={
        //     "code": "509",
        //     "levelLength": 6,
        //     "name": "光伏组件",
        //     "parents": [
        //         {
        //             "code": "206",
        //             "levelLength": 4,
        //             "name": "组串式逆变器",
        //             "parents": [
        //                 {
        //                     "code": "304",
        //                     "levelLength": 3,
        //                     "name": "箱变",
        //                     "parents": [
        //                         {
        //                             "code": "302",
        //                             "levelLength": 2,
        //                             "name": "集电线路",
        //                             "parents": [
        //                                 {
        //                                     "code": "301",
        //                                     "levelLength": 1,
        //                                     "name": "升压站",
        //                                     "parents": []
        //                                 }
        //                             ]
        //                         }
        //                     ]
        //                 }
        //             ]
        //         },
        //         {
        //             "code": "202",
        //             "levelLength": 5,
        //             "name": "汇流箱",
        //             "parents": [
        //                 {
        //                     "code": "201",
        //                     "levelLength": 4,
        //                     "name": "集中式逆变器",
        //                     "parents": [
        //                         {
        //                             "code": "304",
        //                             "levelLength": 3,
        //                             "name": "箱变",
        //                             "parents": [
        //                                 {
        //                                     "code": "302",
        //                                     "levelLength": 2,
        //                                     "name": "集电线路",
        //                                     "parents": [
        //                                         {
        //                                             "code": "301",
        //                                             "levelLength": 1,
        //                                             "name": "升压站",
        //                                             "parents": []
        //                                         }
        //                                     ]
        //                                 }
        //                             ]
        //                         }
        //                     ]
        //                 }
        //             ]
        //         }
        //     ]
        // }
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
                <div className={styles.top}>
                    <Select
                        defaultValue={'picture'}
                        style={{ width: 140 }}
                        onChange={this.deviceSelect}>
                        <Option value={'picture'}>{'示意图'}</Option>
                        {deviceTypeFlow.map((item) => {
                            return <Option value={item.deviceTypeCode} key={item.deviceTypeCode}>{item.deviceTypeName}</Option>
                        })}
                        <Option value={'weather'}>{'气象站'}</Option>
                    </Select>
                    <div className={styles.icon}> <i className={'iconfont icon-examine1'}></i></div>
                </div>
                <div className={styles.deviceList} >
                    <DeviceList {...this.props} />
                </div>
            </div>
        )
    }
}

export default PvDevice