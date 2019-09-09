import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './operate.scss';
// import FilterCondition from '../../../Common/FilterCondition/FilterCondition';
import FilterCondition from '../../../Common/FilterConditions/FilterCondition';
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
        getFlowList: PropTypes.func,
        theme: PropTypes.string,
        changeFlowStore: PropTypes.func,
    }


    constructor() {
        super();
    }

    componentDidMount() {

    }

    onChangeTab = (e) => { // 切换状态
        const { listQueryParams, commonQueryParams } = this.props;
        this.props.getFlowList({ listQueryParams, commonQueryParams: { ...commonQueryParams, stateCode: e.target.value } });
    }


    filterCondition = (value) => {
        const { listQueryParams } = this.props;
        const { rangeTimes, IsMy, stationCodes } = value;
        const [startTime, endTime] = rangeTimes;
        this.props.changeFlowStore({ commonQueryParams: { startTime, endTime, stationCodes, IsMy: +IsMy } });
        this.props.getFlowList({ listQueryParams, commonQueryParams: { startTime, endTime, stationCodes, IsMy: +IsMy } });
    }

    render() {
        const { stations, statusList, username, commonQueryParams = {}, theme } = this.props;
        const { stateCode, stationCodes, IsMy, startTime, endTime } = commonQueryParams;
        return (
            <div className={`${styles.condition} ${styles[theme]}`}>
                {/* <FilterCondition
                    option={['stationName', 'time', 'myJoin']}
                    stations={stations}
                    username={username}
                    onChange={this.filterCondition}
                    myJoinText={'我的待办'}
                    theme={theme}
                /> */}
                <FilterCondition
                    onChange={this.filterCondition}
                    theme={theme}
                    option={[
                        {
                            name: '电站名称',
                            type: 'parentCheckBox',
                            belong: 'stationName',
                            typeName: 'stationCodes',
                            data: stations,
                        },
                        {
                            name: ' 发生时间',
                            type: 'time',
                            belong: 'timeSelect',
                            typeName: 'rangeTimes',
                        },
                        {
                            name: '我的待办',
                            type: 'switch',
                            typeName: 'IsMy',
                        },
                    ]}
                    value={{ stationCodes, IsMy, rangeTimes: [startTime, endTime] }}
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
