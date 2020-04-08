import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './handleRemove.scss';
import CommonPagination from '../../../Common/CommonPagination';
import WarningTip from '../../../Common/WarningTip';
import TransferWarningModal from '../RealTimeWarning/TransferWarningModal';
import { Link } from 'react-router-dom';
import { Table, Select, Popover, Icon, Button } from 'antd';
import moment from 'moment';
import { handleRights } from '@utils/utilFunc';
const Option = Select.Option;
import CneTable from '../../../Common/Power/CneTable';

class HandleRemoveTable extends Component {
  static propTypes = {
    cancleHandleRemove: PropTypes.func,
    changeHandleRemoveStore: PropTypes.func,
    getHandleRemoveInfo: PropTypes.func,
    getHandleRemoveTransfer: PropTypes.func,
    onChangeFilter: PropTypes.func,
    relieveInfo: PropTypes.object,
    handleRemoveList: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showTransferTicketModal: false,
      showWarningTip: false,
      warningTipText: '',
      showRelievePopover: [],
    };
  }


  tableSortMap = { // api存储字段 => 表格排序字段
    '1': 'warningLevel',
    '2': 'stationName',
    '3': 'deviceTypeName',
    '5': 'timeOn',
    '8': 'deviceName',
    '9': 'durationTime',
  };

  sortMethodMap = {
    '2': 'descend',
    '1': 'ascend',
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
      orderField: newOrderField, orderCommand: newOrderCommand,
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
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        render: (text, record, index) => level[text - 1],
        className: styles.warningLevel,
        textAlign: 'center',
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
        render: (text) => (<div title={text || '--'} className={styles.deviceTypeNameText}>{text || '--'}</div>),
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
      }, {
        title: '告警处理',
        dataIndex: 'operation',
        key: 'operation',
        className: styles.operation,
        render: (text, record, index) => {
          return (
            <Popover content={this.renderRelievePopover(index)}
              trigger="click"
              className={this.state.showRelievePopover[index] ? styles.selected : null}
              visible={this.state.showRelievePopover[index]}
              getPopupContainer={() => this.refs.select}
              onVisibleChange={(visible) => this.onRelieveChange(visible, record.operateId, index)}
            >
              <div className={this.state.showRelievePopover[index] ? styles.selected : null}>
                <i className="iconfont icon-manual icon-action" /></div>
            </Popover>
          );
        },
      }, {
        title: '操作',
        className: styles.iconDetail,
        textAlign: 'center',
        render: (text, record) => (
          <div>
            <i className="iconfont icon-tranlist icon-action" onClick={() => { this.onShowDetail(record); }} />
          </div>
        ),
      },
    ];

    const operationColumn = {
      title: '操作',
      className: styles.iconDetail,
      render: (text, record) => (
        <div>
          <span>
            <i className="iconfont icon-tranlist icon-action" onClick={() => { this.onShowDetail(record); }} />
          </span>
        </div>
      ),
    };
    const { handleRemoveList, selectedRowKeys, pageSize, pageNum, total, loading, selectedTransfer, getLostGenType, theme, orderField, orderCommand } = this.props;
    const { showTransferTicketModal, showWarningTip, warningTipText } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const [removeRight, alarmRemoveRight] = handleRights(['alarm_remove', 'monitor_alarm_remove']);//操作权限
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
        {removeRight ?
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
          </div> : <div></div>}
        <CneTable
          columns={alarmRemoveRight ? columns.concat(operationColumn) : columns}
          dataSource={handleRemoveList}
          rowKey={record => record.warningLogId}
          rowSelection={rowSelection}
          pagination={false}
          loading={loading}
          // dataError={diagnoseListError}
          sortField={this.tableSortMap[orderField]}
          sortMethod={this.sortMethodMap[orderCommand]}
          onChange={this.tableChange}
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


