import React, { Component } from 'react';
import { Popover } from 'antd';
import PropTypes from 'prop-types';
import styles from './scoreAnalysis.scss';
import PvStationTable from './PvStationTable';
import { Link } from 'react-router-dom';
import { dataFormats } from '../../../../utils/utilFunc';
class StationScoreList extends Component {
    static propTypes = {
        dataList: PropTypes.array,
        onChange: PropTypes.func,
        singleData: PropTypes.object,

    };

    static defaultProps = {
        hasReportType: true,
    }

    constructor(props) {
        super(props);
        this.state = {

        };
    }



    popoverChange = (visible, data) => {
        if (visible) {
            this.props.onChange(data);
        }
    }

    listContent = (item) => {
        const scoreLevelName = ['excellent', 'good', 'qualified', 'poor'][item.scoreLevel - 1] || 'poor';
        const scoreLevel = ['优秀', '良好', '合格', '较差'][item.scoreLevel - 1] || '--';
        return (<Link to={`/statistical/stationaccount/allstation/${item.stationCode}`} key={item.stationCode} className={`${styles.stationCard} ${styles[scoreLevelName]}`}>
            <div>
                <p className={styles.stationName}>{item.stationName}</p>
                <div className={`${styles.scoreCircleCon}`}>
                    <div className={styles.innerBox}>
                        {
                            item.scoreValue && <div className={styles.evaluate}>
                                <p className={styles.num}>{dataFormats(item.scoreValue, '--', 2, true)}</p>
                                <p className={styles.text}>{scoreLevel}</p>
                            </div> ||
                            <div className={`${styles.evaluate} ${styles.nodata}`}>
                                <p>{'数据缺失'}</p>
                            </div>
                        }
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
        </Link>);
    }


    render() {
        const { dataList = [], singleData, hasReportType, theme } = this.props;
        return (
            <div className={`${styles.stationCardContainer}`} id={'stationCardContainer'} >
                <span ref={'popover'} />
                {dataList.map(item => {
                    if (!hasReportType) { // 未分类
                        return (
                            <Link to={`/statistical/stationaccount/allstation/${item.stationCode}`} key={item.stationCode} className={`${styles.stationCard} ${styles.uncategorized}`}>
                                <div>
                                    <p className={styles.stationName}>{item.stationName}</p>
                                    <div className={`${styles.scoreCircleCon}`}>
                                        <div className={styles.innerBox}>
                                            <div className={`${styles.evaluate} ${styles.nodata}`}>
                                                <p>{'未分类'}</p>
                                            </div>
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
                        );
                    }
                    if (!item.scoreValue) { // 数据缺失
                        return this.listContent(item);
                    }

                    return (<Popover
                        content={<PvStationTable singleData={singleData} />}
                        trigger="hover" key={item.stationCode}
                        onVisibleChange={(visible) => { this.popoverChange(visible, item); }}
                        arrowPointAtCenter={true}
                        overlayClassName={styles.card}
                        // visible={true}
                        getPopupContainer={() => this.refs.popover}
                    >
                        {this.listContent(item)}
                    </Popover>
                    );
                })}

            </div>
        );
    }
}
export default StationScoreList;
