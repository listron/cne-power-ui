import React, { Component } from 'react';
import styles from './historyWarning.scss';
import CommonPagination from '../../../Common/CommonPagination';
import CneTable from '../../../Common/Power/CneTable';
import { Link } from 'react-router-dom';
import { Table, Select, Popover, Icon, Button } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

class HistoryWarningTable extends Component {
  static propTypes = {
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
    ticketInfo: PropTypes.object,
    relieveInfo: PropTypes.object,
    historyWarningList: PropTypes.array,
    loading: PropTypes.bool,
    changeHistoryWarningStore: PropTypes.func,
    onChangeFilter: PropTypes.func,
    getHistoryTicketInfo: PropTypes.func,
    getHistoryRelieveInfo: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showRelievePopover: [],
      showTransferPopover: [],
      showAutoRelievePopover: [],
    };
  }


  tableSortMap = { // api存储字段 => 表格排序字段
    '1': 'warningLevel',
    '2': 'stationName',
    '3': 'deviceTypeName',
    '5': 'timeOn',
    '6': 'timeOff',
    '8': 'deviceName',
  };

  sortMethodMap = {
    '2': 'descend',
    '1': 'ascend',
  }

  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    const { changeHistoryWarningStore, onChangeFilter } = this.props;
    changeHistoryWarningStore({ pageNum: currentPage, pageSize });
    onChangeFilter({ pageNum: currentPage, pageSize });
  }

  onTransferChange(visible, workOrderId, i) {
    if (visible) {
      this.props.getHistoryTicketInfo({
        workOrderId,
      });
    } else {
      this.props.changeHistoryWarningStore({
        ticketInfo: {},
      });
    }
    const showTransferPopover = this.state.showTransferPopover;
    showTransferPopover[i] = visible;
    this.setState({
      showTransferPopover,
    });
  }

  onRelieveChange(visible, operateId, i) {
    if (visible) {
      this.props.getHistoryRelieveInfo({
        operateId,
      });
    } else {
      this.props.changeHistoryWarningStore({
        relieveInfo: {},
      });
    }
    const showRelievePopover = this.state.showRelievePopover;
    showRelievePopover[i] = visible;
    this.setState({
      showRelievePopover,
    });
  }

  onAutoRelieveChange(visible, i) {
    const showAutoRelievePopover = this.state.showAutoRelievePopover;
    showAutoRelievePopover[i] = visible;
    this.setState({
      showAutoRelievePopover,
    });
  }

  tableChange = (pagination, filters, sorter) => {
    const { changeHistoryWarningStore, onChangeFilter, orderField, orderCommand } = this.props;
    const { field } = sorter;
    const sortInfo = {
      warningLevel: '1',
      stationName: '2',
      deviceName: '8',
      deviceTypeName: '3',
      timeOn: '5',
      timeOff: '6',
    };
    let newOrderField = orderField, newOrderCommand = '2';
    if (!field || (sortInfo[field] === newOrderField)) { // 点击的是正在排序的列
      newOrderCommand = orderCommand === '1' ? '2' : '1'; // 交换排序方式
    } else { // 切换列
      newOrderField = sortInfo[field];
    }
    changeHistoryWarningStore({ orderField: newOrderField, orderCommand: newOrderCommand });
    onChangeFilter({
      orderField: newOrderField, orderCommand: newOrderCommand,
    });
  }

  renderTransferPopover(index, record) {
    const { ticketInfo } = this.props;
    return (
      <div className={styles.detailInfo}>
        <div className={styles.header}>
          <div className={styles.title}>
            <i className="iconfont icon-tranlist icon-action"></i>
            <span className={styles.titleText}>已转工单</span>
          </div>
          <Icon type="close" onClick={() => {
            const showTransferPopover = this.state.showTransferPopover;
            showTransferPopover[index] = false;
            this.setState({ showTransferPopover });
          }} />
        </div>
        <div className={styles.content}>
          <div className={styles.infoItem}>
            <span className={styles.label}>转工单人：</span>
            <span className={styles.value}>{ticketInfo.userFullName ? ticketInfo.userFullName : ticketInfo.username}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>操作时间：</span>
            <span className={styles.value}>{moment(ticketInfo.operateTime).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>缺陷类型：</span>
            <span className={styles.value}>{ticketInfo.defectTypeName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>缺陷描述：</span>
            <span className={styles.value}>{ticketInfo.defectDescribe}</span>
          </div>
        </div>

        <Button className={styles.ticketButton}>
          <Link to={`/operation/workProcess/view?page=defectDetail&defectId=${record.workOrderId}`} target="_blank">
            查看工单详情
          </Link>
        </Button>

      </div>
    );
  }

  renderRelievePopover(record, i) {
    const { relieveInfo } = this.props;
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
            <span className={styles.value}>{relieveInfo.userFullName ? relieveInfo.userFullName : relieveInfo.username}</span>
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

  renderAutoRelievePopover(record, i) {
    return (
      <div className={styles.detailInfo}>
        <div className={styles.header}>
          <div className={styles.title}>
            <i className="iconfont icon-lifted icon-action"></i>
            <span className={styles.titleText}>自动解除</span>
          </div>
          <Icon type="close" onClick={() => {
            const showAutoRelievePopover = this.state.showAutoRelievePopover;
            showAutoRelievePopover[i] = false;
            this.setState({
              showAutoRelievePopover,
            });
          }} />
        </div>
        <div className={styles.content}>
          <div className={styles.infoItem}>
            <span className={styles.label}>持续时间：</span>
            <span className={styles.value}>{record.durationTime}</span>
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
        sorter: true,
        className: styles.warningLevel,
        textAlign: 'center',
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
        title: '结束时间',
        dataIndex: 'timeOff',
        key: 'timeOff',
        textAlign: 'center',
        className: styles.timeOff,
        sorter: true,
        render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm'),
      },
      {
        title: '告警处理',
        key: 'warningRemove',
        className: styles.warningRemove,
        textAlign: 'center',
        render: (text, record, index) => {
          if (record.warningStatus === '3') {
            return (
              <Popover content={this.renderTransferPopover(index, record)}
                trigger="click"
                getPopupContainer={() => this.refs.popover}
                visible={this.state.showTransferPopover[index]}
                getPopupContainer={() => this.refs.popover}
                onVisibleChange={(visible) => this.onTransferChange(visible, record.workOrderId, index)}
              >
                <div className={this.state.showTransferPopover[index] ? styles.selected : null}>
                  <i className="iconfont icon-tranlist icon-action"></i>
                </div>
              </Popover>
            );
          }
          if (record.warningStatus === '2') {
            return (
              <Popover content={this.renderRelievePopover(index)}
                trigger="click"
                visible={this.state.showRelievePopover[index]}
                getPopupContainer={() => this.refs.popover}
                onVisibleChange={(visible) => this.onRelieveChange(visible, record.operateId, index)}
              >
                <div className={this.state.showRelievePopover[index] ? styles.selected : null}><i className="iconfont icon-manual icon-action"></i></div>
              </Popover>
            );
          }
          return (
            <Popover
              visible={this.state.showAutoRelievePopover[index]}
              onVisibleChange={(visible) => this.onAutoRelieveChange(visible, index)}
              content={this.renderAutoRelievePopover(record, index)}
              getPopupContainer={() => this.refs.popover}
              trigger="click">
              <div className={this.state.showAutoRelievePopover[index] ? styles.selected : null}><i className="iconfont icon-lifted icon-action"></i></div>
            </Popover>
          );
        },
        // }
      },
    ];
    const { historyWarningList, pageSize, pageNum, total, theme, loading, orderField, orderCommand } = this.props;
    return (
      <div className={styles.realTimeWarningTable}>
        <div className={styles.tableHeader}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={total} theme={theme} />
        </div>
        <span ref={'popover'} />
        <CneTable
          columns={columns}
          dataSource={historyWarningList}
          rowKey={record => record.warningLogId}
          pagination={false}
          loading={loading}
          // dataError={diagnoseListError}
          sortField={this.tableSortMap[orderField]}
          sortMethod={this.sortMethodMap[orderCommand]}
          onChange={this.tableChange}
        />
      </div>
    );
  }
}
export default (HistoryWarningTable);


