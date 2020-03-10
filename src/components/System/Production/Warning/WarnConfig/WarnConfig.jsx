import React, { Component } from "react";
import { Input, Button, Select, message, Table, Icon } from 'antd';
import styles from "./warnConfig.scss";
import PropTypes from 'prop-types';
import WarnConfigSearch from './WarnConfigSearch';
import CommonPagination from '../../../../Common/CommonPagination';
import { handleRight } from '@utils/utilFunc';
import CneTable from '@components/Common/Power/CneTable';

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
            selectedRowKeys: [],//选择的数据
        }

    }

    componentDidMount() {
        // const { getWarnList, listQueryParams } = this.props;
        // getWarnList(listQueryParams)
    }


    onSelectChange = (keys, record, c, d) => {  // 选择进行操作 删除
        this.setState({ selectedRowKeys: keys });
    }

    onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变
        const { getWarnList, listQueryParams } = this.props;
        getWarnList({ ...listQueryParams, pageNum: currentPage, pageSize, });
    }

    onShowDetail = (record) => { // 查看详情
        this.props.changeWarnStore({ showPage: 'detail' })
        this.props.getDetail(record.warningCheckId)
    }

    wranEdit = (record) => {
        this.props.changeWarnStore({ showPage: 'edit' })
        this.props.getDetail(record.warningCheckId)
    }

    tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
        const { getWarnList, listQueryParams } = this.props;
        const { field, order } = sorter;
        getWarnList({
            ...listQueryParams,
            sortField: field ? field === 'warningLevel' ? '1' : '2' : '',
            sortOrder: order ? (sorter.order === 'ascend' ? '1' : '2') : '',
        })
    }

    selectChange = () => {
        const { selectedRowKeys } = this.state;
        this.props.warnDelete(selectedRowKeys);
        this.setState({ selectedRowKeys: [] });
    }

    addRule = () => { // 添加
        this.props.changeWarnStore({ showPage: 'add' })
    }

    changeLevel = (e) => {
        let result = '';
        switch (e) {
            case 1: result = '一'; break;
            case 2: result = '二'; break;
            case 3: result = '三'; break;
            case 4: result = '四'; break;
            case 5: result = '五'; break;
            default: result = '--'; break;
        }
        return result
    }


    render() {
        const warnListColumn = [{
            title: '测点描述',
            dataIndex: 'devicePointDesc',
            key: 'devicePointDesc',
            // width:150,
            width:'11%',
            ellipsis: true,
            render: (text, record) => (
                <span onClick={() => { this.onShowDetail(record) }} className={styles.describe}>{text || '--'}</span>
            )
        }, {
            title: '测点编号',
            dataIndex: 'pointCode',
            key: 'pointCode',
            // width:150,
            width:'11%',
            className:styles.pointCode,
        }, {
            title: '预警描述',
            dataIndex: 'warningDescription',
            key: 'warningDescription',
            // width:'350px'
            // width:350,
            width:'27%',
            ellipsis: true,
            render: (text, record) => (
                <span className={styles.warningDescription}>{text || '--'}</span>
            )
        }, {
            title: '预警规则',
            dataIndex: 'warningCheckRule',
            key: 'warningCheckRule',
            // width:150,
            width:'11%',
            ellipsis: true,
            render: (text, record) => (
                <span className={styles.warningCheckRule}>{text || '--'}</span>
            )
        }, {
            title: '预警级别',
            dataIndex: 'warningLevel',
            key: 'warningLevel',
            sorter: true,
            defaultSortOrder: 'ascend',
            className:styles.warningLevel,
            // width:150,
            width:'11%',
        }, {
            title: '是否启用',
            dataIndex: 'warningEnable',
            key: 'warningEnable',
            sorter: true,
            className:styles.warningEnable,
            render: (text, record) => record.warningEnable ? '是' : '否',
            // width:150,
            width:'11%',
        }];

        const editColumn = {
            title: '编辑',
            dataIndex: 'edit',
            key: 'edit',
            className:styles.alarmEdit,
            render: (text, record) => (
                <span className={styles.edit}>
                    <i className="iconfont icon-edit" onClick={() => { this.wranEdit(record); }} />
                </span>
            ),
        };
        const { loading, warnList, listQueryParams, totalNum } = this.props;
        const { pageSize, pageNum } = listQueryParams;
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
                    {warnConfigOperation ? <div className={styles.warnListLeft}>
                        <Button className={styles.rule} onClick={this.addRule}>
                            <Icon type="plus" />
                            <span className={styles.text}>预警规则</span>
                        </Button>
                        <Select onChange={this.selectChange} placeholder="操作" value={'操作'} dropdownMatchSelectWidth={false} >
                            <Option value="deleate" disabled={!selectedRowKeys.length > 0}>删除</Option>
                        </Select>
                    </div> : <div></div>}
                    <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
                </div>
                <CneTable
                    loading={loading}
                    onChange={this.tableChange}
                    columns={warnConfigOperation ? warnListColumn.concat(editColumn) : warnListColumn}
                    dataSource={warnList.map((e, i) => ({ key: e.warningCheckId, ...e, warningLevel: `${['一', '二', '三', '四', '五'][e.warningLevel - 1] || '--'}级` }))}
                    pagination={false}
                    rowSelection={rowSelection}
                    className={styles.tableStyle}
                    locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
                />
            </div>

        )
    }
}
export default WarnConfig;