import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './operate.scss';
import { Modal, Button } from 'antd';
import ImgListModal from '../../../Common/Uploader/ImgListModal';
import CommonPagination from '../../../Common/CommonPagination';
import WarningTip from '../../../Common/WarningTip';
import moment from 'moment';
import path from '../../../../constants/path';
import ReviewForm from '../Common/HandleForm/ReviewForm';
import Obsolete from '../Common/HandleForm/Obsolete';
import CneTable from '@components/Common/Power/CneTable';
import { handleRights, handleRight } from '@utils/utilFunc';
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
        stopRight: PropTypes.array,
        theme: PropTypes.string,

    }


    constructor() {
        super();
        this.state = {
            selectedRows: [],
            review: false, // 审核
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
        getStopRight({ templateType: 2 });

    }

    onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变  
        const { listQueryParams, commonQueryParams } = this.props;
        this.props.getFlowList({ listQueryParams: { ...listQueryParams, pageNum: currentPage, pageSize }, commonQueryParams });
    }

    onSelectChange = (keys, record) => { // 选择进行操作 判断权限
        this.setState({ selectedRows: record });
        const { stopRight } = this.props;
        const rightNodeCode = stopRight.map(e => e.nodeCode); // 作废权限的nodeCode
        if (keys.length > 0) { // 选中的超过一条
            const userId = Cookie.get('userId');
            const dealUserIds = [], dealRoleIds = [];
            let review = false, obsolete = true;
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
            const ableNodes = [...new Set(record.map(e => e.ableNodes))];
            if (stateCode.length > 1 || !right) {
                review = false;
            } else if (stateCode[0] === '101') { review = true; }
            if (ableNodes.length > 1 || ableNodes[0] !== rightNodeCode[0]) { // 作废的权限
                obsolete = false;
            }
            this.setState({ review, obsolete });
        } else {
            this.setState({ review: false, obsolete: false });
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

    resetStatus = () => { // 初始化状态
        this.setState({
            showWarningTip: false, batchVisible: false, selectedRows: [], operatType: '',
            review: false, obsolete: false,
        });
    }

    sortFieldMap = { // 表格排序字段 => api
        docketCode: 'docket_code',
        stationName: 'station_name',
        docketName: 'docket_name',
        createTime: 'create_time',
        endTime: 'end_time',
        stateDesc: 'state_sort',
    };

    tableSortMap = { // api存储字段 => 表格排序字段
        docket_code: 'docketCode',
        station_name: 'stationName',
        docket_name: 'docketName',
        create_time: 'createTime',
        end_time: 'endTime',
        state_sort: 'stateDesc',
    };

    sortMethodMap = {
        desc: 'descend',
        asc: 'ascend',
    }

    tableChange = (pagination, filter, sorter) => { // 点击表头 排序
        const { field } = sorter || {};
        const { listQueryParams, commonQueryParams } = this.props;
        const { sortField, sortMethod } = listQueryParams || {};
        let newField = sortField, newSort = 'desc';
        if (!field || (sortField === this.sortFieldMap[field])) { // 点击的是正在排序的列
          newSort = sortMethod === 'desc' ? 'asc' : 'desc'; // 交换排序方式
        } else { // 切换列
          newField = this.sortFieldMap[field];
        }
        this.props.changeFlowStore({ listQueryParams: { ...listQueryParams, sortField: newField, sortMethod: newSort } });
        this.props.getFlowList({ listQueryParams: { ...listQueryParams, sortField: newField, sortMethod: newSort }, commonQueryParams });
    };

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
                title: '操作票编号',
                dataIndex: 'docketCode',
                key: 'docketCode',
                sorter: true,
                textAlign: 'left',
                className: styles.docketCode,
                render: (text) => {
                    return <div className={styles.docketCodeText} title={text}>{text}</div>;
                },
            },
            {
                title: '电站名称',
                dataIndex: 'stationName',
                key: 'stationName',
                sorter: true,
                textAlign: 'left',
                className: styles.stationName,
                render: (text, record) => {
                    return <div className={styles.stationNameText} title={text}>{text}</div>;
                },
            }, {
                title: '操作票名称',
                dataIndex: 'docketName',
                key: 'docketName',
                sorter: true,
                textAlign: 'left',
                className: styles.docketName,
                render: (text, record) => {
                    return <div className={styles.docketNameText} title={text}>{text}</div>;
                },
            }, {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                sorter: true,
                textAlign: 'center',
                className: styles.createTime,
                render: text => <div className={styles.createTimeText} >{text && moment(text).format('YYYY-MM-DD HH:mm:ss') || '--'}</div>,
            }, {
                title: '完成时间',
                dataIndex: 'endTime',
                key: 'endTime',
                sorter: true,
                textAlign: 'center',
                className: styles.endTime,
                render: text => <div className={styles.createTimeText} >{text && moment(text).format('YYYY-MM-DD HH:mm:ss') || '--'}</div>,
            }, {
                title: '状态',
                dataIndex: 'stateDesc',
                key: 'stateDesc',
                sorter: true,
                textAlign: 'center',
                className: styles.stateDesc,
            }, {
                title: '操作人',
                dataIndex: 'dealUserNames',
                key: 'dealUserNames',
                textAlign: 'left',
                className: styles.dealUserNames,
                render: (text) => {
                    return <div className={styles.dealUserNamesText} title={text}>{text}</div>;
                },
            }, {
                title: '照片',
                dataIndex: 'picture',
                key: 'picture',
                textAlign: 'center',
                className: styles.picture,
                render: (text, record) => (
                    <i className="iconfont icon-todo" onClick={() => { this.showImgs(record); }} />
                ),
            },
            {
                title: '操作',
                dataIndex: 'opreate',
                key: 'opreate',
                textAlign: 'center',
                className: styles.opreate,
                render: (text, record) => (
                    <div>
                        <i className={`iconfont icon-look ${styles.lookIcon}`} onClick={() => { this.onShowDetail(record); }} />
                        <i className={`iconfont icon-del ${(handleRight('operationTicket_operate') && record.stateCode === '2') ? styles.iconShow : styles.iconHide}`} onClick={() => { this.delList('del', record.docketId); }} />
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
        const { totalNum, loading, docketList, stopRight, newImg, listQueryParams, downLoadFile, theme } = this.props;
        const { selectedRows, review, obsolete, currentImgIndex, showImgModal, downloadHref } = this.state;
        const { showWarningTip, warningTipText, operatType } = this.state;
        const { pageSize, pageNum, sortField, sortMethod } = listQueryParams;
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
            'obsolete': '作废',
        };
        const [addRight, handleRight] = handleRights(['operationTicket_add', 'operationTicket_operate']);
        return (
            <div className={`${styles.flowTable} ${styles[theme]}`}>
                {showWarningTip && <WarningTip
                    onCancel={() => { this.setState({ showWarningTip: false }); }}
                    onOK={this.onConfirmWarningTip}
                    value={warningTipText} />}
                <div className={styles.tableTop}>
                    <div className={styles.selectCondition}>
                        {addRight && <Button type="add" onClick={this.addWorkFlow}><i>+</i>操作票 </Button>}
                        {handleRight && <div className={`${styles.commonButton} ${!review && styles.disabled}`}
                            onClick={() => { this.handleBatch('review'); }}>审核</div>}
                        {handleRight && stopRight.map((e) => {
                            if (e.nodeName) {
                                return (
                                    <div className={`${styles.commonButton} ${!obsolete && styles.disabled}`}
                                        onClick={() => { this.handleBatch('obsolete', e.nodeCode); }} key={e.nodeCode} >
                                        {e.nodeName}
                                    </div>
                                );
                            }
                        })}
                    </div>
                    <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum}
                        onPaginationChange={this.onPaginationChange} theme={theme} />
                </div>
                <CneTable
                    loading={loading}
                    className={styles.operateFlowTable}
                    dataSource={dataSource}
                    columns={this.initColumns()}
                    sortField={this.tableSortMap[sortField]}
                    sortMethod={this.sortMethodMap[sortMethod] || false}
                    rowSelection={rowSelection}
                    onChange={this.tableChange}
                    locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
                    dataError={false}
                />
                <span ref="modal" />
                <ImgListModal
                    data={images}
                    imageListShow={showImgModal}
                    hideImg={() => { this.setState({ showImgModal: false, currentImgIndex: 0 }); }}
                    currentImgIndex={currentImgIndex}
                    downloadHref={downloadHref}
                    downLoadFile={downLoadFile}
                    theme={theme}
                    changeCurrentImgIndex={this.changeCurrentImgIndex} />
                <span ref="modal" />
                <Modal
                    title={titleText[this.state.operatType]}
                    visible={this.state.batchVisible}
                    onCancel={() => { this.setState({ batchVisible: false }); }}
                    width={686}
                    footer={false}
                    maskClosable={false}
                    style={{ top: 120 }}
                    maskStyle={{ backgroundColor: 'rgba(153,153,153,0.2)' }}
                    getContainer={() => this.refs.modal}
                >
                    {operatType === 'review' && <ReviewForm onChange={this.batchChange} />}
                    {operatType === 'obsolete' && <Obsolete onChange={this.batchChange} />}
                </Modal>
            </div>
        );
    }
}


export default TableList;
