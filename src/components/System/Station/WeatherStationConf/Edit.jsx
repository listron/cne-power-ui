import React, { Component } from 'react';
import { Table, Button, message } from 'antd';
import PropTypes from 'prop-types';
import styles from './weatherStation.scss';
import WarningTip from '../../../Common/WarningTip';
import StationSelect from '../../../Common/StationSelect';
import { Icon } from 'antd'


class WeatherList extends Component {
    static propTypes = {
        editList: PropTypes.object,
        getEditWeather: PropTypes.func,
        changeWeatherStationStore: PropTypes.func,
        weatherStation: PropTypes.array,
    }

    constructor(props) {
        super(props);
        this.state = {
            showWarningTip: false,
            warningTipText: '确认使用该气象站吗？',
            subordinateStationCode: null,
            stationData: [{}],
        }
    }

    componentWillReceiveProps(nextProps) {
        const { stationData } = this.state;
        const { editList } = nextProps;
        if (stationData[0].stationCode !== editList.stationCode) {
            this.setState({
                stationData: [{
                    stationCode: editList.subordinateStationCode,
                    stationName:editList.subordinateStation
                }]
            })
        }

    }

    callBack = () => {
        this.props.changeWeatherStationStore({ pageStatus: 'list', })
    }

    cancelWarningTip = () => {
        this.setState({ showWarningTip: false })
    }

    confirmWarningTip = () => {
        const { editList } = this.props;
        const { stationCode } = editList;
        const { subordinateStationCode } = this.state;
        this.props.getEditWeather({
            stationCode,
            subordinateStationCode: subordinateStationCode || editList.subordinateStationCode,
        });
        this.setState({
            showWarningTip: false,
        })
    }

    save = () => {
        this.setState({ showWarningTip: true })
    }

    cancle = () => {
        this.props.changeWeatherStationStore({ pageStatus: 'list' })
    }

    selectStation = (value) => {
        const stationCode = value.length > 0 && value[0].stationCode || null;
        this.setState({ subordinateStationCode: stationCode, stationData: value })
    }




    render() {
        const { showWarningTip, stationData } = this.state;
        const { editList = {}, weatherStation = [] } = this.props;
        return (
            <div className={styles.editWeather}>
                {showWarningTip &&
                    <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={'确认使用该气象站吗？'}
                    />}
                <div className={styles.editTop}>
                    <div className={styles.topTitle}>
                        <span className={styles.text}>编辑</span>
                        <span className={styles.tips}> 注：修改气象站配置后，电站相关指标当天值会发生变化</span>
                    </div>
                    <Icon type="arrow-left" className={styles.backIcon} onClick={this.callBack} />
                </div>
                <div className={styles.editCont}>
                    <div className={styles.column}>
                        <span className={styles.label}> 电站名称</span>
                        <span>{editList.stationName}</span>
                    </div>
                    <div className={styles.column}>
                        <span className={styles.label}>气象站所属电站 <i>*</i></span>
                        <StationSelect
                            value={stationData}
                            data={weatherStation}
                            onChange={this.selectStation}
                        />
                    </div>
                    <div className={styles.column}>
                        <span className={styles.label} />
                        <Button onClick={this.cancle} className={styles.cancle}> 取消</Button>
                        <Button onClick={this.save} type={'primary'}> 保存</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default WeatherList;
