import React, { Component } from 'react';
import { Table, Button, message } from 'antd';
import PropTypes from 'prop-types';
import styles from './weatherStation.scss';
import StationSelect from '../../../Common/StationSelect';
import CommonPagination from '../../../Common/CommonPagination';
import FilterCondition from '../../../Common/FilterConditions/FilterCondition';
import WarningTip from '../../../Common/WarningTip';
import TransitionContainer from '../../../Common/TransitionContainer';
import CneInputSearch from '@components/Common/Power/CneInputSearch';
import CneTable from '@components/Common/Power/CneTable';
import { handleRight } from '@utils/utilFunc';
import EditWeather from './Edit';
const ButtonGroup = Button.Group;


class WeatherList extends Component {
    static propTypes = {
        listParameter: PropTypes.object,
        getWeatherList: PropTypes.func,
        stations: PropTypes.array,
        getUpdateWeather: PropTypes.func,
        totalNum: PropTypes.number,
        loading: PropTypes.bool,
        weatherList: PropTypes.array,
        pageStatus: PropTypes.string,
        changeWeatherStationStore: PropTypes.func,
        getWeatherStation: PropTypes.func,
        keyword: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {
            showWarningTip: false,
            warningTipText: '确认重置山东平原一期的气象站信息么',
            weatherConfigId: null,
            editList: {},
            filterStatus: 'all',
        };
    }

    componentDidMount() {// 初始加载列表
        const { listParameter, getWeatherList } = this.props;
        getWeatherList(listParameter);
    }

    onPaginationChange = ({ currentPage, pageSize }) => {//分页器
        const { listParameter, getWeatherList } = this.props;
        getWeatherList({ ...listParameter, pageNum: currentPage, pageSize });
    };

    /*
    onChangeFilter = (value) => {
        const { listParameter, getWeatherList } = this.props;
        getWeatherList({ ...listParameter, ...value });
    }
    */

    tableChange = (pagination, filter, sorter) => {// 点击表头 排序
        const sortField = sorter.field;
        const ascend = sorter.order === 'descend' ? 2 : 1; // 1 正序 2 倒序
        const { listParameter, getWeatherList } = this.props;
        getWeatherList({ ...listParameter, orderFiled: sortField, orderType: ascend });
    };


    editStaion = (record) => {
        this.setState({ editList: record });
        this.props.changeWeatherStationStore({ pageStatus: 'edit' });
        this.props.getWeatherStation({ stationCode: record.stationCode });
    }

    refresh = (record) => {
        const { stationName, weatherConfigId } = record;
        console.log('weatherConfigId', weatherConfigId);
        this.setState({
            warningTipText: `确认重置${stationName}的气象站信息么`,
            weatherConfigId,
            showWarningTip: true,
        });
    }

    cancelWarningTip = () => {
        this.setState({ showWarningTip: false });
    }

    confirmWarningTip = () => {
        const { weatherConfigId } = this.state;
        this.props.getUpdateWeather({ weatherConfigId });
        this.setState({ showWarningTip: false });
    }

    changefilter = (value) => {
        this.setState({ filterStatus: value });
    }

    doSearch = (str) => {
        const { listParameter, getWeatherList } = this.props;
        getWeatherList({ ...listParameter, keyword: str });
    }

