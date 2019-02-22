import React, { Component } from "react";
import { Popover, } from 'antd';
import PropTypes from 'prop-types';
import styles from "./scoreAnalysis.scss";
import PvStationTable from './PvStationTable'
class StationScoreList extends Component {
    static propTypes = {
        dataList: PropTypes.array,
        onChange: PropTypes.func,
        sigleData: PropTypes.object,

    };
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



    popoverChange=(visible,data)=>{
        if(visible){
            this.props.onChange(data)
        }
    }


    render() {
        const { dataList,sigleData } = this.props;
        return (
            <div className={styles.stationCardContainer} id={"stationCardContainer"}>
                {dataList.map(item => {
                    return (
                        <Popover 
                        content={<PvStationTable sigleData={sigleData} />} 
                        trigger="click" key={item.stationCode} o
                        onVisibleChange={(visible)=>{this.popoverChange(visible,item)}}
                        arrowPointAtCenter={true}
                        overlayClassName={styles.card}
                        >
                            <div className={`${styles.stationCard} ${styles[this.getColor(item.scoreLevel)]}`}>
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
                                    <p className={styles.installedCapacity}>装机容量 {item.stationCapacity}MW</p>
                                    <p className={styles.equivalent}>发电等效时 {item.equivalentHours}h</p>
                                </div>
                            </div>
                        </Popover>
                    )
                })}

            </div>
        )
    }
}
export default StationScoreList;