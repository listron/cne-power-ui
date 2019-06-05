import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import styles from './pvStation.scss';
const Option = Select.Option;
import DeviceList from './DeviceList/DeviceList';

class PvDevice extends Component {
    static propTypes = {
        changeSingleStationStore: PropTypes.func,
        deviceTypeFlow: PropTypes.object,
        deviceTypeCode: PropTypes.string,

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
                    key:e.code,
                })
                if (e.parents) {
                    this.getDeviceTypeFlow(e.parents, list)
                }
            }
        })
        return list
    }


    deviceSelect = (value) => {
        this.props.changeSingleStationStore({ deviceTypeCode: value });
    }

    goSchematic=()=>{ // 返回示意图
        this.props.changeSingleStationStore({ deviceTypeCode: '1' });
    }


    render() {
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
                        <Option value={'1'} key={'1'} >{'示意图'}</Option>
                        {deviceTypeList.map((item) => {
                            return <Option value={item.deviceTypeCode} key={item.deviceTypeCode}>{item.deviceTypeName}</Option>
                        })}
                        <Option value={'0'} key={'0'}>{'电能表'}</Option>
                        <Option value={'203'} key={'203'}>{'气象站'}</Option>
                    </Select>
                    
                    <div className={`${deviceTypeCode==='1'&& styles.icon} ${styles.activeIcon}`} onClick={this.goSchematic}> <i className={'iconfont icon-back2'}></i></div>
                </div>
                <div className={styles.deviceList} >
                    <DeviceList {...this.props} deviceTypeList={deviceTypeList} />
                </div>
            </div>
        )
    }
}

export default PvDevice