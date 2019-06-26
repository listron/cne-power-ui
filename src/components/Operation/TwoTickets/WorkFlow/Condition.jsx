import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from './workFlow.scss';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';
import { Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class Condition extends Component {
    static propTypes = {
        stations: PropTypes.array,
        statusList: PropTypes.array,
        username: PropTypes.string,
        getDocketStatus: PropTypes.func,
        commonQueryParams: PropTypes.object,
        listQueryParams: PropTypes.object,
        getDocketTypeList: PropTypes.func,
        getFlowList: PropTypes.func,
        docketTypeList: PropTypes.array,
    }


    constructor() {
        super()
        this.state = {
            status: ''
        }

    }

    componentDidMount() {
        const { getDocketTypeList } = this.props;
        getDocketTypeList()
    }

    onChangeTab = (e) => { // 切换状态
        const { listQueryParams, commonQueryParams } = this.props;
        this.props.getFlowList({ listQueryParams, commonQueryParams: { ...commonQueryParams, stateCode: e.target.value } })
    }


    filterCondition = (value) => {
        let { listQueryParams, commonQueryParams } = this.props;
        this.props.getFlowList({ listQueryParams, commonQueryParams: { ...commonQueryParams, ...value } })
        this.props.getDocketStatus({ ...commonQueryParams, ...value })
    }

    render() {
        const { stations, statusList, username, commonQueryParams = {},docketTypeList=[] } = this.props;
        const { stateCode } = commonQueryParams;
        return (
            <div className={styles.workflow}>
                <FilterCondition
                    option={['stationName', 'docketType', 'time', 'myJoin']}
                    stations={stations.filter(e => e.stationType === 1)}
                    username={username}
                    docketTypeList={docketTypeList}
                    onChange={this.filterCondition}
                />
                <div className={styles.statusGroup}>
                    <div className={styles.text}><span>状</span><span>态</span></div>
                    <RadioGroup onChange={this.onChangeTab} value={stateCode}>
                        <RadioButton value="">全部</RadioButton>
                        {statusList.map(e => {
                            return (<RadioButton value={e.stateCode} key={e.stateCode}>{e.stateDesc} <span>{e.totalNum}</span></RadioButton>)
                        })}
                    </RadioGroup>
                </div>
            </div>
        )
    }
}


export default Condition 