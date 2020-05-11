import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './powerLost.scss';
import CneTable from '@components/Common/Power/CneTable';
import CommonPagination from '../../../Common/CommonPagination';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma, dataFormats } from '../../../../utils/utilFunc';
class TableList extends Component {
        static propTypes = {
                loading: PropTypes.bool,
                changePowerLostStore: PropTypes.func,
                onChangeFilter: PropTypes.func,
                pageNum: PropTypes.number,
                pageSize: PropTypes.number,
                total: PropTypes.number,
                filterTable: PropTypes.number,
                powerLostList: PropTypes.array,
                sortField: PropTypes.string,
                sortMethod: PropTypes.string,
                pageNum: PropTypes.number,
                pageSize: PropTypes.number,
        }

        onPaginationChange = ({ pageSize, currentPage }) => { // 分页器操作
                this.props.changePowerLostStore({ pageNum: currentPage, pageSize });
                this.props.onChangeFilter({ pageNum: currentPage, pageSize });
        }

        ontableSort = (pagination, filter, sorter) => {
                const { sortField, sortMethod } = this.props;
                const { field } = sorter;
                const sortInfo = {
                        regionName: '0',
                        stationName: '1',
                        deviceName: '2',
                        deviceModeName: '3',
                        time: '4',
                        windSpeedAvg: '5',
                        genValid: '6',
                        genTime: '7',
                        equivalentHours: '8',
                        limitGen: '9',
                        limitTime: '10',
                        faultGen: '11',
                        faultTime: '12',
                };
                let newField = sortField, newSort = 'desc';
                if (!field || sortInfo[field]) { // 同列点击
                        newSort = sortMethod === 'desc' ? 'asc' : 'desc';
                } else { // 换列排序
                        newField = sortInfo[field];
                }
                this.props.changePowerLostStore({ sortField: newField, sortMethod: newSort });
                this.props.onChangeFilter({ sortField: newField, sortMethod: newSort });
        }

        initMonthColumn = () => {
                const { filterTable } = this.props;
                const filterShow = [
                        {
                                title: '区域',
                                dataIndex: 'regionName',
                                sorter: true,
                                width: 100,
                                textAlign: 'left',
                                render: (text) => <div className={styles.regionNameText} title={text || '--'}>{text || '--'}</div>,
                        }, {
                                title: '电站名称',
                                dataIndex: 'stationName',
                                sorter: true,
                                width: 120,
                                textAlign: 'left',
                                render: (text) => <div className={styles.stationNameText} title={text || '--'}>{text || '--'}</div>,
                        }, {
                                title: '设备名称',
                                dataIndex: 'deviceName',
                                sorter: true,
                                width: 120,
                                textAlign: 'left',
                                render: (text) => <div className={styles.deviceNameText} title={text || '--'}>{text || '--'}</div>,
                        }, {
                                title: '风机型号',
                                dataIndex: 'deviceModeName',
                                sorter: true,
                                width: 250,
                                textAlign: 'left',
                                render: (text) => <div className={styles.deviceModeNameText} title={text || '--'}>{text || '--'}</div>,
                        },
                ];
                const show = filterShow.slice(0, filterTable);
                const columns = [
                        {
                                title: '统计时段',
                                dataIndex: 'date',
                                width: 120,
                                textAlign: 'center',
                                render(text) { return text.replace(',', '-'); },
                        }, {
                                title: () => <TableColumnTitle title="限电时长" unit="h" />,
                                dataIndex: 'limitHour',
                                width: 100,
                                textAlign: 'right',
                                render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
                        }, {
                                title: () => <TableColumnTitle title="限电损失电量" unit="万kWh" />,
                                dataIndex: 'limitpower',
                                width: 125,
                                textAlign: 'right',
                                render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
                        }, {
                                title: () => <TableColumnTitle title="维护时长" unit="h" />,
                                dataIndex: 'weihuHour',
                                width: 100,
                                textAlign: 'right',
                                render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
                        }, {
                                title: () => <TableColumnTitle title="风电维护损失电量" unit="万kWh" />,
                                dataIndex: 'weihupower',
                                width: 160,
                                textAlign: 'right',
                                render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
                        }, {
                                title: () => <TableColumnTitle title="技术待命时长" unit="h" />,
                                dataIndex: 'resourceValue',
                                width: 125,
                                textAlign: 'right',
                                render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
                        }, {
                                title: () => <TableColumnTitle title="技术待命损失电量" unit="万kWh" />,
                                dataIndex: 'resourceRate',
                                width: 160,
                                textAlign: 'right',
                                render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
                        }, {
                                title: () => <TableColumnTitle title="远程停机时长" unit="h" />,
                                dataIndex: 'equivalentHours',
                                width: 125,
                                textAlign: 'right',
                                render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
                        }, {
                                title: () => <TableColumnTitle title="远程停机损失电量" unit="万kWh" />,
                                dataIndex: 'pr',
                                width: 160,
                                textAlign: 'right',
                                render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
                        }, {
                                title: () => <TableColumnTitle title="电网故障时长" unit="h" />,
                                dataIndex: 'lostPower',
                                width: 125,
                                textAlign: 'right',
                                render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
                        }, {
                                title: () => <TableColumnTitle title="电网故障损失电量" unit="万kWh" />,
                                dataIndex: 'limitPowerHours',
                                width: 160,
                                textAlign: 'right',
                                render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
                        }, {
                                title: () => <TableColumnTitle title="故障停机时长" unit="h" />,
                                dataIndex: 'guzhangHours',
                                width: 125,
                                textAlign: 'right',
                                render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
                        }, {
                                title: () => <TableColumnTitle title="故障停机损失电量" unit="万kWh" />,
                                dataIndex: 'guazhangpower',
                                width: 160,
                                textAlign: 'right',
                                render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
                        }, {
                                title: () => <TableColumnTitle title="就地停机时长" unit="h" />,
                                dataIndex: 'jiudihour',
                                width: 125,
                                textAlign: 'right',
                                render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
                        }, {
                                title: () => <TableColumnTitle title="就地停机损失电量" unit="万kWh" />,
                                dataIndex: 'jiudipower',
                                width: 160,
                                textAlign: 'right',
                                render(text) { return numWithComma(dataFormats(text, '--', 2, true)); },
                        },
                ];
                columns.unshift(...show);
                return columns;
        }


        render() {
                const { total, pageSize, pageNum, powerLostList, loading, sortField, sortMethod } = this.props;
                const columns = this.initMonthColumn();
                const dataSource = powerLostList.map((e, i) => ({ ...e, key: i }));
                const sortInfoMap = ['regionName', 'stationName', 'deviceName', 'deviceModeName', 'time', 'windSpeedAvg', 'genValid', 'genTime', 'equivalentHours', 'limitGen', 'limitTime', 'faultGen', 'faultTime'];
                return (
                        <React.Fragment>
                                <div className={styles.tableHeader}>
                                        <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} />
                                </div>
                                <div className={styles.list}>
                                        <CneTable
                                                loading={loading}
                                                columns={columns}
                                                sortField={sortInfoMap[sortField]}
                                                sortMethod={sortMethod === 'desc' ? 'descend' : 'ascend'}
                                                dataSource={dataSource}
                                                onChange={this.ontableSort}
                                                scroll={{ x: 'max-content' }}
                                                className={styles.tableStyles}
                                                locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
                                                pagination={false} />
                                </div>
                        </React.Fragment>
                );
        }
}

export default TableList;
