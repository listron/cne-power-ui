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
    intelligentTableData: PropTypes.array,
    getIntelligentExpertStore: PropTypes.func,
    getIntelligentTable: PropTypes.func,
    deleteIntelligent: PropTypes.func,
    listParams: PropTypes.object,
    selectedRowKeys: PropTypes.array,
    allStationBaseInfo: PropTypes.array,
    selectedRowData: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showDeleteWarning: false,
      warningTipText: '',
    }
  }

  componentDidMount(){
    const { getIntelligentTable, listParams } = this.props;  
    getIntelligentTable({
      listParams
    })
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器
    const { getIntelligentExpertStore, getIntelligentTable, listParams } = this.props;  
    getIntelligentExpertStore({
      pageSize,
      pageNum: currentPage,
    });
    getIntelligentTable({
      listParams:{
        ...listParams,
        pageSize,
        pageNum: currentPage,
      }
    })
  }

  onSelectChange = (keys, record) => { // 选中行
    this.props.getIntelligentExpertStore({
      selectedRowData: record,
      selectedRowKeys: keys,
    })
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
    })
  }

  sortField(sortField) {
    let result = "";
    switch (sortField) {
      case 'updateTime': result = 'update_time'; break;
      case 'likeCount': result = 'like_count'; break;
      default: result = ""; break;
    }
    return result
  }

  showModal = () => { // 导入
    this.setState({
      showModal: true
    })
  }

  cancelModal = () => {
    this.setState({ showModal: false })
  }

  deleteIntelligent = () => { // 批量删除
    this.setState({ showDeleteWarning: true,  warningTipText: '确定要删除解决方案么?' })
  }

  cancelWarningTip = () => { // 删除确认框
    this.setState({ showDeleteWarning: false })
  }

  confirmWarningTip = () => { // 删除选中的行
    const { selectedRowData, deleteIntelligent } = this.props;
    const knowledgeBaseId = selectedRowData.map((e, i) => {
      return e.knowledgeBaseId
    })
    deleteIntelligent({ knowledgeBaseIds: knowledgeBaseId })
    this.setState({ showDeleteWarning: false })
  }

  addIntelligent = () =>{ // 添加
    this.props.getIntelligentExpertStore({
      showPage: 'add'
    })
  }

  render() {
    const { showModal, warningTipText, showDeleteWarning } = this.state;
    const { intelligentTableData, tableLoading, listParams, selectedRowKeys, allStationBaseInfo } = this.props;
    const { pageNum, pageSize, } = listParams;
    const { total, dataList = [] } = intelligentTableData;
    const rowSelection = { 
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const downloadTemplet = `${path.basePaths.originUri}${path.APISubPaths.operation.downloadIntelligentTemplet}`; // 下载导入模板

    const columns = [{
      title: '设备类型',
      dataIndex: 'deviceTypeName',
      className: 'deviceTypeName',
    }, {
      title: '缺陷类型',
      dataIndex: 'faultName',
      className: 'faultName',
      render: (text) => {
        return <div className={styles.faultName} title={text}>{text}</div>
      }
    }, {
      title: '缺陷描述',
      dataIndex: 'faultDescription',
      className: 'faultDescription',
      render: (text) => {
        return <div className={styles.faultDescription} title={text}>{text}</div>
      }
    }, {
      title: '检查项目',
      dataIndex: 'checkItems',
      className: 'checkItems',
      render: (text) => {
        return <div className={styles.checkItems} title={text}>{text}</div>
      }
    }, {
      title: '处理方法',
      dataIndex: 'processingMethod',
      className: 'processingMethod',
      render: (text) => {
        return <div className={styles.processingMethod} title={text}>{text}</div>
      }
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      className: 'updateTime',
      render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm'),
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
      render: (text, record) => (
      <span>
        <i className={`${styles.lookRole} iconfont icon-look`}
        // onClick={()=>this.Columnlook(record)} 
        />
        <i className={`${styles.editRole} iconfont icon-edit`} 
        // onClick={() => this.ColumnEdit(record)} 
        />
        <i className={`${styles.deleteRole} iconfont icon-del`} 
        onClick={() => this.deleteIntelligent(record)} 
        />
      </span>
    )
    }];

    return (
      <div className={styles.intelligentTable}>
       <div className={styles.topHandler}>
          <div className={styles.leftPart}>
           <Button className={styles.addHandler} icon="plus" onClick={this.addIntelligent}>添加</Button>
           <Button className={styles.deleteHandler} onClick={this.deleteIntelligent} disabled={selectedRowKeys.length === 0}>批量删除</Button>
           <Button className={styles.importHandler} onClick={this.showModal}>导入</Button>
           <Button className={styles.exportHandler} 
            href={downloadTemplet} 
            download={downloadTemplet} 
            target="_blank" 
           >下载导入模板</Button>
          </div>
          <CommonPagination 
            currentPage={pageNum} 
            pageSize={pageSize} 
            total={total} 
            onPaginationChange={this.onPaginationChange} 
          />

          {showModal ? <ImportIntelligent {...this.props} showModal={showModal} cancelModal={this.cancelModal}  allStationBaseInfo={allStationBaseInfo} /> : ''}
          {showDeleteWarning && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}

       </div>
       <Table 
          loading={tableLoading}
          className={styles.intelligentList}
          dataSource={ dataList.map((e, i) => ({...e, key: i})) } 
          columns={columns} 
          rowSelection={rowSelection}
          onChange={this.tableChange}
          pagination={false}
          locale={{emptyText:<img width="223" height="164" src="/img/nodata.png" />}}
        />
      </div>
      )
    }
  }

export default IntelligentTable;