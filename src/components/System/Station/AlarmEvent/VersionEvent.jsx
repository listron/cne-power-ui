import React, { Component } from 'react';
import styles from './alarmEvent.scss';
import PropTypes from 'prop-types';
import { Input, Select, Tree, Button, Checkbox, Spin } from 'antd';
import EventColumn from './EventColumn';
import SetPonitModal from './SetPonitModal';
import WarningTip from '../../../Common/WarningTip/index';

class VersionEvent extends Component {
  static propTypes = {
    versionList: PropTypes.array,
    versionStationCodes: PropTypes.array,
    pointList: PropTypes.array,
    getPointList: PropTypes.func,
    addVersionEvent: PropTypes.func,
    editVersionEvent: PropTypes.func,
    delVersionEvent: PropTypes.func,
    editPoint: PropTypes.object,
    pointListError: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      addEventList: [], // 新增的告警配置列表
      currentEventList: [], // 已有告警的数据列表

      showWarningTip: false,
      showWarningEvent: false,
      delEvent: null,
      selectKeysArr: [],
      allSelect: false,
      indeterminate: false,

    };
  }


  componentWillReceiveProps(nextProps) {
    const { stationCode, versionStationCodes, deviceTypeCode, deviceModeCode, diagModeVersionId, versionList, alarmEventDetial} = nextProps;
    const { currentEventList, addEventList } = this.state;
    const eventListLength = currentEventList.length;
    if (diagModeVersionId !== this.props.diagModeVersionId) { // 切换版本，置空数据
      this.setState({
        addEventList: [], // 添加的新的数据
        showWarningTip: false,
        showWarningEvent: false,
        delEvent: null,
        selectKeysArr: [],
        allSelect: false,
        indeterminate: false,
        currentEventList: [],
      });
    }

    //从告警中心跳转过来的页面需要特殊处理
    const {diagModeEventId} = alarmEventDetial;
    if (diagModeEventId && eventListLength >0 && typeof(this.firstInitAlarmEvent) === 'undefined') { 
      this.firstInitAlarmEvent = true; //标识是不是第一次处理
      this.setState({
        selectKeysArr: [diagModeEventId],
      });
    }

    const allEventList = [...currentEventList, ...addEventList];
    const initmodifyStatus = allEventList.length > 0 && allEventList.some(e => e.editable) || false;
    this.props.changeStore({ modifyStatus: initmodifyStatus }); // 修改状态
    if (this.props.stationCode !== stationCode) {
      const stationCode = versionStationCodes.length > 0 && versionStationCodes[0].stationCode;
      this.props.getPointList({ // 请求测点数据
        'stationCode': stationCode,
        'deviceTypeCode': deviceTypeCode, // 设备类型
        'deviceModeCode': deviceModeCode, // 厂家型号
        'pageNum': 1,
        'pageSize': 100,
        'orderField': 'device_point_type',
        'orderType': 1,
        'devicePointStandardCode': '',
        'devicePointName': '',
      });
      this.props.changeStore({ stationCode });
    }
    if (this.props.versionEventLoading && !nextProps.versionEventLoading) {
      const { currentEventList } = this.state;
      currentEventList.forEach(trData => { // 进行一个优化
        if (trData.editable) {
          const index = versionList.findIndex(e => e.diagModeEventId === trData.diagModeEventId);
          versionList[index] = trData;
        }
      });
      this.setState({ currentEventList: versionList });
    }

  }

  componentDidUpdate() {

    //用来处理告警中心的事件点击后，跳转的本页面时，定位记录行
    //本方案不是最佳方案，有待优化，
    if (this.firstInitAlarmEvent) {
      const ele = this.refs.eventtable;
      const {currentEventList} = this.state;
      const {alarmEventDetial} = this.props;
      const {diagModeEventId} = alarmEventDetial;
      var indexpos = 0;
      for (indexpos in currentEventList) {
        if (currentEventList[indexpos].diagModeEventId === diagModeEventId) {
          break;
        }
      }
      // console.log(indexpos);
      if (ele && indexpos > 0) {
        ele.scrollTop = indexpos*41; //如果这个行高发生变化，就会有问题。
      }

      this.firstInitAlarmEvent = false;
    }
  }

  closePointModal = (value) => { // 关闭测点编号的弹框
    this.props.changeStore({ setPonitModal: value });
  }

  addEvent = () => { // 添加行
    const { addEventList } = this.state;
    const keyIndex = addEventList.length > 0 && addEventList[addEventList.length - 1].key.split('add')[1] || 0; // 从默认开始添加
    addEventList.push({ key: `add${+keyIndex + 1}`, switchType: 1, enabled: 1, pointValue: 1, eventLevel: null });
    this.setState({ addEventList: addEventList });
    this.props.changeStore({ modifyStatus: true });
  }

  changeEditPoint = (value) => { // 需要编辑的测点
    this.props.changeStore({ editPoint: value, setPonitModal: true });
  }

  setPointData = (value) => { // 测点编号的添加
    const { editPoint } = this.props;
    const { addEventList, currentEventList } = this.state;
    const lastKey = addEventList.length > 0 && addEventList[addEventList.length - 1].key.split('add')[1] || 0;
    if (!editPoint.diagModeEventId) { // 新添加的
      const findIndex = addEventList.findIndex(e => e.key === editPoint.key); // 当前编辑进行修改
      addEventList[findIndex] = { ...addEventList[findIndex], pointCode: value[0].devicePointStandardCode, pointValueDesc: value[0].devicePointName };
      value.forEach((e, index) => { // 多条添加
        if (index > 0) {
          addEventList.push({
            key: `add${+lastKey + index}`,
            switchType: 1,
            enabled: 1,
            pointValue: 1,
            pointCode: e.devicePointStandardCode,
            pointValueDesc: e.devicePointName,
            eventCode: editPoint.eventCode,
          });
        }
      });
    }
    if (editPoint.diagModeEventId) { // 编辑
      const index = currentEventList.findIndex(e => e.diagModeEventId === editPoint.diagModeEventId);
      currentEventList[index] = { ...currentEventList[index], pointCode: value[0].devicePointStandardCode, pointValueDesc: value[0].devicePointName };
      this.setState({ currentEventList: currentEventList });
    }
  }

  saveEvent = (value) => { // 保存告警规则
    const { key, editable, checked, diagModeEventId, ...rest } = value;
    const { diagModeVersionId } = this.props;
    const { addEventList, currentEventList } = this.state;
    if (diagModeEventId) { // 编辑
      const index = currentEventList.findIndex(e => e.key === value.key);
      this.props.editVersionEvent({ diagModeEventId, diagModeVersionId, ...rest, func: () => { currentEventList[index].editable = false; this.setState({ currentEventList }); } });
    }
    if (!diagModeEventId) { // 添加
      const findIndex = addEventList.findIndex(e => e.key === value.key);
      this.props.addVersionEvent({ diagModeVersionId, ...rest, func: () => { addEventList.splice(findIndex, 1); this.setState({ addEventList }); } });
    }
  }

  deleteEvent = (value) => { // 删除告警规则
    const { diagModeEventId } = value;
    const { addEventList } = this.state;
    if (diagModeEventId) {
      this.setState({ showWarningTip: true, delEvent: [value.diagModeEventId] });
    } else { // 如果
      const findIndex = addEventList.findIndex(e => e.key === value.key);
      addEventList.splice(findIndex, 1);
      this.setState({ addEventList });
    }
  }

  cancelWarningTip = () => { // 关闭弹框
    this.setState({ showWarningTip: false });
  }

  confirmWarningTip = (value) => { //删除
    const { delEvent, addEventList, selectKeysArr } = this.state;
    const isAddKey = delEvent.filter(e => e.includes('add'));
    const isEventKey = delEvent.filter(e => !e.includes('add'));
    if (isEventKey.length > 0) {
      const eventSelectArr = selectKeysArr.filter(v => !selectKeysArr.includes(v) || !isEventKey.includes(v));
      this.props.delVersionEvent({
        diagModeEventIds: isEventKey,
        suceessfunc: () => { this.setState({ selectKeysArr: eventSelectArr }); },
        errorfunc: () => { this.setState({ showWarningEvent: true, selectKeysArr: eventSelectArr }); },
      });
    }
    if (isAddKey.length > 0) {
      isAddKey.forEach(value => {
        const findIndex = addEventList.findIndex(e => e.key === value);
        addEventList.splice(findIndex, 1);
      });
      const difference = selectKeysArr.filter(v => !selectKeysArr.includes(v) || !isAddKey.includes(v));
      this.setState({ addEventList, selectKeysArr: difference });
    }
    this.cancelWarningTip();
  }

  cancelWarnEvent = () => {
    this.setState({ showWarningEvent: false });
  }

  selectKeys = (value) => { // 多行删选
    let { selectKeysArr, addEventList, currentEventList } = this.state;
    const allLength = addEventList.length + currentEventList.length;
    const { name, checked } = value;
    if (checked) {
      selectKeysArr.push(name);
    } else {
      selectKeysArr = selectKeysArr.filter(e => e !== name);
    }
    const isSame = allLength === selectKeysArr.length;
    this.setState({
      selectKeysArr,
      indeterminate: (selectKeysArr.length > 0 && !isSame),
      allSelect: isSame,
    });
  }

  rowSelection = (e) => { // 全部
    const checked = e.target.checked;
    const { addEventList, currentEventList } = this.state;
    let selectKeysArr = [];
    if (checked) {
      const newEventList = addEventList.map(e => e.key);
      const eventList = currentEventList.map(e => e.diagModeEventId);
      selectKeysArr = [...newEventList, ...eventList];
    }
    if (!checked) {
      selectKeysArr = [];
    }
    this.setState({ allSelect: checked, selectKeysArr });
  }

  delSelectedRowKeys = () => { // 批量删除
    const { selectKeysArr } = this.state;
    this.setState({ showWarningTip: true, delEvent: selectKeysArr });
  }

  editEvent = (trData) => { // 编辑测点内容
    const { diagModeEventId } = trData;
    this.props.changeStore({ modifyStatus: true }); // 修改状态的判断
    const { addEventList, currentEventList } = this.state;
    if (diagModeEventId) {
      const index = currentEventList.findIndex(e => e.diagModeEventId === diagModeEventId);
      currentEventList[index] = trData;
      this.setState({ currentEventList: currentEventList });
    }
    if (!diagModeEventId) {
      const findIndex = addEventList.findIndex(e => e.key === trData.key);
      addEventList[findIndex] = trData;
      this.setState({ addEventList: addEventList });
    }
  }

  render() {
    const { versionList, versionStationCodes, stationCode, versionError } = this.props;
    const { pointList, getPointList, deviceTypeCode, deviceModeCode, setPonitModal, editPoint, versionEventLoading, alarmEventType } = this.props;
    const { addEventList, currentEventList, showWarningTip, showWarningEvent, selectKeysArr, allSelect, indeterminate } = this.state;
    const type = editPoint.key && editPoint.key.includes('add') && 'add' || 'edit';
    return (
      <div className={styles.versionEvent}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={'确定删除告警事件规则吗？'} />}
        {showWarningEvent && <WarningTip onOK={this.cancelWarnEvent} style={{ width: 210, height: 100 }} value={'告警事件规则存在实时告警，不可删除。'} />}
        <div className={styles.eventTop}>
          <div className={styles.eventButton} onClick={this.addEvent}> <div><i className="iconfont icon-newbuilt" /> <span> 添加行</span></div></div>
          <div className={`${styles.eventButton} ${selectKeysArr.length === 0 && styles.disabled}`} onClick={this.delSelectedRowKeys}> <div> <i className="iconfont icon-del" /> <span> 删除</span></div></div>
          <div className={styles.stations}>
            <i className="iconfont icon-powerstations" />
            <p> 应用电站:{versionStationCodes.map(e => e.stationName).join('、')}</p>
          </div>
          <div>合计：{versionList.length} 条</div>
        </div>
        <div className={styles.tableList}>
          <div className={`${styles.tableHeader}`}>
            <div className={styles.checkbox}><Checkbox onChange={this.rowSelection} checked={allSelect} indeterminate={indeterminate} /></div>
            <div className={styles.eventCode}> 标准告警事件</div>
            <div className={styles.eventName}> 测点编号</div>
            <div className={styles.pointValue}> 告警参数</div>
            <div className={styles.pointValueDesc}> 信号／事件描述</div>
            {/* <div className={styles.switchType}> 开关类</div> */}
            <div className={styles.eventLevel}> 告警级别</div>
            <div className={styles.enabled}> 是否启用</div>
            <div className={styles.operate}> 操作</div>
          </div>
          <div className={`${styles.tableCont}`} ref='eventtable' id='tableCont'>
            {addEventList.map((e, index) => {
              return { ...e, key: e.key, editable: true, checked: selectKeysArr.includes(e.key) };
            }).map(list => {
              return (<EventColumn
                eventData={list}
                key={list.key}
                alarmEventType={alarmEventType}
                changePoint={this.changeEditPoint}
                saveEvent={this.saveEvent}
                editEvent={this.editEvent}
                checkSelect={this.selectKeys}
                deleteEvent={this.deleteEvent} />);
            })}
            {currentEventList.map((e, index) => {
              return { ...e, key: e.diagModeEventId, editable: !!e.editable, checked: selectKeysArr.includes(e.diagModeEventId) };
            }).map(list => {
              return (<EventColumn
                eventData={list}
                key={list.key}
                alarmEventType={alarmEventType}
                changePoint={this.changeEditPoint}
                saveEvent={this.saveEvent}
                editEvent={this.editEvent}
                checkSelect={this.selectKeys}
                deleteEvent={this.deleteEvent} />);
            })}
            {/* 没有更多数据的设置 */}
            {(addEventList.length + currentEventList.length > 0) &&
              <div className={styles.img}><img width="97" height="72" src="/img/notabdata.png" /></div>
            }
            {/* 没有数据，或者是数据请求失败 */}
            {(addEventList.length === 0 && currentEventList.length === 0) &&
              <div className={styles.img}>
                {versionError && <img width="84" height="77" src="/img/datawrong.png" /> || <img width="223" height="164" src="/img/nodata.png" />}
              </div>
            }
          </div>
          {versionEventLoading && <div className={styles.spin} />}
          {versionEventLoading && <div className={styles.spinLoading}> <Spin /></div>}
        </div>
        {setPonitModal &&
          <SetPonitModal
            stationCodes={versionStationCodes}
            stationCode={stationCode}
            pointList={pointList}
            getPointList={getPointList}
            deviceTypeCode={deviceTypeCode}
            deviceModeCode={deviceModeCode}
            closePointModal={this.closePointModal}
            setPointData={this.setPointData}
            type={type}
            pointListError={this.props.pointListError}
          />
        }
      </div>
    );
  }

}


export default VersionEvent;
