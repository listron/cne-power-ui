import React, { Component } from "react";
import { Popover, } from 'antd';
import PropTypes from 'prop-types';
import styles from "./scoreAnalysis.scss";
import PvStationTable from './PvStationTable';
import { Link } from 'react-router-dom';
import { dataFormats } from '../../../../utils/utilFunc'
class StationScoreList extends Component {
    static propTypes = {
        dataList: PropTypes.array,
        onChange: PropTypes.func,
        sigleData: PropTypes.object,

    };

    static defaultProps = {
        hasReportType: true,
    }

    constructor(props) {
        super(props);
        this.state = {

        }
    }


    popoverChange = (visible, data) => {
        if (visible) {
            this.props.onChange(data)
        }
    }


    render() {
        const { dataList, sigleData, hasReportType } = this.props;
        return (
            <div className={styles.stationCardContainer} id={"stationCardContainer"}>
                {dataList.map(item => {
                    const scoreLevel = ['优秀', '良好', '合格', '较差'][item.scoreLevel - 1] || '--'
                    if (!hasReportType) {
                        return (
                            <Link to={`/statistical/stationaccount/allstation/${item.stationCode}`} key={item.stationCode} className={`${styles.stationCard} ${styles.uncategorized}`}>
                                <div>
                                    <p className={styles.stationName}>{item.stationName}</p>
                                    <div className={`${styles.scoreCircleCon}`}>
                                        <div className={`${styles.evaluate} ${styles.nodata}`}>
                                            <p>{'未分类'}</p>
                                        </div>
                                    </div>
                                    <div className={styles.scoreCardBottom}>
                                        <p className={styles.installedCapacity}>
                                            <span className={styles.name}>装机容量</span>
                                            <span className={styles.value}>{dataFormats(item.stationCapacity, '--', 2, true)}MW
                                    </span>
                                        </p>
                                        <p className={styles.equivalent}>
                                            <span className={styles.name}>发电等效时</span>
                                            <span className={styles.value}>{dataFormats(item.equivalentHours, '--', 2, true)}h
                                        </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )
                    }

                    return (<Popover
                        content={<PvStationTable sigleData={sigleData} />}
                        trigger="hover" key={item.stationCode}
                        onVisibleChange={(visible) => { this.popoverChange(visible, item) }}
                        arrowPointAtCenter={true}
                        overlayClassName={styles.card}
                    >
                        <Link to={`/statistical/stationaccount/allstation/${item.stationCode}`} key={item.stationCode} className={`${styles.stationCard} ${styles[['excellent', 'good', 'qualified', 'poor'][sigleData.scoreLevel - 1] || 'poor']}`}>
                            <div>
                                <p className={styles.stationName}>{item.stationName}</p>
                                <div className={`${styles.scoreCircleCon}`}>
                                    {
                                        item.scoreValue && <div className={styles.evaluate}>
                                            <p className={styles.num}>{item.scoreValue || '--'}</p>
                                            <p className={styles.text}>{scoreLevel}</p>
                                        </div> ||
                                        <div className={`${styles.evaluate} ${styles.nodata}`}>
                                            <p>{'数据缺失'}</p>
                                        </div>
                                    }
                                </div>
                                <div className={styles.scoreCardBottom}>
                                    <p className={styles.installedCapacity}>
                                        <span className={styles.name}>装机容量</span>
                                        <span className={styles.value}>{dataFormats(item.stationCapacity, '--', 2, true)}MW
                                    </span>
                                    </p>
                                    <p className={styles.equivalent}>
                                        <span className={styles.name}>发电等效时</span>
                                        <span className={styles.value}>{dataFormats(item.equivalentHours, '--', 2, true)}h
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </Popover>
                    )
                })}

            </div>
        )
    }
}
export default StationScoreList;