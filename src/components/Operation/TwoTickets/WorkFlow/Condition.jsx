import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './workFlow.scss';
import FilterCondition from '../../../Common/FilterConditions/FilterCondition';
// import FilterCondition from '../../../Common/FilterCondition/FilterCondition';
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
        theme: PropTypes.string,
        changeFlowStore: PropTypes.func,
    }


    constructor() {
        super();
        this.state = {
            status: '',
        };

    }

    componentDidMount() {
        const { getDocketTypeList } = this.props;
        getDocketTypeList();
    }

    onChangeTab = (e) => { // 切换状态
        const { listQueryParams, commonQueryParams } = this.props;
        this.props.getFlowList({ listQueryParams, commonQueryParams: { ...commonQueryParams, stateCode: e.target.value } });
    }


    filterCondition = (value) => {
        const { listQueryParams } = this.props;
        const { rangeTimes, IsMy, docketTypes, stationCodes } = value;
        const [startTime, endTime] = rangeTimes;
        this.props.changeFlowStore({ commonQueryParams: { startTime, endTime, docketTypes, stationCodes, IsMy: +IsMy } });
        this.props.getFlowList({ listQueryParams, commonQueryParams: { startTime, endTime, docketTypes, stationCodes, IsMy: +IsMy } });
    }

    render() {
        const { stations, statusList, commonQueryParams = {}, docketTypeList = [], theme } = this.props;
        const { stateCode, stationCodes, docketTypes, IsMy, startTime, endTime } = commonQueryParams;
        return (
            <div className={`${styles.condition} ${styles[theme]}`}>
                <FilterCondition
                    onChange={this.filterCondition}
                    theme={theme}
                    option={[
                        {
                            name: ' 发生时间',
                            type: 'time',
                            belong: 'timeSelect',
                            typeName: 'rangeTimes',
                        },
                        {
                            name: '电站名称',
                            type: 'parentCheckBox',
                            belong: 'stationName',
                            typeName: 'stationCodes',
                            data: stations,
                        },
                        {
                            name: '两票类型',
                            type: 'multipleType',
                            belong: 'multipleSelect',
                            typeName: 'docketTypes',
                            rules: ['name', 'id'],
                            data: docketTypeList,
                        },
                        {
                            name: '我的待办',
                            type: 'switch',
                            typeName: 'IsMy',
                        },
                    ]}
                    value={{ stationCodes, docketTypes, IsMy, rangeTimes: [startTime, endTime] }}
                />
                <div className={styles.statusGroup}>
                    <div className={styles.text}><span>状</span><span>态</span></div>
                    <RadioGroup onChange={this.onChangeTab} value={stateCode}>
                        <RadioButton value="">全部</RadioButton>
                        {statusList.map(e => {
                            return (<RadioButton value={e.stateCode} key={e.stateCode}>{e.stateDesc}
                                <span>{e.stateDesc !== '已完成' && e.totalNum}</span>
                            </RadioButton>);
                        })}
                    </RadioGroup>
                </div>
            </div>
        );
    }
}


export default Condition;
