import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'antd';
import path from '../../../constants/path';
import styles from './intelligentExpert.scss';
import CommonPagination from '../../Common/CommonPagination';
import ImportIntelligent from './ImportIntelligent';
import WarningTip from '../../Common/WarningTip';
import moment from 'moment';

class IntelligentTable extends Component {
  static propTypes = {
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    tableLoading: PropTypes.bool,
    intelligentTableData: PropTypes.object,
    changeIntelligentExpertStore: PropTypes.func,
    getIntelligentTable: PropTypes.func,
    deleteIntelligent: PropTypes.func,
    getKnowledgebase: PropTypes.func,
    editIntelligent: PropTypes.func,
    listParams: PropTypes.object,
    selectedRowKeys: PropTypes.array,
    selectedRowData: PropTypes.array,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      showModal: false, // 是否显示导入模态框
      showDeleteWarning: false, // 是否显示删除提示框
      warningTipText: '', // 删除提示语
      handleColumnDel: false, // 删除操作来源, false =>选中行后点击删除。true => 选中表格列中的直接删除
      handleColumnDelInfo: {}, // 选中表格列中直接删除记录的信息
    };
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器
    const { changeIntelligentExpertStore, getIntelligentTable, listParams } = this.props;
    changeIntelligentExpertStore({
      pageSize,
      pageNum: currentPage,
    });
    getIntelligentTable({
      ...listParams,
      pageSize: pageSize,
      pageNum: currentPage,
      // orderField: 'like_count',
      // sortMethod: 'desc',
    });
  }

  onSelectChange = (keys, record) => { // 选中行
    this.props.changeIntelligentExpertStore({
      selectedRowData: record,
      selectedRowKeys: keys,
    });
  }

  tableChange = (pagination, filter, sorter) => { // 表格排序&&表格重新请求数据
    const { getIntelligentTable, listParams } = this.props;
    const { order } = sorter;
    const initSorterField = 'like_count';
    const sortMethod = order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '';
    const sortField = sorter.field ? this.sortField(sorter.field) : initSorterField;
    getIntelligentTable({
      ...listParams,
      orderField: sortField,
      sortMethod,
    });
  }

  sortField(sortField) {
    let result = '';
    switch (sortField) {
      case 'updateTime': result = 'update_time'; break;
      case 'likeCount': result = 'like_count'; break;
      default: result = ''; break;
    }
    return result;
  }

  showModal = () => { // 导入
    this.setState({
      showModal: true,
    });
  }

  cancelModal = () => {
    this.setState({ showModal: false });
  }

  deleteIntelligent = () => { // 批量删除
    this.setState({
      showDeleteWarning: true,
      warningTipText: '确定要删除解决方案么?',
    });
  }

  cancelWarningTip = () => { // 删除确认框
    this.setState({ showDeleteWarning: false });
  }

  confirmWarningTip = () => { // 删除选中的行
    const { selectedRowData, deleteIntelligent, listParams, getIntelligentTable } = this.props;
    const { handleColumnDel, handleColumnDelInfo } = this.state;
    if (handleColumnDel) {
      deleteIntelligent({
        knowledgeBaseIds: handleColumnDelInfo.knowledgeBaseId,
      });
    } else {
      deleteIntelligent({
        knowledgeBaseIds: selectedRowData.map((e, i) => {
          return e.knowledgeBaseId;
        }),
      });
    }
    this.setState({
      showDeleteWarning: false,
      handleColumnDel: false,
      handleColumnDelInfo: {},
    });

    getIntelligentTable(listParams); // 返回列表页面时重新请求列表数据
  }

  singleDeleteIntelligent = (record) => { // 单独删除
    this.setState({
      showDeleteWarning: true,
      warningTipText: '确定要删除解决方案么?',
      handleColumnDel: true,
      handleColumnDelInfo: record,
    });
  }

  addIntelligent = () => { // 添加
    this.props.changeIntelligentExpertStore({
      showPage: 'add',
    });
  }

  columnlook = (record, selectedIndex) => { // 查看详情
    const { changeIntelligentExpertStore, getKnowledgebase } = this.props;
    changeIntelligentExpertStore({
      showPage: 'show',
    });
    getKnowledgebase({
      knowledgeBaseId: record.knowledgeBaseId,
      selectedIndex,
    });
  }

  columnEdit = (record) => { // 编辑
    const { changeIntelligentExpertStore, getKnowledgebase } = this.props;
    changeIntelligentExpertStore({
      showPage: 'edit',
    });
    getKnowledgebase({
      knowledgeBaseId: record.knowledgeBaseId,
      deviceTypeCode: record.deviceTypeCode,
      faultTypeId: record.faultTypeId,
    });
  }

  render() {
    const { showModal, warningTipText, showDeleteWarning } = this.state;
    const { intelligentTableData, tableLoading, listParams, selectedRowKeys, theme } = this.props;
    const { pageNum, pageSize } = listParams;
    const { total, dataList = [] } = intelligentTableData;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const downloadTemplet = `${path.basePaths.originUri}${path.APISubPaths.operation.downloadIntelligentTemplet}`; // 下载导入模板
    const rightHandler = localStorage.getItem('rightHandler') || '';
    const editRight = rightHandler.split(',').includes('operation_experience_edit');

    const columns = [{
      title: '设备类型',
      dataIndex: 'deviceTypeName',
      className: 'deviceTypeName',
    }, {
      title: '缺陷类型',
      dataIndex: 'faultName',
      className: 'faultName',
      render: (text) => {
        return <div className={styles.faultName} title={text}>{text}</div>;
      },
    }, {
      title: '缺陷描述',
      dataIndex: 'faultDescription',
      className: 'faultDescription',
      render: (text) => {
        return <div className={styles.faultDescription} title={text}>{text}</div>;
      },
    }, {
      title: '检查项目',
      dataIndex: 'checkItems',
      className: 'checkItems',
      render: (text) => {
        return <div className={styles.checkItems} title={text}>{text}</div>;
      },
    }, {
      title: '处理方法',
      dataIndex: 'processingMethod',
      className: 'processingMethod',
      render: (text) => {
        return <div className={styles.processingMethod} title={text}>{text}</div>;
      },
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      className: 'updateTime',
      render: (text, record) => moment(text).format('YYYY-MM-DD'),
      sorter: true,
    }, {
      title: '点赞数',
      dataIndex: 'likeCount',
      className: 'likeCount',
      sorter: true,
    }, {
      title: '操作',
      dataIndex: 'handler',
      className: 'handler',
      render: (text, record, index) => (
        <span>
          <i className={`${styles.lookRole} iconfont icon-look`}
            onClick={() => this.columnlook(record, index)}
          />
          {editRight && <i className={`${styles.editRole} iconfont icon-edit`}
            onClick={() => this.columnEdit(record)}
          />}
          {editRight && <i className={`${styles.deleteRole} iconfont icon-del`}
            onClick={() => this.singleDeleteIntelligent(record, index)}
          />}
        </span>
      ),
    }];

    return (
      <div className={`${styles.intelligentTable} ${styles[theme]}`}>
        <div className={styles.topHandler}>
          <div className={styles.leftPart}>
            {/* {editRight && <Button className={styles.addHandler} icon="plus" onClick={this.addIntelligent}>添加</Button>} */}
            {editRight && <Button className={styles.addHandler} type="add" onClick={this.addIntelligent}><i>+</i>添加</Button>}
            {editRight && <Button className={styles.deleteHandler} type="reset" onClick={this.deleteIntelligent} disabled={selectedRowKeys.length === 0}>批量删除</Button>}
            {editRight && <Button className={styles.importHandler} type="primary" onClick={this.showModal}>导入</Button>}
            {editRight && <Button className={styles.exportHandler} type="primary" href={downloadTemplet} download={downloadTemplet} target="_blank">下载导入模板</Button>}
          </div>
          <CommonPagination
            currentPage={pageNum}
            pageSize={pageSize}
            total={total}
            onPaginationChange={this.onPaginationChange}
            theme={theme}
          />

          {showModal ? <ImportIntelligent {...this.props} showModal={showModal} cancelModal={this.cancelModal} /> : ''}
          {showDeleteWarning && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}

        </div>
        <Table
          loading={tableLoading}
          className={styles.intelligentList}
          dataSource={dataList.map((e, i) => ({ ...e, key: i }))}
          columns={columns}
          rowSelection={rowSelection}
          onChange={this.tableChange}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          rowKey={(record) => { return record.knowledgeBaseId; }}
        />
      </div>
    );
  }
}

export default IntelligentTable;
