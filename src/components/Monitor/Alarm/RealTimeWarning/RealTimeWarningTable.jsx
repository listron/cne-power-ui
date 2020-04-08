import React, { Component } from 'react';
import styles from './realTimeWarning.scss';
import CommonPagination from '../../../Common/CommonPagination';
import TransferWarningModal from './TransferWarningModal';
import HandleRemoveModal from './HandleRemoveModal';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Table, Select, Popover, Icon, Button } from 'antd';
import moment from 'moment';
import { handleRights } from '@utils/utilFunc';
import CneTable from '../../../Common/Power/CneTable';
const Option = Select.Option;


// 默认排序是什么

class RealTimeWarningTable extends Component {
  static propTypes = {
    selectedTransfer: PropTypes.array,
    defectTypes: PropTypes.array,
    changeRealtimeWarningStore: PropTypes.func,
    transferWarning: PropTypes.func,
    HandleRemoveWarning: PropTypes.func,
    realtimeWarning: PropTypes.array,
    selectedRowKeys: PropTypes.array,
    getLostGenType: PropTypes.func,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showTransferTicketModal: false,
      showHandleRemoveModal: false,
      sortName: 'warningLevel',
      sortMethod: 'descend',
    };
  }
  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    this.props.changeRealtimeWarningStore({ currentPage, pageSize });
  }
  onHandle = (value) => {//转工单或手动解除的modal
    if (value === 'ticket') { // 暂时批量转工单去掉
      this.setState({
        showTransferTicketModal: true,
      });
    } else if (value === 'relieve') {
      this.setState({
        showHandleRemoveModal: true,
      });
    }
  }
  onSelectChange = (selectedRowKeys) => {//选择checkbox
    // console.log('selectedRowKeys',selectedRowKeys)
    this.props.changeRealtimeWarningStore({ selectedRowKeys });
  }

  onShowDetail = (record) => {
    this.setState({
      showTransferTicketModal: true,
    });
    this.props.changeRealtimeWarningStore({ selectedTransfer: [record] });
  }

  cancelRowSelect = () => {//取消选中
    this.props.changeRealtimeWarningStore({ selectedRowKeys: [] });
  }

  tableChange = (pagination, filters, sorter) => {
    const { sortName, sortMethod } = this.state;
    const { field } = sorter || {};
    let newField = sortName, newSort = 'descend';
    if (!field || (field === sortName)) { // 点击的是正在排序的列
      newSort = sortMethod === 'descend' ? 'ascend' : 'descend'; // 交换排序方式
    } else { // 切换列
      newField = field;
    }
    this.setState({
      sortName: newField,
      sortMethod: newSort,
    });
  }



  render() {
    const level = ['一级', '二级', '三级', '四级'];
    const columns = [
      {
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        className: styles.warningLevel,
        textAlign: 'center',
        render: (text, record, index) => level[text - 1],
        sorter: true,

      }, {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
        className: styles.stationName,
        render: (text) => (<div title={text || '--'} className={styles.stationNameText} title={text}>{text || '--'}</div>),
      }, {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        sorter: true,
        className: styles.deviceName,
        render: (text, record) => {
          const deviceTypeCodes = ['202', '304', '302', '201', '206', '101', '509'];
          const isClick = deviceTypeCodes.includes(`${record.deviceTypeCode}`);
          if (isClick) {
            let renderDom = (
              <Link to={`/hidden/monitorDevice/${record.stationCode}/${record.deviceTypeCode}/${record.deviceFullCode}`} target="_blank" className={styles.deviceNameText} >{text}</Link>
            );
            if (`${record.deviceTypeCode}` === '509') {
              // 获取支路的下标
              const deviceIndex = Number(record.deviceName.split('#')[1]) - 1;
              const paramsColor = {
                '801': 'f9b600', // 偏低
                '802': '3e97d1', // 偏高
                '803': 'a42b2c', // 异常
                '400': '199475', // 正常
                '500': 'f1f1f1', // 无通讯
                '900': 'f1f1f1', // 未接入
              };
              // 选中点击的支路
              const params = {
                pointIndex: deviceIndex,
                bgcColor: paramsColor[record.zlStatus || '400'],
              };
              // deviceTypeCode === 509 光伏组串 需要用父级的parentTypeCode
              renderDom = (
                <Link to={`/hidden/monitorDevice/${record.stationCode}/${record.parentTypeCode.split('M')[1]}/${record.parentTypeCode}?pointParams=${JSON.stringify(params)}`} target="_blank" className={styles.deviceNameText} >{text}</Link>
              );
            }
            return renderDom;
          }
          return text;
        },
      }, {
        title: '设备类型',
        dataIndex: 'deviceTypeName',
        key: 'deviceTypeName',
        sorter: true,
        className: styles.deviceTypeName,
        render: (text) => (<div title={text || '--'} className={styles.deviceTypeNameText} title={text}>{text || '--'}</div>),
      }, {
        title: '告警描述',
        dataIndex: 'warningCheckDesc',
        key: 'warningCheckDesc',
        className: styles.warningCheckDesc,
        render: (text, record) => {
          return <div className={styles.warningCheckDescText} title={text}>{text}</div>;
        },
      }, {
        title: '发生时间',
        dataIndex: 'timeOn',
        key: 'timeOn',
        render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm'),
        sorter: true,
        textAlign: 'center',
        className: styles.timeOn,
      }, {
        title: '持续时间',
        dataIndex: 'durationTime',
        key: 'durationTime',
        sorter: true,
        textAlign: 'right',
        className: styles.durationTime,
      },
    ];
    const realTimeWarningColumn = {
      title: '操作',
      className: styles.iconDetail,
      textAlign: 'center',
      render: (text, record) => (
        <div className={styles.iconDetailText}>
          <i className="iconfont icon-tranlist icon-action" onClick={() => { this.onShowDetail(record); }} />
        </div>
      ),
    };

    const { realtimeWarning, selectedRowKeys, pageSize, currentPage, loading, selectedTransfer, getLostGenType, defectTypes, transferWarning, theme } = this.props;
    const { sortName, sortMethod, showTransferTicketModal, showHandleRemoveModal } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const nameSortArr = ['stationName', 'deviceName', 'deviceTypeName', 'warningCheckDesc'];//同种排序
    const tableSource = realtimeWarning.map((e, i) => ({
      ...e,
      key: i,
    })).sort((a, b) => { // 手动排序
      const sortType = sortMethod === 'descend' ? -1 : 1;
      if (sortName === 'warningLevel') {
        return sortType * (a.warningLevel - b.warningLevel);
      } else if (nameSortArr.includes(sortName)) {
        return sortType * a[sortName].localeCompare(b[sortName], 'zh');
      } else if (sortName === 'timeOn') {
        return sortType * (moment(a.timeOn) - moment(b.timeOn));
      } else if (sortName === 'durationTime') {
        return sortType * (moment(b.timeOn) - moment(a.timeOn));
      }
      return a.key - b.key;

    }).filter((e, i) => { // 筛选页面
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return (i >= startIndex && i < endIndex);
    });

    const [removeRight, worklistRight] = handleRights(['alarm_remove', 'alarm_worklist']);//操作权限
    return (
      <div className={styles.realTimeWarningTable}>
        <span ref={'select'} />
        {removeRight ?
          <div className={styles.tableHeader}>
            <Select onChange={this.onHandle}
              value="操作"
              getPopupContainer={() => this.refs.select}
              placeholder="操作" dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown}>
              {/* <Option value="ticket" disabled={selectedRowKeys.length === 0}><i className="iconfont icon-tranlist"></i>转工单</Option>  */}
              <Option value="relieve" disabled={selectedRowKeys.length === 0}><i className="iconfont icon-manual"></i>手动解除</Option>
            </Select>
            <CommonPagination pageSize={pageSize} currentPage={currentPage} onPaginationChange={this.onPaginationChange} total={realtimeWarning.length} theme={this.props.theme} />
          </div> : <div></div>}
        <CneTable
          columns={worklistRight ? columns.concat(realTimeWarningColumn) : columns}
          dataSource={tableSource}
          rowSelection={rowSelection}
          pagination={false}
          // loading={diagnoseListLoading}
          // dataError={diagnoseListError}
          sortField={sortName}
          sortMethod={sortMethod}
          className={styles.diagnoseTable}
          onChange={this.tableChange}
        />



        {realtimeWarning.length > 0 && <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedRowKeys.length}</span>项</span>
          {selectedRowKeys.length > 0 && <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>}
        </div>}

        {showTransferTicketModal &&
          <TransferWarningModal
            onCancel={() => this.setState({ showTransferTicketModal: false })}
            onTransferAlarm={transferWarning}
            defectTypes={defectTypes}
            selectedTransfer={selectedTransfer}
            getLostGenType={getLostGenType}
            theme={theme}
          />
        }
        {showHandleRemoveModal &&
          <HandleRemoveModal
            onCancel={() => this.setState({ showHandleRemoveModal: false })}
            HandleRemoveWarning={this.props.HandleRemoveWarning}
            selectedRowKeys={selectedRowKeys}
            theme={theme}
          />
        }
      </div>
    );
  }
}
export default (RealTimeWarningTable);


