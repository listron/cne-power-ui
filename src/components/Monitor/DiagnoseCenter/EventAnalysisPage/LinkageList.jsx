import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import CneTable from '@components/Common/Power/CneTable';
import CneTips from '@components/Common/Power/CneTips';
import IgnoreModal from '../EventListPage/IgnoreModal';
import styles from './eventAnalysis.scss';
import moment from 'moment';

class LinkageList extends Component {
  static propTypes = {
    linkageListData: PropTypes.array,
    linkageListLoading: PropTypes.bool,
    linkageListError: PropTypes.bool,
    isBackEvent: PropTypes.bool,
    linkedStatusChangeText: PropTypes.string,
    pageKey: PropTypes.string,
    linkagePage: PropTypes.string,
    diagWarningId: PropTypes.string,
    oldAnalysisEvent: PropTypes.object,
    eventAnalysisInfo: PropTypes.object,
    analysisEvent: PropTypes.object,
    editEventsStatus: PropTypes.func,
    getEventsAnalysis: PropTypes.func,
    changeStore: PropTypes.func,
    getLinkageList: PropTypes.func,
    interval: PropTypes.number,
  }

  constructor() {
    super();
    this.state = {
      tipType: 0, // 0无弹框; 1忽略; 2删除
      records: null, // 列表某行的数据
      eventTypeCode: '1', // 联动类型默认‘实时联动’
      showIcon: false, // 是否显示列表某些操作按钮
      needIgoreModal: false, // 诊断事件, 忽略操作时，需要弹出额外输入框进行信息输入；
    };
  }

  onBack = () => { // 显示原来的事件详情信息
    const { oldAnalysisEvent, interval, linkagePage } = this.props;
    this.props.changeStore({isMoreData: false, isBackEvent: false, pageKey: linkagePage});
    this.props.getEventsAnalysis({...oldAnalysisEvent, interval});
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
    const { pageKey } = this.props;
    const eventCode = record.eventCode;
    const eventType = {1: 'alarm', 2: 'diagnose', 3: 'data'};
    const linkageEventType = record.eventType;
    const interval = (pageKey === 'alarm' || eventCode === 'NB1035') ? 2 : 1; // 告警事件和诊断事件的零电流-数据时间间隔5s interval = 2, 其他默认十分钟数据interval = 1;
    this.props.changeStore({ isMoreData: true, isBackEvent: true, pageKey: eventType[linkageEventType] });
    this.props.getEventsAnalysis({ ...record, interval });
  }

  onSuspend = (record) => { // 忽略
    const showIgoreModal = ['NB1235', 'NB1236', 'NB1237', 'NB1238', 'NB1239'].includes(record.eventCode);
    if (showIgoreModal) {
      this.setState({
        records: [record],
        needIgoreModal: true,
      });
    } else {
      this.setState({ records: [record], tipType: 1 });
    }
  }

  onDel = (record) => { // 删除
    this.setState({ records: [record], tipType: 2 });
  }

  cancelTip = () => this.setState({ records: null, tipType: 0 }) // 取消弹框

  confirmTip = () => { // 确认弹框
    const { records, tipType } = this.state;
    const { diagWarningId, editEventsStatus } = this.props;
    const diagWarningIds = records.map(e => e.diagWarningId);
    editEventsStatus({ diagWarningIds, diagWarningId, type: tipType, isLinkage: true });
    this.setState({ records: null, tipType: 0 });
  }

  confirmStatusChange = () => {
    const { analysisEvent, changeStore, getLinkageList } = this.props;
    changeStore({ linkedStatusChangeText: '' });
    getLinkageList({diagWarningId: analysisEvent.diagWarningId}); // 基于当前请求, 刷新数据
  }

