import React, { Component } from "react";
import { Popover, } from 'antd';
import PropTypes from 'prop-types';
import styles from "./scoreAnalysis.scss";
import PvStationTable from './PvStationTable';
import { Link } from 'react-router-dom';
import {dataFormats} from '../../../../utils/utilFunc'
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



    getLevel = (e) => {
        let result = '';
        switch (e) {
            case "1": result = '优秀'; break;
            case "2": result = '良好'; break;
            case "3": result = '合格'; break;
            case "4": result = '较差'; break;
            default: result = '--'
                break;
        }
        return result;

    }

    getColor = (level) => {
        let result = '';
        switch (level) {
            case "1": result = 'excellent'; break;
            case "2": result = 'good'; break;
            case "3": result = 'qualified'; break;
            case "4": result = 'poor'; break;
            default: result = 'poor'
        }
        return result
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
                    if (!hasReportType) {
                        return (
                            <Link to={`/statistical/stationaccount/allstation/${item.stationCode}`} key={item.stationCode} className={`${styles.stationCard} ${styles.uncategorized}`}>
                                <div>
                                    <p className={styles.stationName}>{item.stationName}</p>
                                    <div className={`${styles.scoreCircleCon}`}>
                                        {
                                            item.scoreValue && <div className={styles.evaluate}>
                                                <p className={styles.num}>{item.scoreValue || '--'}</p>
                                                <p className={styles.text}>{this.getLevel(item.scoreLevel)}</p>
                                            </div> ||
                                            <div className={`${styles.evaluate} ${styles.nodata}`}>
                                                <p>{'未分类'}</p>
                                            </div>
                                        }
                                    </div>
                                    <div className={styles.scoreCardBottom}>
                                        <p className={styles.installedCapacity}>装机容量 {dataFormats(item.stationCapacity,'--',2,true)}MW</p>
                                        <p className={styles.equivalent}>发电等效时 {dataFormats(item.equivalentHours,'--',2,true)}h</p>
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
                        <Link to={`/statistical/stationaccount/allstation/${item.stationCode}`} key={item.stationCode} className={`${styles.stationCard} ${styles[this.getColor(item.scoreLevel)]}`}>
                            <div>
                                <p className={styles.stationName}>{item.stationName}</p>
                                <div className={`${styles.scoreCircleCon}`}>
                                    {
                                        item.scoreValue && <div className={styles.evaluate}>
                                            <p className={styles.num}>{item.scoreValue || '--'}</p>
                                            <p className={styles.text}>{this.getLevel(item.scoreLevel)}</p>
                                        </div> ||
                                        <div className={`${styles.evaluate} ${styles.nodata}`}>
                                            <p>{'数据缺失'}</p>
                                        </div>
                                    }
                                </div>
                                <div className={styles.scoreCardBottom}>
                                    <p className={styles.installedCapacity}>装机容量 {dataFormats(item.stationCapacity,'--',2,true)}MW</p>
                                    <p className={styles.equivalent}>发电等效时 {dataFormats(item.equivalentHours,'--',2,true)}h</p>
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