import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './workFlow.scss';
import { connect } from 'react-redux';
import { Table, Select, Icon, Modal } from 'antd';
import ImgListModal from '../../../Common/Uploader/ImgListModal';
import CommonPagination from '../../../Common/CommonPagination';
import WarningTip from '../../../Common/WarningTip';
import moment from 'moment';
import path from '../../../../constants/path';
import ReviewForm from '../Common/HandleForm/ReviewForm';
import CheckForm from '../Common//HandleForm/CheckForm';
import Obsolete from '../Common/HandleForm/Obsolete';
import Cookie from 'js-cookie';


class TableList extends Component {
    static propTypes = {
        getFlowList: PropTypes.func,
        listQueryParams: PropTypes.object,
        commonQueryParams: PropTypes.object,
        changeFlowStore: PropTypes.func,
        getStopRight: PropTypes.func,
        getNewImg: PropTypes.func,
        handleBatch: PropTypes.func,
        stopBatch: PropTypes.func,
        delDocket: PropTypes.func,
        downLoadFile: PropTypes.func,
        stopRight: PropTypes.array,
        loading: PropTypes.bool,
        docketList: PropTypes.array,
        newImg: PropTypes.array,
        totalNum: PropTypes.number,
    }


    constructor() {
        super();
        this.state = {
            selectedRows: [],
            review: false, // 审核
            complete: false, // 消票
            obsolete: false, //作废
            showImgModal: false,
            currentImgIndex: 0,
            downloadHref: '',
            showWarningTip: false,
            warningTipText: '确定要删除么',
            batchVisible: false, //批量操作的按钮 
            operatType: '', // 操作的类型
            operateReasult: {}, // 操作的建议
            nodeCode: '', // 作废的节点
            delDocketId: '', // 删除操作
        };
    }

    componentDidMount() {
        const { getFlowList, listQueryParams, commonQueryParams, getStopRight } = this.props;
        getFlowList({ listQueryParams, commonQueryParams });
        getStopRight({ templateType: 1 });

    }

    onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变  
        const { listQueryParams, commonQueryParams } = this.props;
        this.props.getFlowList({ listQueryParams: { ...listQueryParams, pageNum: currentPage, pageSize }, commonQueryParams });
    }

    onSelectChange = (keys, record) => { // 选择进行操作 判断权限
        this.setState({ selectedRows: record });
        const { stopRight } = this.props;
        const rightNodeCode = stopRight.map(e => e.nodeCode); // 作废权限的nodeCode
        if (keys.length > 0) {
            const userId = Cookie.get('userId');
            const dealUserIds = [], dealRoleIds = [];
            let review = false, complete = false, obsolete = true;
            record.forEach(e => {
                if (e.dealUserIds) {
                    dealUserIds.push(e.dealUserIds.split(','));
                } else {
                    obsolete = false;
                }
            });
            record.forEach(e => {
                if (e.dealRoleIds) {
                    dealRoleIds.push(e.dealRoleIds.split(','));
                }
            });
            const right = dealUserIds.every(e => e.includes(userId));
            const stateCode = [...new Set(record.map(e => e.stateCode))];
            const nodeCode = [...new Set(record.map(e => e.nodeCode))];
            if (stateCode.length > 1 || !right) {
                review = false; complete = false;
            } else {
                if (stateCode[0] === '101') { review = true; complete = false; }
                if (stateCode[0] === '103') { review = false; complete = true; }
            }
            if (nodeCode.length > 1 || nodeCode[0] !== rightNodeCode[0]) { // 作废的权限
                obsolete = false;
            }
            this.setState({ review, complete, obsolete });
        } else {
            this.setState({ review: false, complete: false, obsolete: false });
        }

    }

    onShowDetail = (value) => {
        this.props.changeFlowStore({ showPage: 'detail', docketId: value.docketId });
    }

    onConfirmWarningTip = () => { // 删除  作废  消票  审核
        const { operatType, operateReasult, selectedRows, nodeCode, delDocketId } = this.state;
        const taskIds = selectedRows.map(e => e.taskId);
        const docketIds = selectedRows.map(e => e.docketId);
        if (operatType === 'review' || operatType === 'complete') { // 审核 消票 
            this.props.handleBatch({ taskIds, ...operateReasult, func: this.resetStatus });
        }
        if (operatType === 'obsolete') { // 作废
            this.props.stopBatch({ docketIds, nodeCode, ...operateReasult, func: this.resetStatus });
        }
        if (operatType === 'del') { // 删除
            this.props.delDocket({
                docketId: delDocketId, func: () => {
                    this.setState({ showWarningTip: false });
                },
            });
        }

    }

    resetStatus = () => {
        this.setState({
            showWarningTip: false, batchVisible: false, selectedRows: [],
            review: false, complete: false, obsolete: false,
        });
    }

    tableChange = (pagination, filter, sorter) => {// 点击表头 排序
        const initSorterField = 'create_time';
        let ascend = '';
        const sortField = sorter.field ? this.sortField(sorter.field) : initSorterField;
        ascend = sorter.order === 'ascend' ? 'asc' : 'desc';
        const { listQueryParams, commonQueryParams } = this.props;
        this.props.getFlowList({ listQueryParams: { ...listQueryParams, sortField, sortMethod: ascend }, commonQueryParams });
    };

    sortField(sortField) { // 排序
        let result = '';
        switch (sortField) {
            case 'docketCode': result = 'docket_code'; break;
            case 'docketTypeName': result = 'docket_type'; break;
            case 'stationName': result = 'station_name'; break;
            case 'docketName': result = 'docket_name'; break;
            case 'createTime': result = 'create_time'; break;
            case 'endTime': result = 'end_time'; break;
            case 'stateCode': result = 'state_code'; break;
            case 'dealUsers': result = 'deal_users'; break;
            default: result = ''; break;
        }
        return result;
    }

    addWorkFlow = () => {
        this.props.changeFlowStore({ showPage: 'add' });
    }

    showImgs = (record) => { // 查看图片详情
        const { docketId } = record;
        const downloadHref = `${path.basePaths.APIBasePath}${path.APISubPaths.operation.downNewImgs}/${docketId}`;
        this.props.getNewImg({ docketId });
        this.setState({ showImgModal: true, downloadHref });
    }

    changeCurrentImgIndex = (index) => { //  改变图片的大小
        this.setState({ currentImgIndex: index });
    }

    initColumns = () => {
        return [
            {
                title: '工作票编号',
                dataIndex: 'docketCode',
                key: 'docketCode',
                sorter: true,
                render: (text) => {
                    return <div className={styles.docketCode} title={text}>{text}</div>;
                },
            },
            {
                title: '工作票类型',
                dataIndex: 'docketTypeName',
                key: 'docketTypeName',
                sorter: true,
                render: (text, record) => {
                    return <div className={styles.docketName} title={text}>{text}</div>;
                },
            }, {
                title: '电站名称',
                dataIndex: 'stationName',
                key: 'stationName',
                sorter: true,
                render: (text, record) => {
                    return <div className={styles.stationName} title={text}>{text}</div>;
                },
            }, {
                title: '工作票名称',
                dataIndex: 'docketName',
                key: 'docketName',
                sorter: true,
                render: (text, record) => {
                    return <div className={styles.docketName} title={text}>{text}</div>;
                },
            }, {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                sorter: true,
                render: text => <div className={styles.createTime} >{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>,
            }, {
                title: '完成时间',
                dataIndex: 'endTime',
                key: 'endTime',
                sorter: true,
                render: text => <div className={styles.createTime} >{text && moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>,
            }, {
                title: '状态',
                dataIndex: 'stateDesc',
                key: 'stateDesc',
                sorter: true,
            }, {
                title: '操作人',
                dataIndex: 'dealUserNames',
                key: 'dealUserNames',
                render: (text) => {
                    return <div className={styles.dealUserNames} title={text}>{text}</div>;
                },
            }, {
                title: '照片',
                dataIndex: 'picture',
                key: 'picture',
                render: (text, record) => (
                    <i className="iconfont icon-todo" onClick={() => { this.showImgs(record); }} />
                ),
            },
            {
                title: '操作',
                dataIndex: 'opreate',
                key: 'opreate',
                render: (text, record) => (
                    <div>
                        <i className="iconfont icon-look" onClick={() => { this.onShowDetail(record); }} />
                        {record.stateCode === '2' && <i className="iconfont icon-del" onClick={() => { this.delList('del', record.docketId); }} />}
                    </div>
                ),
            },
        ];
    }

    handleBatch = (type, nodeCode) => { // 批量审核/执行/消票 票据
        this.setState({ batchVisible: true, operatType: type, nodeCode });
    }

    delList = (type, docketId) => { // 提示框
        const text = {
            'del': '确定删除么',
            'send': '确定通过么',
            'reject': '确定驳回么',
            'obsolete': '确定作废么',
            'complete': '确定消票么',
        };
        this.setState({ showWarningTip: true, warningTipText: text[type] });
        if (docketId) { // 删除是比较特殊的
            this.setState({ delDocketId: docketId, operatType: 'del' });
        }
    }

    batchChange = (value) => { //  批量操作·(确定)
        const { operatType } = this.state;
        const { handleResult } = value;
        let type = operatType;
        if (operatType === 'review') {
            type = handleResult === 1 ? 'send' : 'reject';
        }
        this.delList(type);
        this.setState({ operateReasult: value });
    }


    render() {
        const { totalNum, loading, docketList, stopRight, newImg, listQueryParams, downLoadFile } = this.props;
        const { selectedRows, review, complete, obsolete, currentImgIndex, showImgModal, downloadHref } = this.state;
        const { showWarningTip, warningTipText, operatType } = this.state;
        const { pageSize, pageNum } = listQueryParams;
        const rowSelection = {
            selectedRowKeys: selectedRows.map(e => e.docketId),
            onChange: this.onSelectChange,
        };
        const dataSource = docketList.map((item, index) => ({ ...item, key: item.docketId }));
        const images = newImg.map((item, index) => {
            return {
                uid: `${item.imgUrl}_${index}`,
                rotate: item.rotate,
                thumbUrl: `${item.imgUrl}`,
            };
        });
        const titleText = {
            'review': '审核',
            'complete': '消票',
            'obsolete': '作废',
        };
        return (
            <div className={styles.flowTable}>
                {showWarningTip && <WarningTip
                    onCancel={() => { this.setState({ showWarningTip: false }); }}
                    onOK={this.onConfirmWarningTip}
                    value={warningTipText} />}
                <div className={styles.tableTop}>
                    <div className={styles.selectCondition}>
                        <div className={styles.addplus} onClick={this.addWorkFlow}>
                            <Icon className={styles.add} type="plus" />
                            <span className={styles.text}>工作票</span>
                        </div>
                        <div className={`${styles.commonButton} ${!review && styles.disabled}`}
                            onClick={() => { this.handleBatch('review'); }}>审核</div>
                        <div className={`${styles.commonButton} ${!complete && styles.disabled}`}
                            onClick={() => { this.handleBatch('complete'); }}>消票</div>
                        {stopRight.map((e) => {
                            return (
                                <div className={`${styles.commonButton} ${!obsolete && styles.disabled}`}
                                    onClick={() => { this.handleBatch('obsolete', e.nodeCode); }} key={e.nodeCode} >
                                    {e.nodeName}
                                </div>
                            );
                        })}
                    </div>
                    <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum}
                        onPaginationChange={this.onPaginationChange} />
                </div>
                <Table
                    loading={loading}
                    dataSource={dataSource}
                    columns={this.initColumns()}
                    pagination={false}
                    rowSelection={rowSelection}
                    onChange={this.tableChange}
                    locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
                />
                <ImgListModal
                    data={images}
                    imageListShow={showImgModal}
                    hideImg={() => { this.setState({ showImgModal: false, currentImgIndex: 0 }); }}
                    currentImgIndex={currentImgIndex}
                    downloadHref={downloadHref}
                    downLoadFile={downLoadFile}
                    changeCurrentImgIndex={this.changeCurrentImgIndex} />
                <Modal
                    title={titleText[this.state.operatType]}
                    visible={this.state.batchVisible}
                    onCancel={() => { this.setState({ batchVisible: false }); }}
                    width={686}
                    footer={false}
                    maskClosable={false}
                    style={{ top: 120 }}
                    maskStyle={{ backgroundColor: 'rgba(153,153,153,0.2)' }}
                >
                    {operatType === 'review' && <ReviewForm onChange={this.batchChange} />}
                    {operatType === 'complete' && <CheckForm onChange={this.batchChange} />}
                    {operatType === 'obsolete' && <Obsolete onChange={this.batchChange} />}
                </Modal>
            </div>
        );
    }
}


export default TableList;