  createColumn = () => {
    return [
        {
          title: '事件类型',
          dataIndex: 'eventType',
          key: 'eventType',
          textAlign: 'left',
          width: '15%',
          render: (text) => {
            const eventType = ['告警事件', '诊断事件', '数据事件'];
            return (
            <div className={styles.eventTypeText} title={eventType[text - 1]}>{eventType[text - 1] || '--'}</div>);
          },
        },
        {
          title: '事件描述',
          dataIndex: 'pointValueDesc',
          key: 'pointValueDesc',
          textAlign: 'left',
          width: '21%',
          render: (text, record) => {
            const eventType = record.eventType;
            const pointValueDesc = eventType !== 1 ? record.eventName : record.pointValueDesc; // 告警事件:pointValueDesc，诊断事件和数据事件:eventName;
            return <div className={styles.pointValueDescText} title={pointValueDesc}>{pointValueDesc || '--'}</div>;
          },
        }, {
          title: '设备类型',
          dataIndex: 'deviceTypeName',
          key: 'deviceTypeName',
          textAlign: 'left',
          width: '15%',
          render: (text, record) => {
            return <div className={styles.deviceTypeNameText} title={text || '--'}>{text || '--'}</div>;
          },
        }, {
          title: '发生时间',
          dataIndex: 'beginTime',
          key: 'beginTime',
          textAlign: 'center',
          width: '15%',
          render: (text, record) => text ? moment(text).format('YYYY-MM-DD HH:mm') : '--',
        }, {
          title: '事件状态',
          dataIndex: 'statusName',
          key: 'statusName',
          textAlign: 'center',
          width: '15%',
          render: text => <div className={styles.statusNameText} >{text || '--'}</div>,
        }, {
          title: '操作',
          dataIndex: 'opreate',
          key: 'opreate',
          textAlign: 'center',
          width: '15%',
          render: (text, record) => {
            const { showIcon } = this.state;
            return(
              <div className={styles.opreateText}>
                  <i className={`iconfont icon-look ${styles.lookIcon}`} onClick={() => { this.onShow(record); }} title="查看" />
                  {!showIcon && <i className={`iconfont icon-suspend ${styles.suspendIcon} ${record.statusCode === 3 && styles.hideIcon}`} onClick={() => { this.onSuspend(record); }} title="忽略" />}
                  {!showIcon && <i className={`iconfont icon-del ${record.statusCode === 3 && styles.hideIcon}`} onClick={() => { this.onDel(record); }} title="删除" />}
              </div>
            );
          },
        },
      ];
  }

  onModalIgnore = (ignoreInfo) => { // 特别的诊断事件-指定组串(5种)-忽略操作
    this.props.editEventsStatus(ignoreInfo);
    this.setState({ records: null, needIgoreModal: false });
  }

  onModalCancel = () => this.setState({ records: null, needIgoreModal: false })


  render() {
    const { eventTypeCode, tipType, records, needIgoreModal } = this.state;
    const { linkageListData = [], linkageListLoading, linkageListError, linkedStatusChangeText, eventAnalysisInfo, isBackEvent } = this.props;
    const realTimeData = [], historyData = [], overhaulData = [];
    linkageListData.forEach(e => {
      e.relevantType === 1 && realTimeData.push(e); // 实时联动列表数据
      e.relevantType === 2 && historyData.push(e); // 历史联动列表数据
      e.relevantType === 3 && overhaulData.push(e); // 检修联动列表数据
    });
    const linkagedata = { 1: realTimeData, 2: historyData, 3: overhaulData };
    const dataSource = linkagedata[Number(eventTypeCode)];
    const linkageTableData = dataSource.length > 0 && dataSource[0].list ? dataSource[0].list : []; // 列表数据
    const count = dataSource.length > 0 && dataSource[0].total ? dataSource[0].total : 0; // 列表数据总数
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
            <span className={styles.count}>合计: {count || '--'}</span>
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
          locale={{ emptyText: <img width="178" height="134" src="/img/nodata.png" alt="" /> }}
        />
        {tipType !== 0 && <CneTips
          visible
          confirmText="确认"
          onCancel={this.cancelTip}
          onConfirm={this.confirmTip}
          confirmText={'确认'}
          tipText={['确认忽略该事件?', '确认删除该事件?'][tipType - 1]}
          width={260}
        />}
        {linkedStatusChangeText && <CneTips
          visible
          confirmText="确认"
          mode="warning"
          onConfirm={this.confirmStatusChange}
          tipText={linkedStatusChangeText}
          width={260}
        />}
        {needIgoreModal && <IgnoreModal
          records={records}
          onModalIgnore={this.onModalIgnore}
          onModalCancel={this.onModalCancel}
        />}
      </div>
    );
  }
}

export default LinkageList;

