import React, { Component } from 'react';
import styles from './historyWarning.scss';
import CommonPagination from '../../../Common/CommonPagination';

import { Link } from 'react-router-dom';
import { Popover, Icon, Button } from 'antd';
import CneTable from '@components/Common/Power/CneTable';
import moment from 'moment';
import CneButton from '@components/Common/Power/CneButton';
import PropTypes from 'prop-types';

class HistoryWarningTable extends Component {
  static propTypes = {
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showRelievePopover: [],
      showTransferPopover: [],
      showAutoRelievePopover: [],

    };
    this.tableSortMap = { // api存储字段 => 表格排序字段
      '1': 'warningLevel',
      '2': 'stationName',
      '3': 'deviceTypeName',
      '5': 'timeOn',
      '8': 'deviceName',
      '6': 'timeOff',
    };
    this.sortMethodMap = {
      '2': 'descend',
      '1': 'ascend',
    };
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
    const { field, order } = sorter;
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
        {/*<Button className={styles.ticketButton} ><Link to={`/operation/ticket/${ticketInfo.defectId}`}>查看工单详情</Link></Button>  */}
        <CneButton
          lengthMode="long"
          style={{ margin: '0 auto' }}
        >
          <Link to={`/operation/workProcess/view?page=defectDetail&defectId=${record.workOrderId}`} target="_blank">
            查看工单详情
          </Link>
        </CneButton>

      </div>
    );
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
        title: '预警级别',
        width: '7%',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        textAlign: 'center',
        render: (text) => {
          return <div>{level[text - 1]}</div>;
        },
        sorter: true,
      }, {
        title: '电站名称',
        width: '15%',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
        textAlign: 'left',
        render: (text) => {
          return <div className={styles.overflowText}>{text}</div>;
        },
      }, {
        title: '设备名称',
        width: '15%',
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
        width: '15%',
        dataIndex: 'deviceTypeName',
        key: 'deviceTypeName',
        textAlign: 'left',
        sorter: true,
        render: (text) => {
          return <div className={`${styles.alarmDesc} ${styles.alarmType}`} title={text}>{text || '- -'}</div>;
        },
      }, {
        title: '预警描述',
        width: '20%',
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
        title: '结束时间',
        width: '11%',
        dataIndex: 'timeOff',
        key: 'timeOff',
        sorter: true,
        textAlign: 'center',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm'),
      },
      {
        title: '预警处理',
        width: '6%',
        key: 'warningRemove',
        textAlign: 'center',
        render: (text, record, index) => {
          if (record.warningStatus === '3') {
            return (
              <Popover content={this.renderTransferPopover(index, record)}
                trigger="click"
                visible={this.state.showTransferPopover[index]}
                getPopupContainer={() => this.refs.popover}
                onVisibleChange={(visible) => this.onTransferChange(visible, record.workOrderId, index)}
              >
                <div style={{ display: 'flex', justifyContent: 'center' }} className={this.state.showTransferPopover[index] ? styles.selected : styles.hoverDiv}><i className="iconfont icon-tranlist icon-action"></i></div>
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
                <div style={{ display: 'flex', justifyContent: 'center' }} className={this.state.showRelievePopover[index] ? styles.selected : styles.hoverDiv}><i className="iconfont icon-manual icon-action"></i></div>
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
              <div style={{ display: 'flex', justifyContent: 'center' }} className={this.state.showAutoRelievePopover[index] ? styles.selected : styles.hoverDiv}><i className="iconfont icon-lifted icon-action"></i></div>
            </Popover>
          );
        },
        // }
      },
    ];
    const { historyWarningList, pageSize, pageNum, total, theme, orderField, orderCommand } = this.props;

    return (
      <div className={styles.realTimeWarningTable}>
        <div className={styles.tableHeader}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={total} theme={theme} />
        </div>
        <span ref={'popover'} />
        <div className={styles.tableWrap}>
          <CneTable
            dataSource={historyWarningList}
            rowKey={record => record.warningLogId}
            columns={columns}
            pagination={false}
            sortField={this.tableSortMap[orderField]}
            sortMethod={this.sortMethodMap[orderCommand]}
            onChange={this.tableChange}
          />
        </div>

      </div>
    );
  }
}
export default (HistoryWarningTable);


