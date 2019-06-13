import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import styles from './pvStation.scss';
const Option = Select.Option;


class PvDevice extends Component {
    static propTypes = {
        changeSingleStationStore: PropTypes.func,
        deviceTypeFlow: PropTypes.object,
        deviceTypeCode: PropTypes.string,

    }

    constructor() {
        super();
        this.state = {
            choiceCode: '1'
        }

    }

    componentDidUpdate(prevProps) {
        const { deviceTypeCode } = prevProps;
        const { choiceCode } = this.state;
        if (deviceTypeCode !== choiceCode) {
            this.setState({ choiceCode: deviceTypeCode })
        }
    }

    getDeviceTypeFlow = (deviceTypeFlow, list = []) => { // 流程图
        deviceTypeFlow.forEach(e => {
            if (!(list.some(item => item.deviceTypeCode === e.code))) {
                list.push({
                    deviceTypeCode: e.code,
                    deviceTypeName: e.name,
                    key: e.code,
                })
                if (e.parents) {
                    this.getDeviceTypeFlow(e.parents, list)
                }
            }
        })
        return list
    }

    deviceSelect = (value) => {
        setTimeout(()=>{this.setState({ choiceCode: value })},0) 
        this.props.changeSingleStationStore({ deviceTypeCode: value });
    }

    goSchematic = () => { // 返回示意图
        this.setState({ choiceCode: '1' });
        this.props.changeSingleStationStore({ deviceTypeCode: '1' });
    }




    render() {
        const { deviceTypeFlow, deviceTypeCode } = this.props;
        const deviceTypeList = this.getDeviceTypeFlow([deviceTypeFlow]);
        const { choiceCode } = this.state;
        return (
            <div className={`${styles.pvDeviceCont} ${styles.pvDeviceContnormal} ${styles.darkContnormal}`}>
                <div className={styles.top}>
                    {<Select
                        value={choiceCode}
                        style={{ width: 140 }}
                        onChange={this.deviceSelect}
                    >
                        <Option value={'1'} key={'1'} >{'示意图'}</Option>
                        {deviceTypeList.map((item) => {
                            return <Option value={item.deviceTypeCode} key={item.deviceTypeCode}>{item.deviceTypeName}</Option>
                        })}
                        <Option value={'0'} key={'0'}>{'电能表'}</Option>
                        <Option value={'203'} key={'203'}>{'气象站'}</Option>
                    </Select>}
                    <div className={`${deviceTypeCode === '1' && styles.icon} ${styles.activeIcon}`} onClick={this.goSchematic}> <i className={'iconfont icon-back2'}></i></div>
                </div>

            </div>
        )
    }
}

export default PvDevice