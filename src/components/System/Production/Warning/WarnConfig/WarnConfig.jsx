import React, { Component } from 'react';
import { Input, Button, Select, message, Table, Icon } from 'antd';
import styles from './warnConfig.scss';
import PropTypes from 'prop-types';
import WarnConfigSearch from './WarnConfigSearch';
import CommonPagination from '../../../../Common/CommonPagination';
import { handleRight } from '@utils/utilFunc';
import CneTable from '@components/Common/Power/CneTable';
import CneButton from '@components/Common/Power/CneButton';

const Option = Select.Option;
class WarnConfig extends Component {
    static propTypes = {
        enterpriseId: PropTypes.string,
        loading: PropTypes.bool,
        listQueryParams: PropTypes.object,
        getWarnList: PropTypes.func,
        changeWarnStore: PropTypes.func,
        warnList: PropTypes.array,
        totalNum: PropTypes.number,
        warnDelete: PropTypes.func,
        getDetail: PropTypes.func,

    };

    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [], //选择的数据
        };

    }

    onSelectChange = (keys, record, c, d) => { // 选择进行操作 删除
        this.setState({ selectedRowKeys: keys });
    }

    onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变
        const { getWarnList, listQueryParams } = this.props;
        getWarnList({ ...listQueryParams, pageNum: currentPage, pageSize });
    }

    onShowDetail = (record) => { // 查看详情
        this.props.changeWarnStore({ showPage: 'detail' });
        this.props.getDetail(record.warningCheckId);
    }

    wranEdit = (record) => {
        this.props.changeWarnStore({ showPage: 'edit' });
        this.props.getDetail(record.warningCheckId);
    }


    tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
        const { getWarnList, listQueryParams } = this.props;
        const { sortField, sortOrder } = listQueryParams;
        const sortFieldArr = ['warningLevel', 'warningEnable'];
        const { field } = sorter;
        let newSortFild = sortField, newSortOrder = '2';
        if (!field || sortFieldArr.findIndex(e => e === field) === newSortFild - 1) {
            newSortOrder = sortOrder === '2' ? '1' : '2'; // 交换排序方式
        } else {
            newSortFild = sortFieldArr.findIndex(e => e === field) + 1;
        }

        getWarnList({
            ...listQueryParams,
            sortField: `${newSortFild}`,
            sortOrder: newSortOrder,
        });
    }

    selectChange = () => {
        const { selectedRowKeys } = this.state;
        this.props.warnDelete(selectedRowKeys);
        this.setState({ selectedRowKeys: [] });
    }

    addRule = () => { // 添加
        this.props.changeWarnStore({ showPage: 'add' });
    }

    render() {
        const warnListColumn = [{
            title: '测点描述',
            dataIndex: 'devicePointDesc',
            width: '14%',
            render: (text, record) => <div onClick={() => { this.onShowDetail(record); }} className={styles.describeText} title={text || '--'}>{text || '--'}</div>,
        }, {
            title: '测点编号',
            dataIndex: 'pointCode',
            width: '14%',
            render: (text) => <div title={text || '--'} className={styles.pointCodeText}>{text || '--'}</div>,
        }, {
            title: '预警描述',
            dataIndex: 'warningDescription',
            key: 'warningDescription',
            width: '22%',
            render: (text) => <div title={text || '--'} className={styles.warningDescriptionText}>{text || '--'}</div>,
        }, {
            title: '预警规则',
            dataIndex: 'warningCheckRule',
            width: '15%',
            render: (text) => <div title={text || '--'} className={styles.warningCheckRuleText}>{text || '--'}</div>,
        }, {
            title: '预警级别',
            dataIndex: 'warningLevel',
            sorter: true,
            textAlign: 'center',
            width: '9%',
        }, {
            title: '是否启用',
            dataIndex: 'warningEnable',
            sorter: true,
            textAlign: 'center',
            render: (text, record) => record.warningEnable ? '是' : '否',
            width: '9%',
        }];

        const editColumn = {
            title: '编辑',
            dataIndex: 'edit',
            width: '9%',
            textAlign: 'center',
            render: (text, record) => (
                <span className={styles.edit}>
                    <i className="iconfont icon-edit" onClick={() => { this.wranEdit(record); }} />
                </span>
            ),
        };

        const { loading, warnList, listQueryParams, totalNum } = this.props;
        const { pageSize, pageNum, sortField, sortOrder } = listQueryParams;
        const { selectedRowKeys } = this.state;
        const warnConfigOperation = handleRight('intelligentWarning_operate');
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className={styles.warnConfig}>
                <WarnConfigSearch {...this.props} />
                <div className={styles.warnListTop}>
                    {warnConfigOperation && <div className={styles.warnListLeft}>
                        <CneButton className={styles.rule} onClick={this.addRule}>
                            <div className={styles.icon}>
                                <span className={'iconfont icon-newbuilt'} />
                            </div> 预警规则
                        </CneButton>
                        <Select onChange={this.selectChange} placeholder="操作" value={'操作'} dropdownMatchSelectWidth={false} >
                            <Option value="deleate" disabled={!selectedRowKeys.length > 0}>删除</Option>
                        </Select>
                    </div> || null}
                    <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
                </div>
                <div className={styles.tableBox}>
                    <CneTable
                        loading={loading}
                        onChange={this.tableChange}
                        columns={warnConfigOperation ? [...warnListColumn, editColumn] : warnListColumn}
                        dataSource={warnList.map((e, i) => ({ key: e.warningCheckId, ...e, warningLevel: `${['一', '二', '三', '四', '五'][e.warningLevel - 1] || '--'}级` }))}
                        pagination={false}
                        sortField={['warningLevel', 'warningEnable'][sortField - 1]}
                        sortMethod={['ascend', 'descend'][sortOrder - 1]}
                        rowSelection={rowSelection}
                        className={styles.tableStyle}
                    />
                </div>
            </div>

        );
    }
}
export default WarnConfig;
