import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import CneTable from '@components/Common/Power/CneTable';
import CneTips from '@components/Common/Power/CneTips';
import styles from './eventAnalysis.scss';
import moment from 'moment';

class LinkageList extends Component {
  static propTypes = {
    linkageListData: PropTypes.array,
    linkageListLoading: PropTypes.bool,
    linkageListError: PropTypes.bool,
    statusChangeText: PropTypes.string,
    pageKey: PropTypes.string,
    editEventsStatus: PropTypes.func,
    oldAnalysisEvent: PropTypes.object,
    eventAnalysisInfo: PropTypes.object,
    getEventsAnalysis: PropTypes.func,
    changeStore: PropTypes.func,
    interval: PropTypes.number,
  }

  constructor() {
    super();
    this.state = {
      tipType: 0, // 0无弹框; 1忽略; 2删除
      records: null, // 列表某行的数据
      eventTypeCode: '1', // 联动类型默认‘实时联动’
      showIcon: false, // 是否显示列表某些操作按钮
      isBackEvent: false, // 显示原来的事件详情信息
    };
  }

  onBack =() => { // 显示原来的事件详情信息
    const { oldAnalysisEvent, interval, changeStore, getEventsAnalysis } = this.props;
    this.setState({isBackEvent: false});
    changeStore({isMoreData: false});
    getEventsAnalysis({...oldAnalysisEvent, interval});
  }

  linkageCheck = (e) => { // 切换联动类型
    const linkageType = e.target.value;
    this.setState({ eventTypeCode: linkageType });
    if (linkageType === '1') {
      this.setState({ showIcon: false });
    } else if (linkageType === '2'){
      this.setState({ showIcon: true });
    }
  }

  onShow = (record) => { // 查看
    const { pageKey, changeStore, getEventsAnalysis } = this.props;
    const eventCode = record.eventCode;
    const interval = (pageKey === 'alarm' || eventCode === 'NB1035') ? 2 : 1; // 告警事件和诊断事件的零电流-数据时间间隔5s interval = 2, 其他默认十分钟数据interval = 1;
    this.setState({ isBackEvent: true });
    changeStore({ isMoreData: true });
    // getEventsAnalysis({ ...record, interval });
  }

  onSuspend = (record) => { // 忽略
    this.setState({ records: [record], tipType: 1 });
  }

  onDel = (record) => { // 删除
    this.setState({ records: [record], tipType: 2 });
  }

  cancelTip = () => this.setState({ records: null, tipType: 0 }) // 取消弹框

  confirmTip = () => { // 确认弹框
    const { records, tipType } = this.state;
    const diagWarningIds = records.map(e => e.diagWarningId);
    this.props.editEventsStatus({ diagWarningIds, type: tipType });
    this.setState({ records: null, tipType: 0 });
  }

  createColumn = () => {
    return [
        {
          title: '事件类型',
          dataIndex: 'eventType',
          key: 'eventType',
          textAlign: 'left',
          className: styles.eventType,
          render: (text) => {
            const eventType = ['告警事件', '诊断事件', '数据事件'];
            return (
            <div className={styles.eventTypeText} title={eventType[text]}>{eventType[text] || '--'}</div>);
          },
        },
        {
          title: '事件描述',
          dataIndex: 'pointValueDesc',
          key: 'pointValueDesc',
          textAlign: 'left',
          className: styles.pointValueDesc,
          render: (text, record) => {
              return <div className={styles.pointValueDescText} title={text}>{text || '--'}</div>;
          },
        }, {
          title: '设备类型',
          dataIndex: 'deviceTypeName',
          key: 'deviceTypeName',
          textAlign: 'left',
          className: styles.deviceTypeName,
          render: (text, record) => {
              return <div className={styles.deviceTypeNameText} title={text}>{text || '--'}</div>;
          },
        }, {
          title: '发生时间',
          dataIndex: 'beginTime',
          key: 'beginTime',
          textAlign: 'center',
          className: styles.beginTime,
          render: (text, record) => {
              return <div className={styles.beginTimeText} title={text}>{text || '--'}</div>;
          },
        }, {
          title: '事件状态',
          dataIndex: 'statusName',
          key: 'statusName',
          textAlign: 'center',
          className: styles.statusName,
          render: text => <div className={styles.statusNameText} >{text || '--'}</div>,
        }, {
          title: '操作',
          dataIndex: 'opreate',
          key: 'opreate',
          textAlign: 'center',
          className: styles.opreate,
          render: (text, record) => {
            const { showIcon } = this.state;
            return(
              <div className={styles.opreateText}>
                  <i className={`iconfont icon-look ${styles.showIcon}`} onClick={() => { this.onShow(record); }} />
                  {!showIcon && <i className={`iconfont icon-suspend ${styles.suspendIcon}`} onClick={() => { this.onSuspend(record); }} />}
                  {!showIcon && <i className="iconfont icon-del" onClick={() => { this.onDel(record); }} />}
              </div>
            );
          },
        },
      ];
  }

  render() {
    const { eventTypeCode, tipType, isBackEvent } = this.state;
    const { linkageListData = [], linkageListLoading, linkageListError, statusChangeText, eventAnalysisInfo } = this.props;
    const realTimeData = [], historyData = [], overhaulData = [];
    linkageListData.forEach(e => {
      e.relevantType === 1 && realTimeData.push(e); // 实时联动列表数据
      e.relevantType === 2 && historyData.push(e); // 历史联动列表数据
      e.relevantType === 3 && overhaulData.push(e); // 检修联动列表数据
    });
    const linkagedata = { 1: realTimeData, 2: historyData, 3: overhaulData };
    const dataSource = linkagedata[Number(eventTypeCode)];
    const linkageTableData = dataSource.length > 0 && dataSource[0].list; // 列表数据
    const total = dataSource.length > 0 && dataSource[0].count; // 列表数据总数
    const clientWidth = document.body.clientWidth;
    return (
      <div className={styles.linkageContent}>
        <div className={styles.linkageTop}>
          <div className={styles.titleLeft}>
            <div className={styles.titleText}>联动决策</div>
            <Radio.Group value={eventTypeCode} onChange={this.linkageCheck} buttonStyle="solid">
              <Radio.Button value="1">实时联动</Radio.Button>
              <Radio.Button value="2">历史联动</Radio.Button>
              <Radio.Button value="3">检修联动</Radio.Button>
            </Radio.Group>
          </div>
          <div className={styles.titleRight}>
            {isBackEvent && <div className={styles.backBtn} onClick={this.onBack}><i className={'iconfont icon-fhdq'} />返回当前分析</div>}
            <span className={styles.count}>合计: {total || '--'}</span>
          </div>
        </div>
        <CneTable
          columns={this.createColumn()}
          dataSource={linkageTableData}
          loading={linkageListLoading}
          className={styles.diagnoseTable}
          scroll={JSON.stringify(eventAnalysisInfo) === '{}' ? { y: 675 } : { y: 165 }}
          dataError={linkageListError}
          noMoreDataPic={linkageListError && linkageTableData.length > 0}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" alt="" /> }}
        />
        {tipType !== 0 && <CneTips
          visible
          onCancel={this.cancelTip}
          onConfirm={this.confirmTip}
          tipText={['确认忽略该事件?', '确认删除该事件?'][tipType - 1]}
          width={260}
        />}
        {statusChangeText && <CneTips
          visible
          onConfirm={this.confirmStatusChange}
          tipText={statusChangeText}
          width={260}
        />}
      </div>
    );
  }
}

export default LinkageList;
