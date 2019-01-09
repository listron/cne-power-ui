import React, { Component } from "react";
import styles from "./customize.scss";
import PropTypes from 'prop-types';
import { Select } from 'antd';
import moment from 'moment';
import StationSelect from "../../../Common/StationSelect";
import TableHead from './TableHead';
const Option = Select.Option;

class CustomizeTable extends Component {
    static propTypes = {
        stations: PropTypes.array,
        stationCode: PropTypes.array,
        manufacturer: PropTypes.string,
        getManufacturer: PropTypes.func,
        getDevicemode: PropTypes.func,
        devicemodeList: PropTypes.array,
        manufacturerList: PropTypes.array,
    }

    constructor(props, context) {
        super(props, context)
    }



    render() {
        const { stations, manufacturerList, devicemodeList, detailData, anotherDetailData } = this.props;
        console.log('manufacturerList', detailData)
        return (
            <div className={styles.table}>
                <div className={styles.tHead}>
                    <div className={styles.option}>设备选择</div>
                    <TableHead {...this.props} type={'base'} />
                    <TableHead {...this.props} type={'compared'} />
                </div>
                <div className={styles.tBody}>
                    <div>
                        <span className={styles.option}>电站</span>
                        <span className={styles.base}>{detailData.stationCode || '--'}</span>
                        <span className={styles.compare}>{anotherDetailData.stationCode || '--'}</span>
                    </div>
                    <div>
                        <span className={styles.option}>厂家</span>
                        <span className={styles.base}>{detailData.manufacturer || '--'}</span>
                        <span className={styles.compare}>{anotherDetailData.manufacturer || '--'}</span>
                    </div>
                    <div>
                        <span className={styles.option}>型号</span>
                        <span className={styles.base}>{detailData.deviceModeName || '--'}</span>
                        <span className={styles.compare}>{anotherDetailData.deviceModeName || '--'}</span>
                    </div>
                    <div>
                        <span className={styles.option}>额定功率</span>
                        <span className={styles.base}>{detailData.powerRating || '--'}</span>
                        <span className={styles.compare}>{anotherDetailData.powerRating || '--'}</span>
                    </div>
                    <div>
                        <span className={styles.option}>转换效率</span>
                        <span className={styles.base}>{detailData.conversioneff || '--'}</span>
                        <span className={styles.compare}>{anotherDetailData.conversioneff || '--'}</span>
                    </div>
                    <div>
                        <span className={styles.option}>可利用率</span>
                        <span className={styles.base}>{detailData.availability || '--'}</span>
                        <span className={styles.compare}>{anotherDetailData.availability || '--'}</span>
                    </div>
                    <div>
                        <span className={styles.option}>故障次数</span>
                        <span className={styles.base}>{detailData.faultNum || '--'}</span>
                        <span className={styles.compare}>{anotherDetailData.faultNum || '--'}</span>
                    </div>
                    <div>
                        <span className={styles.option}>故障时长</span>
                        <span className={styles.base}>{detailData.faultHours || '--'}</span>
                        <span className={styles.compare}>{anotherDetailData.faultHours || '--'}</span>
                    </div>
                </div>

            </div>
        )
    }
}

export default CustomizeTable