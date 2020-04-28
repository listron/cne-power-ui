import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './transferForm.scss';
import CommonPagination from '../../../Common/CommonPagination';
import CneTable from '../../../Common/Power/CneTable';
import CneButton from '@components/Common/Power/CneButton';
import { Link } from 'react-router-dom';
import { Popover, Icon } from 'antd';
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


  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    const { onChangeFilter } = this.props;
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
        <CneButton
          lengthMode="long"
          style={{margin: '0 auto'}}
        >
          <Link to={`/operation/workProcess/view?page=defectDetail&defectId=${record.workOrderId}`} target="_blank">
            查看工单详情
          </Link>
        </CneButton>
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
      }, {
        title: '告警处理',
        key: 'warningRemove',
        className: styles.warningRemove,
        textAlign: 'center',
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
              <div className={this.state.showTransferPopover[index] ? styles.selected : null}><i className="iconfont icon-tranlist icon-action"></i></div>
            </Popover>
          );
        },
        // }
      },
    ];
    const { transferFormList, pageSize, pageNum, total, theme, orderField, orderCommand, loading } = this.props;
    return (
      <div className={styles.realTimeWarningTable}>
        <div className={styles.tableHeader}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={total} theme={theme} />
        </div>
        <span ref="popover" />
        <CneTable
          columns={columns}
          dataSource={transferFormList}
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
export default (TransferFormTable);


