import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './transferForm.scss';
import CommonPagination from '../../../Common/CommonPagination';

import { Link } from 'react-router-dom';
import { Popover, Icon, Button } from 'antd';
import CneTable from '@components/Common/Power/CneTable';
import moment from 'moment';

class TransferFormTable extends Component {
  static propTypes = {
    changeTransferFormStore: PropTypes.func,
    onChangeFilter: PropTypes.func,
    pageSize: PropTypes.number,
    getTransferInfo: PropTypes.func,
    pageNum: PropTypes.number,
    ticketInfo: PropTypes.object,
    transferFormList: PropTypes.array,
    rangTime: PropTypes.array,
    stationCodes: PropTypes.array,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
    theme: PropTypes.string,

  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showTransferPopover: [],
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

  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    const { changeTransferFormStore, onChangeFilter } = this.props;
    onChangeFilter({ pageNum: currentPage, pageSize });
  }

  onTransferChange(visible, workOrderId, index) { // 切换需求
    this.setState((state) => {
      return state.showTransferPopover[index] = visible;
    });
    this.props.getTransferInfo({ workOrderId });//请求工单的详细信息
  }




  tableChange = (pagination, filters, sorter) => {
    const { changeTransferFormStore, onChangeFilter, orderField, orderCommand } = this.props;
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
    changeTransferFormStore({ orderField: newOrderField, orderCommand: newOrderCommand });
    onChangeFilter({
      orderField: newOrderField, orderCommand: newOrderCommand,
    });
  }

  renderTransferPopover(index, record) { // 转到工单页面的气泡
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
            <span className={styles.value}>{moment.utc(ticketInfo.operateTime).format('YYYY-MM-DD HH:mm')}</span>
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

  render() {
    const level = ['一级', '二级', '三级', '四级'];
    const columns = [
      {
        title: '预警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        width: '8%',
        textAlign: 'center',
        render: (text) => {
          return <div>{level[text - 1]}</div>;
        },
        sorter: true,
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        textAlign: 'left',
        width: '15%',
        sorter: true,
        render: (text) => {
          return <div className={styles.overflowText}>{text}</div>;
        },
      }, {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        width: '15%',
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
        dataIndex: 'deviceTypeName',
        key: 'deviceTypeName',
        width: '15%',
        textAlign: 'left',
        sorter: true,
        render: (text) => {
          return <div className={`${styles.alarmDesc} ${styles.alarmType}`} title={text}>{text || '- -'}</div>;
        },
      }, {
        title: '预警描述',
        dataIndex: 'warningCheckDesc',
        key: 'warningCheckDesc',
        textAlign: 'left',
        width: '20%',
        render: (text) => {
          return <div className={`${styles.alarmDesc} ${styles.alarmDescName}`} title={text}>{text}</div>;
        },
      }, {
        title: '发生时间',
        dataIndex: 'timeOn',
        key: 'timeOn',
        textAlign: 'center',
        width: '12%',
        render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm'),
        sorter: true,
      }, {
        title: '持续时间',
        dataIndex: 'durationTime',
        key: 'durationTime',
        textAlign: 'right',
        sorter: true,
        width: '9%',
      }, {
        title: '预警处理',
        key: 'warningRemove',
        textAlign: 'center',
        width: '6%',
        render: (text, record, index) => {
          // if (record.isTransferWork === 0) {
          return (
            <Popover
              content={this.renderTransferPopover(index, record)}
              trigger="click"
              visible={this.state.showTransferPopover[index]}
              onVisibleChange={(visible) => this.onTransferChange(visible, record.workOrderId, index)}
              arrowPointAtCenter
              getPopupContainer={() => this.refs.popover}
            >
              <div style={{display: 'flex', justifyContent: 'center'}} className={this.state.showTransferPopover[index] ? styles.selected : styles.hoverDiv}><i className="iconfont icon-tranlist icon-action"></i></div>
            </Popover>
          );
        },
        // }
      },
    ];
    const { transferFormList, pageSize, pageNum, total, theme, orderField, orderCommand } = this.props;

    return (
      <div className={styles.realTimeWarningTable}>
        <div className={styles.tableHeader}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={total} theme={theme} />
        </div>
        <span ref="popover" />
        <CneTable
          dataSource={transferFormList}
          rowKey={record => record.warningLogId}
          columns={columns}
          pagination={false}
          sortField={this.tableSortMap[orderField]}
          sortMethod={this.sortMethodMap[orderCommand]}
          onChange={this.tableChange}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    );
  }
}
export default (TransferFormTable);