    render() {
    const weatherOperation = handleRight('weatherConfig_operate');
    const operateColumn = {
            title: '操作',
            className: styles.operate,
            render: (text, record) => {
                const { subordinateStationCode, stationCode } = record;
                return (
                    <span>
                        {stationCode && !(subordinateStationCode === stationCode) && <i className="iconfont icon-edit" onClick={() => { this.editStaion(record); }} />}
                        {(stationCode && subordinateStationCode && subordinateStationCode !== stationCode) && <i className="iconfont icon-refresh2" onClick={() => { this.refresh(record); }} />}
                    </span>
                );
            },
        };
        const columns = [
            {
                title: '电站名称',
                dataIndex: 'stationName',
                key: 'stationName',
                defaultSortOrder: 'ascend',
                sorter: true,
                className: styles.stationName,
                render: text => text || '--',
            },
            {
                title: '气象站所属电站',
                dataIndex: 'subordinateStation',
                key: 'subordinateStation',
                sorter: false,
                className: styles.inArea,
                render: text => text || '--',
            },
            {
                title: '最近一次设置日期',
                dataIndex: 'updateDate',
                key: 'updateDate',
                sorter: false,
                className: styles.lastSetTime,
            },
            // {
            //     title: '操作',
            //     className: styles.operate,
            //     render: (text, record) => {
            //         const { subordinateStationCode, stationCode } = record;
            //         return (
            //             <span>
            //                 {stationCode && !(subordinateStationCode === stationCode) && <i className="iconfont icon-edit" onClick={() => { this.editStaion(record); }} />}
            //                 {(stationCode && subordinateStationCode && subordinateStationCode !== stationCode) && <i className="iconfont icon-refresh2" onClick={() => { this.refresh(record); }} />}
            //             </span>
            //         );
            //     },


            // },
        ];

        const { stations = [], listParameter = {}, totalNum, loading, weatherList, pageStatus } = this.props;
        const { pageSize, pageNum } = listParameter;
        const { showWarningTip, warningTipText, editList, filterStatus } = this.state;
        const weatherData = weatherList.map((e, index) => ({ ...e, key: index })).filter(e => {
            if (filterStatus === 'all') return true;
            if (filterStatus === 'set') return e.subordinateStationCode;
            if (filterStatus === 'noSet') return !e.subordinateStationCode;
        });
        return (
            <div className={styles.weatherList}>
                {showWarningTip && <WarningTip
                    onCancel={this.cancelWarningTip}
                    onOK={this.confirmWarningTip}
                    value={warningTipText}
                    style={{ width: '210px', height: '100px' }}
                />}
                <div className={styles.weatherMain}>
                <div className={styles.listContiner}>
                    <div className={styles.selectCondition}>
                        {/* <FilterCondition
                            onChange={this.onChangeFilter}
                            option={[
                                {
                                    name: '电站名称',
                                    type: 'stationName',
                                    typeName: 'stationCodes',
                                    data: stations.filter(e => e.stationType === 1),
                                },
                            ]}
                        /> */}
                        <div className={styles.filterButton}>
                            <span className={styles.setStause}>设置状态</span>
                            <div className={styles.buttonGroup}>
                                <span className={`${filterStatus === 'all' && styles.buttonActive}`} onClick={() => { this.changefilter('all'); }}>全部</span>
                                <span className={`${filterStatus === 'set' && styles.buttonActive}`} onClick={() => { this.changefilter('set'); }}>已设置</span>
                                <span className={`${filterStatus === 'noSet' && styles.buttonActive}`} onClick={() => { this.changefilter('noSet'); }}>未设置</span>
                            </div>
                        </div>
                        <div className={styles.searchButton}>
                            <CneInputSearch 
                                placeholder="区域／电站名称"
                                onSearch={this.doSearch}    
                            />
                        </div>
                    </div>
                    <div className={styles.weatherListTable}>
                        <div className={styles.pagination}>
                            <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum}
                                onPaginationChange={this.onPaginationChange} />
                        </div>
                        <CneTable
                            className={styles.weatherTable}
                            loading={loading}
                            dataSource={weatherData}
                            columns={weatherOperation ? columns.concat(operateColumn) : columns}
                            pagination={false}
                            onChange={this.tableChange}
                            locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
                        />
                        </div>
                    </div>
                </div>
                <TransitionContainer
                    show={pageStatus !== 'list'}
                    timeout={500}
                    effect="side"
                >
                    <EditWeather {...this.props} editList={editList} />
                </TransitionContainer>
            </div>
        );
    }
}

export default WeatherList;

