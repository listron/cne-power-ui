import React, { Component } from 'react';
import CommonPagination from '../../../../Common/CommonPagination';
import styles from './deviceMonitor.scss';
import PropTypes from 'prop-types';
import { Button, Table, Icon } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
const warningLevelArray = [{
  levelName: '一级',
  levelColor: '#a42b2c'
}, {
  levelName: '二级',
  levelColor: '#e08031'
}, {
  levelName: '三级',
  levelColor: '#f9b600'
}, {
  levelName: '四级',
  levelColor: '#fbe6e3'
}];
class DeviceAlarmTable extends Component {

  static propTypes = {
    deviceAlarmList: PropTypes.array,
    deviceDetail: PropTypes.object,
    loading: PropTypes.bool,
    stationCode: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    deviceCode: PropTypes.string,
    style: PropTypes.object,
    titleName: PropTypes.bool,
  }

  static defaultProps = {
    titleName:false,
    style:{ padding: `0px 68px 48px 68px`}
  }

  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      currentPage: 1,
      sortName: 'warningLevel',
      descend: false,
    }
  }

  ontableSort = (pagination, filters, sorter) => {
    this.setState({
      sortName: sorter.field,
      descend: sorter.order === 'descend'
    })
  }

  initColumn = () => {
    const columns = [
      {
        title: '告警级别',
        dataIndex: 'warningLevel',
        key: 'warningLevel',
        sorter: true, // (a,b) => a.warningLevel - b.warningLevel,
        render: (text, record, index) => {
          const warningInfor = text && warningLevelArray[text - 1];
          return (text &&
            <span style={{ color: warningInfor.levelColor, border: `1px solid ${warningInfor.levelColor}` }} className={styles.level}>
              {warningInfor.levelName}
            </span>
          )
        }
      }, {
        title: '告警类型',
        dataIndex: 'warningConfigName',
        key: 'warningConfigName',
        sorter: true,
      }, {
        title: '告警描述',
        dataIndex: 'warningCheckDesc',
        key: 'warningCheckDesc',
      }, {
        title: '发生时间',
        dataIndex: 'timeOn',
        key: 'timeOn',
        sorter: true,
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm')
      }, {
        title: '持续时间',
        dataIndex: 'durationTime',
        key: 'durationTime',
        sorter: true,
      },
    ]
    return columns;
  }

  changePagination = ({ pageSize, currentPage }) => {
    this.setState({ pageSize, currentPage })
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
    // const { inverterList } = this.props;
    // const initDeviceList = inverterList.deviceList || [];
    // const totalNum = initDeviceList.length || 0;
    // const maxPage = Math.ceil(totalNum / pageSize);
    // if(totalNum === 0){ // 总数为0时，展示0页
    //   currentPage = 1;
    // }else if(maxPage < currentPage){ // 当前页已超出
    //   currentPage = maxPage;
    // }
    return tableSource
  }

  render() {
    const { deviceAlarmList, deviceDetail, stationCode, deviceTypeCode, deviceCode, style, titleName } = this.props;
    const { pageSize, currentPage } = this.state;
    const tableSource = this.createTableSource(deviceAlarmList);
    const columns = this.initColumn();
    const {deviceName}=deviceDetail
    return (
      <div className={styles.alarmTable} style={style}>
        {/* <div className={styles.alarmTip}>
          {titleName && `${deviceDetail.deviceTypeName}告警`}
          <Icon type="info" title="此列表为设备当前活动的告警" />
        </div> */}
        <h3>实时告警</h3>
        <div className={styles.tableHeader}>
          <Button className={styles.historyButton}>
             <Link to={{pathname:`/monitor/alarm/history`,
                search:`?stationCode=${stationCode}`,state:{deviceName}}}> 查看历史告警  </Link>
          </Button>
          <CommonPagination pageSize={pageSize} currentPage={currentPage} onPaginationChange={this.changePagination} total={deviceAlarmList.length} />
        </div>
        <Table
          dataSource={tableSource}
          onChange={this.ontableSort}
          columns={columns}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        // loading={loading}
        />
      </div>
    )
  }

}

export default DeviceAlarmTable;