import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import styles from './pvStation.scss';
const Option = Select.Option;
import DeviceList from './DeviceList/DeviceList';

class PvDevice extends Component {
    static propTypes = {
        changeSingleStationStore: PropTypes.func

    }

    constructor() {
        super();

    }

    getDeviceTypeFlow = (deviceTypeFlow, list = []) => {
        deviceTypeFlow.forEach(e => {
            if (!(list.some(item => item.deviceTypeCode === e.code))) {
                list.push({
                    deviceTypeCode: e.code,
                    deviceTypeName: e.name,
                })
                if (e.parents) {
                    this.getDeviceTypeFlow(e.parents, list)
                }
            }
        })
        return list
    }


    deviceSelect = (value) => {
        // console.log('value', value)
        this.props.changeSingleStationStore({ deviceTypeCode: value });
    }


    render() {
        // const deviceTypeFlow = [{
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
        // }]
        const {deviceTypeFlow,deviceTypeCode}=this.props;
        const deviceTypeList = this.getDeviceTypeFlow([deviceTypeFlow]);
        return (
            <div className={`${styles.pvDeviceCont} ${styles.pvDeviceContnormal} ${styles.darkContnormal}`}>
                <div className={styles.top}>
                    <Select
                        value={deviceTypeCode}
                        style={{ width: 140 }}
                        onChange={this.deviceSelect}
                    >
                        <Option value={'1'}>{'示意图'}</Option>
                        {deviceTypeList.map((item) => {
                            return <Option value={item.deviceTypeCode} key={item.deviceTypeCode}>{item.deviceTypeName}</Option>
                        })}
                        <Option value={'0'}>{'电能表'}</Option>
                        <Option value={'203'}>{'气象站'}</Option>
                    </Select>
                    <div className={styles.icon}> <i className={'iconfont icon-examine1'}></i></div>
                </div>
                <div className={styles.deviceList} >
                    <DeviceList {...this.props} deviceTypeList={deviceTypeList} />
                </div>
            </div>
        )
    }
}

export default PvDevice