import React, { Component } from 'react';
import CommonPagination from '../../../../Common/CommonPagination';
import styles from './deviceMonitor.scss';
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import TransferWarningModal from './monitorModal/TransferWarningModal';
import HandleRemoveModal from './monitorModal/HandleRemoveModal';
const warningLevelArray = [{
  levelName: '一级',
  levelColor: '#a42b2c',
}, {
  levelName: '二级',
  levelColor: '#e08031',
}, {
  levelName: '三级',
  levelColor: '#f9b600',
}, {
  levelName: '四级',
  levelColor: '#fbe6e3',
}];
class DeviceAlarmTable extends Component {

  static propTypes = {
    deviceAlarmList: PropTypes.array,
    defectTypes: PropTypes.array,
    selectedTransfer: PropTypes.array,
    deviceDetail: PropTypes.object,
    stationCode: PropTypes.string,
    style: PropTypes.object,
    titleName: PropTypes.bool,
    handleRemoveWarning: PropTypes.func,
    transferWarning: PropTypes.func,
    getLostGenType: PropTypes.func,
    changeDeviceStore: PropTypes.func,
  }

  static defaultProps = {
    titleName: true,
    style: { padding: '0px 68px 48px 68px' },
  }

  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      currentPage: 1,
      sortName: 'warningLevel',
      descend: false,
      showTransferTicketModal: false,
      showHandleRemoveModal: false,
      selectedRowKeys: [],
    };
  }

  ontableSort = (pagination, filters, sorter) => {
    this.setState({
      sortName: sorter.field,
      descend: sorter.order === 'descend',
    });
  }

  onShowDetail = (record) => {
    this.setState({
      showTransferTicketModal: true,
    }, () => {
      this.props.changeDeviceStore({ selectedTransfer: [record] });
    });
  };

  onDelDetail = (record) => {
    const { warningLogId } = record;
    this.setState({
      selectedRowKeys: [warningLogId],
      showHandleRemoveModal: true,
    });
  };

  initColumn = () => {
    const columns = [
      {
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        sorter: true,
        render: (text, record, index) => {
          const warningInfor = text && warningLevelArray[text - 1];
          return (text &&
            <span style={{ color: warningInfor.levelColor, border: `1px solid ${warningInfor.levelColor}` }} className={styles.level}>
              {warningInfor.levelName}
            </span>
          );
        },
      }, {
        title: '告警类型',
        dataIndex: 'warningConfigName',
        key: 'warningConfigName',
        sorter: true,
        render: (text) => text > 200 ? '限制告警' : '事件告警',
      }, {
        title: '告警描述',
        dataIndex: 'warningCheckDesc',
        key: 'warningCheckDesc',
      }, {
        title: '发生时间',
        dataIndex: 'timeOn',
        key: 'timeOn',
        sorter: true,
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm'),
      }, {
        title: '持续时间',
        dataIndex: 'durationTime',
        key: 'durationTime',
        sorter: true,
      }, {
        title: '操作',
        align: 'center',
        dataIndex: '操作',
        key: '操作',
        render: (text, record) => (
          <div className={styles.actionBtnBox}>
            <span className={styles.operationBtn} title="转工单">
              <i className="iconfont icon-tranlist icon-action" onClick={() => { this.onShowDetail(record); }} />
            </span>
            <span className={styles.delBtn} title="手动解除" onClick={() => { this.onDelDetail(record) }}>
              <i className="iconfont icon-manual" />
            </span>
          </div>
        ),
      },
    ];
    return columns;
  }

  changePagination = ({ pageSize, currentPage }) => {
    this.setState({ pageSize, currentPage });
  }

  createTableSource = (data) => { // 数据源的排序，翻页
    const { pageSize, currentPage, sortName, descend } = this.state;
    const tableSource = [...data].map((e, i) => ({
      ...e,
      key: i,
    })).sort((a, b) => { // 手动排序
      const sortType = descend ? -1 : 1;
      if (sortName === 'warningLevel') {
        return sortType * (a.warningLevel - b.warningLevel);
      } else if (sortName === 'warningConfigName') {
        return sortType * a.warningConfigName.localeCompare(b.warningConfigName);
      } else if (sortName === 'timeOn') {
        return sortType * (moment(a.timeOn) - moment(b.timeOn));
      } else if (sortName === 'durationTime') {
        return sortType * (moment(b.timeOn) - moment(a.timeOn));
      }
    }).filter((e, i) => { // 筛选页面
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return (i >= startIndex && i < endIndex);
    });
    return tableSource;
  }

  render() {
    const {
      deviceAlarmList = [],
      deviceDetail = {},
      stationCode, style,
      titleName = 'true',
      theme = 'light',
      handleRemoveWarning,
      transferWarning,
      defectTypes,
      getLostGenType,
      selectedTransfer,
      changeDeviceStore,
    } = this.props;
    const { pageSize, currentPage, showTransferTicketModal, showHandleRemoveModal, selectedRowKeys } = this.state;
    const tableSource = this.createTableSource(deviceAlarmList);
    const columns = this.initColumn();
    const { deviceName } = deviceDetail;
    return (
      <div className={`${styles.alarmTable} ${styles[theme]}`} style={style}>
        <div className={styles.tableHeader}>
          <Button className={styles.historyButton}>
            <Link to={{
              pathname: '/monitor/alarm/history',
              search: `?stationCode=${stationCode}`, state: { deviceName },
            }}> 查看历史告警  </Link>
          </Button>
          <CommonPagination pageSize={pageSize} currentPage={currentPage} onPaginationChange={this.changePagination} total={deviceAlarmList.length}
            theme={theme}
          />
        </div>
        <Table
          dataSource={tableSource}
          onChange={this.ontableSort}
          columns={columns}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        // loading={loading}
        />
        {showTransferTicketModal &&
          <TransferWarningModal
            deviceAlarmList={deviceAlarmList}
            changeDeviceStore={changeDeviceStore}
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
            changeDeviceStore={changeDeviceStore}
            deviceAlarmList={deviceAlarmList}
            onCancel={() => this.setState({ showHandleRemoveModal: false })}
            handleRemoveWarning={handleRemoveWarning}
            selectedRowKeys={selectedRowKeys}
            theme={theme}
          />
        }
      </div>
    );
  }

}

export default DeviceAlarmTable;
