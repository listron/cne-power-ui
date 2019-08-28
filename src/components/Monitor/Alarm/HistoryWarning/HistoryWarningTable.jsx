import React, { Component } from "react";
import styles from './historyWarning.scss';
import CommonPagination from '../../../Common/CommonPagination';

import { Link } from 'react-router-dom';
import { Table, Select, Popover, Icon, Button } from 'antd';
import moment from 'moment';

class HistoryWarningTable extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showRelievePopover: [],
      showTransferPopover: [],
      showAutoRelievePopover: [],
    }
  }

  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    const { changeHistoryWarningStore, onChangeFilter, } = this.props;
    changeHistoryWarningStore({ pageNum: currentPage, pageSize })
    onChangeFilter({ pageNum: currentPage, pageSize })
  }
  onTransferChange(visible, workOrderId, i) {
    if (visible) {
      this.props.getHistoryTicketInfo({
        workOrderId
      });
    } else {
      this.props.changeHistoryWarningStore({
        ticketInfo: {}
      });
    }
    let showTransferPopover = this.state.showTransferPopover;
    showTransferPopover[i] = visible;
    this.setState({
      showTransferPopover
    });
  }

  onRelieveChange(visible, operateId, i) {
    if (visible) {
      this.props.getHistoryRelieveInfo({
        operateId
      });
    } else {
      this.props.changeHistoryWarningStore({
        relieveInfo: {}
      });
    }
    let showRelievePopover = this.state.showRelievePopover;
    showRelievePopover[i] = visible;
    this.setState({
      showRelievePopover
    });
  }

  onAutoRelieveChange(visible, i) {
    let showAutoRelievePopover = this.state.showAutoRelievePopover;
    showAutoRelievePopover[i] = visible;
    this.setState({
      showAutoRelievePopover
    });
  }
  getDetail = (defectId, index) => { // 查看工单详情
    this.props.changeHistoryWarningStore({ pageName: 'detail', defectId })
    this.setState((state) => {
      return state.showTransferPopover[index] = false
    })
  }

  tableChange = (pagination, filters, sorter) => {
    const { changeHistoryWarningStore, onChangeFilter, } = this.props;
    const { field, order } = sorter;
    const sortInfo = {
      warningLevel: '1',
      stationName: '2',
      deviceName: '8',
      deviceTypeName: '3',
      timeOn: '5',
      timeOff: '6',
    };
    const orderField = sortInfo[field] ? sortInfo[field] : '';
    const orderCommand = order ? (sorter.order === 'ascend' ? '1' : '2') : '';
    changeHistoryWarningStore({ orderField, orderCommand })
    onChangeFilter({
      orderField, orderCommand
    })
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
            let showTransferPopover = this.state.showTransferPopover;
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
        <Button className={styles.ticketButton} onClick={() => { this.getDetail(record.workOrderId, index) }}>
          查看工单详情
        </Button>

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
            let showRelievePopover = this.state.showRelievePopover;
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
            let showAutoRelievePopover = this.state.showAutoRelievePopover;
            showAutoRelievePopover[i] = false;
            this.setState({
              showAutoRelievePopover
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
        render: (text, record, index) => {
          return level[text - 1]
        },
        sorter: true,
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
      }, {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        sorter: true,
        render: (text, record) => {
          const deviceTypeCodes = ["202", "304", "302", "201", "509", "206", "203", "101"];
          const isClick = deviceTypeCodes.includes(`${record.deviceTypeCode}`);
          if (isClick) {
            return (
              <div className={styles.deviceName}>
                <Link to={`/hidden/monitorDevice/${record.stationCode}/${record.deviceTypeCode}/${record.deviceFullCode}`} className={styles.underlin} >{text}</Link>
              </div>
            );
          } else {
            return text;
          }
        }
      }, {
        title: '设备类型',
        dataIndex: 'deviceTypeName',
        key: 'deviceTypeName',
        sorter: true,
      }, {
        title: '告警描述',
        dataIndex: 'warningCheckDesc',
        key: 'warningCheckDesc',
        render: (text, record) => {
          return <div className={styles.alarmDesc} title={text}>{text}</div>
        }
      }, {
        title: '发生时间',
        dataIndex: 'timeOn',
        key: 'timeOn',
        render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm'),
        sorter: true,
      }, {
        title: '结束时间',
        dataIndex: 'timeOff',
        key: 'timeOff',
        sorter: true,
        render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm'),
      },
      {
        title: '告警处理',
        key: 'warningRemove',
        render: (text, record, index) => {
          if (record.warningStatus === '3') {
            return (
              <Popover content={this.renderTransferPopover(index, record)}
                trigger="click"
                visible={this.state.showTransferPopover[index]}
                onVisibleChange={(visible) => this.onTransferChange(visible, record.workOrderId, index)}
              >
                <div className={this.state.showTransferPopover[index] ? styles.selected : null}><i className="iconfont icon-tranlist icon-action"></i></div>
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
        }
        // }
      }
    ]
    const { historyWarningList, pageSize, pageNum, total, theme } = this.props;


    return (
      <div className={styles.realTimeWarningTable}>
        <div className={styles.tableHeader}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={total} theme={theme} />
        </div>
        <span ref={'popover'} />
        <Table
          dataSource={historyWarningList}
          rowKey={record => record.warningLogId}
          columns={columns}
          pagination={false}
          onChange={this.tableChange}
          locale={{
            emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }}
            /></div>
          }}
        />
      </div>
    )
  }
}
export default (HistoryWarningTable)


