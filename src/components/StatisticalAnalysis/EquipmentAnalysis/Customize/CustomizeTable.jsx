import React, { Component } from "react";
import styles from "./customize.scss";
import PropTypes from 'prop-types';
import TableHead from './TableHead';


class CustomizeTable extends Component {
    static propTypes = {
        stations: PropTypes.array,
        // stationCode: PropTypes.number,
        manufacturer: PropTypes.string,
        getManufacturer: PropTypes.func,
        getDevicemode: PropTypes.func,
        devicemodeList: PropTypes.array,
        manufacturerList: PropTypes.array,
        detailData: PropTypes.object,
        anotherDetailData: PropTypes.object,
        changeCustomizeStore: PropTypes.func,
    }

    constructor(props, context) {
        super(props, context)
    }

    getDefaultData = (vlaue, option) => { // 判断如何显示
        if (option === 'stationName') { // 根据电站来判断
            return vlaue.stionCode ? (vlaue[option] || '--') : '没有电站进行对比'
        }
        return vlaue.stionCode ? (vlaue[option] || '--') : null
    }

    baseChange = (value) => {  // 基础的数据
        this.props.changeCustomizeStore(value)
    }

    comparedChaneg = (value) => { // 作为对比的
        this.props.changeCustomizeStore({
            anotherStationCode:value.stationCode,
            anotherManufacturer:value.manufacturer,
            anotherDeviceModeId:value.deviceModeId,
        })
    }


    render() {
        const { detailData, anotherDetailData } = this.props;
        return (
            <div className={styles.table}>
                <div className={styles.tHead}>
                    <div className={styles.option}>设备选择</div>
                    <TableHead {...this.props} type={'base'} onChange={this.baseChange} />
                    <TableHead {...this.props} type={'compared'} onChange={this.comparedChaneg} />
                </div>
                <div className={styles.tBody}>
                    <div>
                        <span className={styles.option}>电站</span>
                        <span className={styles.base}>{this.getDefaultData(detailData, 'stationName')}</span>
                        <span className={styles.compare}>{this.getDefaultData(anotherDetailData, 'stationName')}</span>
                    </div>
                    <div>
                        <span className={styles.option}>厂家</span>
                        <span className={styles.base}>{this.getDefaultData(detailData, 'manufacturer')}</span>
                        <span className={styles.compare}>{this.getDefaultData(anotherDetailData, 'manufacturer')}</span>
                    </div>
                    <div>
                        <span className={styles.option}>型号</span>
                        <span className={styles.base}>{this.getDefaultData(detailData, 'deviceModeName')}</span>
                        <span className={styles.compare}>{this.getDefaultData(anotherDetailData, 'deviceModeName')}</span>
                    </div>
                    <div>
                        <span className={styles.option}>额定功率</span>
                        <span className={styles.base}>{this.getDefaultData(detailData, 'powerRating')}</span>
                        <span className={styles.compare}>{this.getDefaultData(anotherDetailData, 'powerRating')}</span>
                    </div>
                    <div>
                        <span className={styles.option}>转换效率</span>
                        <span className={styles.base}>{this.getDefaultData(detailData, 'conversioneff')}</span>
                        <span className={styles.compare}>{this.getDefaultData(anotherDetailData, 'conversioneff')}</span>
                    </div>
                    <div>
                        <span className={styles.option}>可利用率</span>
                        <span className={styles.base}>{this.getDefaultData(detailData, 'availability')}</span>
                        <span className={styles.compare}>{this.getDefaultData(anotherDetailData, 'availability')}</span>
                    </div>
                    <div>
                        <span className={styles.option}>故障次数</span>
                        <span className={styles.base}>{this.getDefaultData(detailData, 'faultNum')}</span>
                        <span className={styles.compare}>{this.getDefaultData(anotherDetailData, 'faultNum')}</span>
                    </div>
                    <div>
                        <span className={styles.option}>故障时长</span>
                        <span className={styles.base}>{this.getDefaultData(detailData, 'faultHours')}</span>
                        <span className={styles.compare}>{this.getDefaultData(anotherDetailData, 'faultHours')}</span>
                    </div>
                </div>

            </div>
        )
    }
}

export default CustomizeTable