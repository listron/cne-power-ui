import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './handleRemove.scss';
import CommonPagination from '../../../Common/CommonPagination';
import WarningTip from '../../../Common/WarningTip';
import TransferWarningModal from '../RealTimeWarning/TransferWarningModal';
import { Link } from 'react-router-dom';
import { Select, Popover, Icon } from 'antd';
import CneTable from '@components/Common/Power/CneTable';
import moment from 'moment';
const Option = Select.Option;

class HandleRemoveTable extends Component {
  static propTypes = {
    cancleHandleRemove: PropTypes.func,
    changeHandleRemoveStore: PropTypes.func,
    getHandleRemoveInfo: PropTypes.func,
    getHandleRemoveTransfer: PropTypes.func,
    onChangeFilter: PropTypes.func,
    relieveInfo: PropTypes.object,
    handleRemoveList: PropTypes.array,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showTransferTicketModal: false,
      showWarningTip: false,
      warningTipText: '',
      showRelievePopover: [],
    };
    this.tableSortMap = { // api存储字段 => 表格排序字段
      '1': 'warningLevel',
      '2': 'stationName',
      '3': 'deviceTypeName',
      '5': 'timeOn',
      '8': 'deviceName',
      '9': 'durationTime',
    };
    this.sortMethodMap = {
      '2': 'descend',
      '1': 'ascend',
    };
  }
  onConfirmWarningTip = () => {
    const { selectedRowKeys } = this.props;
    this.setState({
      showWarningTip: false,
      warningTipText: '',
    });
    this.props.cancleHandleRemove({
      warningLogId: selectedRowKeys,
    });
  }

  onCancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip: false,
    });
  }
  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    const { changeHandleRemoveStore, onChangeFilter } = this.props;
    changeHandleRemoveStore({ pageNum: currentPage, pageSize });
    onChangeFilter({ pageNum: currentPage, pageSize });
  }
  onHandle = (value) => {//转工单或手动解除的modal
    if (value === 'ticket') {
      this.setState({
        showTransferTicketModal: true,
      });
    } else if (value === 'cancleRemove') {
      this.setState({
        showWarningTip: true,
        warningTipText: ' 确定要取消解除么',
      });
    }
  }
  onSelectChange = (selectedRowKeys) => {//选择checkbox
    this.props.changeHandleRemoveStore({ selectedRowKeys });
  }
  onRelieveChange(visible, operateId, i) {
    if (visible) {
      this.props.getHandleRemoveInfo({
        operateId,
      });
    } else {
      this.props.changeHandleRemoveStore({
        relieveInfo: {},
      });
    }
    const showRelievePopover = this.state.showRelievePopover;
    showRelievePopover[i] = visible;
    this.setState({
      showRelievePopover,
    });
  }
  cancelRowSelect = () => {//取消选中
    this.props.changeHandleRemoveStore({ selectedRowKeys: [] });
  }

  tableChange = (pagination, filters, sorter) => {
    const { changeHandleRemoveStore, onChangeFilter, orderField, orderCommand } = this.props;
    const { field, order } = sorter;
    const sortInfo = {
      warningLevel: '1',
      stationName: '2',
      deviceName: '8',
      deviceTypeName: '3',
      timeOn: '5',
      durationTime: '9',
    };
    let newOrderField = orderField, newOrderCommand = '2';
    if (!field || (sortInfo[field] === newOrderField)) { // 点击的是正在排序的列
      newOrderCommand = orderCommand === '1' ? '2' : '1'; // 交换排序方式
    } else { // 切换列
      newOrderField = sortInfo[field];
    }
    changeHandleRemoveStore({ orderField: newOrderField, orderCommand: newOrderCommand });
    onChangeFilter({
      orderField: newOrderField, orderCommand: newOrderCommand
    });
  }
  onShowDetail = (record) => {
    this.setState({
      showTransferTicketModal: true,
    });
    this.props.changeHandleRemoveStore({ selectedTransfer: [record] });
  }
  renderRelievePopover(i) {
    const relieveInfo = this.props.relieveInfo;
    return (
      <div className={styles.detailInfo}>
        <div className={styles.header}>
          <div className={styles.title}>
            <i className="iconfont icon-manual icon-action"></i>
            <span className={styles.titleText}>手动解除</span>
          </div>
          <Icon type="close" onClick={() => {
            const showRelievePopover = this.state.showRelievePopover;
            showRelievePopover[i] = false;
            this.setState({ showRelievePopover });
          }} />
        </div>
        <div className={styles.content}>
          <div className={styles.infoItem}>
            <span className={styles.label}>解除人：</span>
            <span className={styles.value}>{relieveInfo.userFullname ? relieveInfo.userFullname : relieveInfo.username}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>截至时间：</span>
            <span className={styles.value}>{moment(relieveInfo.endTime).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>操作时间：</span>
            <span className={styles.value}>{moment(relieveInfo.operateTime).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>解除原因：</span>
            <span className={styles.value}>{relieveInfo.operateReason}</span>
          </div>
        </div>
      </div>
    );
  }




  render() {
    const level = ['一级', '二级', '三级', '四级'];
    const columns = [
      {
        title: '预警级别',
        width: '7%',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        textAlign: 'center',
        sorter: true,
        render: (text) => {
          return <div>{level[text - 1]}</div>;
        },
      }, {
        title: '电站名称',
        width: '14%',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
        textAlign: 'left',
        render: (text) => {
          return <div className={styles.overflowText}>{text}</div>;
        },
      }, {
        title: '设备名称',
        width: '14%',
        dataIndex: 'deviceName',
        key: 'deviceName',
        textAlign: 'left',
        sorter: true,
        render: (text, record) => {
          const deviceTypeCodes = ['202', '304', '302', '201', '206', '101'];
          const isClick = deviceTypeCodes.includes(`${record.deviceTypeCode}`);
          if (isClick) {
            return (
              <div className={styles.deviceName}>
                <Link to={`/hidden/monitorDevice/${record.stationCode}/${record.deviceTypeCode}/${record.deviceFullCode}`} className={styles.underlin} >{text}</Link>
              </div>
            );
          }
          return text;

        },
      }, {
        title: '设备类型',
        width: '14%',
        dataIndex: 'deviceTypeName',
        key: 'deviceTypeName',
        sorter: true,
        textAlign: 'left',
        render: (text) => {
          return <div className={`${styles.alarmDesc} ${styles.alarmType}`} title={text}>{text || '- -'}</div>;
        },
      }, {
        title: '预警描述',
        width: '18%',
        dataIndex: 'warningCheckDesc',
        key: 'warningCheckDesc',
        textAlign: 'left',
        render: (text) => {
          return <div className={`${styles.alarmDesc} ${styles.alarmDescName}`} title={text}>{text}</div>;
        },
      }, {
        title: '发生时间',
        width: '11%',
        dataIndex: 'timeOn',
        key: 'timeOn',
        textAlign: 'center',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm'),
        sorter: true,
      }, {
        title: '持续时间',
        width: '7%',
        dataIndex: 'durationTime',
        key: 'durationTime',
        textAlign: 'right',
        sorter: true,
      }, {
        title: '预警处理',
        width: '6%',
        dataIndex: 'operation',
        key: 'operation',
        textAlign: 'center',
        render: (text, record, index) => {
          return (
            <Popover content={this.renderRelievePopover(index)}
              trigger="click"
              className={this.state.showRelievePopover[index] ? styles.selected : null}
              visible={this.state.showRelievePopover[index]}
              getPopupContainer={() => this.refs.select}
              onVisibleChange={(visible) => this.onRelieveChange(visible, record.operateId, index)}
            >
              <div style={{display: 'flex', justifyContent: 'center'}} className={this.state.showRelievePopover[index] ? styles.selected : styles.hoverDiv}>
                <i className="iconfont icon-manual icon-action" /></div>
            </Popover>
          );
        },
      }, {
        title: '操作',
        width: '6%',
        textAlign: 'center',
        className: styles.iconDetail,
        render: (text, record) => (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <span>
              <i className="iconfont icon-tranlist icon-action" onClick={() => { this.onShowDetail(record); }} />
            </span>
          </div>
        ),
      },
    ];
    const { handleRemoveList, selectedRowKeys, pageSize, pageNum, total, loading, selectedTransfer, getLostGenType, theme, orderField, orderCommand } = this.props;
    const { showTransferTicketModal, showWarningTip, warningTipText } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className={styles.realTimeWarningTable}>
        {showWarningTip && <WarningTip
          style={{ marginTop: '350px', width: '210px', height: '88px' }}
          onCancel={this.onCancelWarningTip}
          hiddenCancel={false}
          theme={theme}
          onOK={this.onConfirmWarningTip}
          value={warningTipText} />}
        <span ref={'select'} />
        <div className={styles.tableHeader}>
          <Select onChange={this.onHandle}
            value="操作"
            placeholder="操作"
            dropdownMatchSelectWidth={false}
            getPopupContainer={() => this.refs.select}
            dropdownClassName={styles.handleDropdown}>
            {/* <Option value="ticket" disabled={selectedRowKeys.length === 0}><i className="iconfont icon-tranlist"></i>转工单</Option> */}
            <Option value="cancleRemove" disabled={selectedRowKeys.length === 0}><i className="iconfont icon-manual"></i>取消手动解除</Option>
          </Select>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={total} theme={theme} />
        </div>
        <CneTable
          dataSource={handleRemoveList}
          rowKey={record => record.warningLogId}
          rowSelection={rowSelection}
          columns={columns}
          pagination={false}
          sortField={this.tableSortMap[orderField]}
          sortMethod={this.sortMethodMap[orderCommand]}
          onChange={this.tableChange}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
        {handleRemoveList.length > 0 && <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedRowKeys.length}</span>项</span>
          {selectedRowKeys.length > 0 && <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>}
        </div>}

        {showTransferTicketModal &&
          <TransferWarningModal
            onCancel={() => this.setState({ showTransferTicketModal: false })}
            onTransferAlarm={this.props.getHandleRemoveTransfer}
            defectTypes={this.props.defectTypes}
            selectedTransfer={selectedTransfer}
            getLostGenType={getLostGenType}
          />
        }

      </div>
    );
  }
}
export default (HandleRemoveTable);


