import React, { Component } from 'react';
import styles from './alarmEvent.scss';
import PropTypes from 'prop-types';
import { Input, Select, InputNumber, Checkbox, message } from 'antd';
const Option = Select.Option;


class EventColumn extends Component {
  static propTypes = {
    changePoint: PropTypes.func,
    saveEvent: PropTypes.func,
    deleteEvent: PropTypes.func,
    eventData: PropTypes.object,
    alarmEventType: PropTypes.array,
    editEvent: PropTypes.func,
    checkSelect: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  saveEvent = () => { // 保存告警事件
    const { eventData } = this.props;
    const { pointCode, eventCode } = eventData;
    if (!pointCode || !eventCode) {
      message.warn(!eventCode && '请输入当前告警规则的标准告警事件' || '请输入当前告警规则的测点编号');
    } else {
      this.props.saveEvent(eventData);
    }

  }

  delEvent = (value) => { // 删除告警事件
    this.props.deleteEvent(value);
  }


  setPoint = () => { // 设置测点编号
    const { eventData } = this.props;
    this.props.changePoint(eventData);
  }


  onChangeColumn = (type, value) => { // 改变每列值
    const { eventData } = this.props;
    eventData[type] = value;
    this.props.editEvent(eventData);
  }

  onChange = (e, key) => {
    const { eventData } = this.props;
    this.props.checkSelect({ name: eventData.key, checked: e.target.checked });
  }



  render() {
    const { alarmEventType = [], eventData } = this.props;
    const { editable, key } = eventData;
    return (
      <div className={styles.EventColumn}>
        {editable &&
          <React.Fragment>
            <div className={styles.checkbox}> <Checkbox onChange={this.onChange} checked={eventData.checked} /></div>
            <span ref="select" />
            <div className={styles.eventCode}>
              <Select
                placeholder="请选择"
                value={eventData.eventCode}
                getPopupContainer={() => this.refs.select}
                onChange={(value) => { this.onChangeColumn('eventCode', value); }}>
                {alarmEventType.map(e => (
                  <Option key={e.eventCode} value={e.eventCode}>{e.eventName}</Option>
                ))}
              </Select>
            </div>
            <div className={styles.eventName}>
              <Input value={eventData.pointCode} onChange={(e) => { this.onChangeColumn('pointCode', e.target.value); }} />
              <i className={'iconfont icon-newbuilt'} onClick={this.setPoint} />
            </div>
            <div className={styles.pointValue}>
              <InputNumber value={eventData.pointValue || 1} onChange={(value) => { this.onChangeColumn('pointValue', value); }} />
            </div>
            <div className={styles.pointValueDesc}>
              <Input value={eventData.pointValueDesc} onChange={(e) => { this.onChangeColumn('pointValueDesc', e.target.value); }} />
            </div>
            <div className={styles.switchType}>
              <Select
                placeholder="请选择"
                value={eventData.switchType}
                onChange={(value) => { this.onChangeColumn('switchType', value); }}>
                <Option value={1}>是</Option>
                <Option value={0}>否</Option>
              </Select>
            </div>
            <div className={styles.enabled}>
              <Select
                placeholder="请选择"
                value={eventData.enabled}
                onChange={(value) => { this.onChangeColumn('enabled', value); }}>
                <Option value={1}>是</Option>
                <Option value={0}>否</Option>
              </Select>
            </div>
            <div className={styles.operate}>
              <i className={`iconfont icon-save ${styles.save}`} onClick={() => { this.saveEvent(eventData); }} />
              <i className={`iconfont icon-del ${styles.del}`} onClick={() => { this.delEvent(eventData); }} />
            </div>
          </React.Fragment> || null
        }
        {!editable &&
          <React.Fragment>
            <div className={styles.checkbox}>  <Checkbox onChange={this.onChange} checked={eventData.checked} /> </div>
            <div className={styles.eventCode}>  {eventData.eventName}</div>
            <div className={styles.eventName}>  {eventData.pointCode}</div>
            <div className={styles.pointValue}>  {eventData.pointValue}</div>
            <div className={styles.pointValueDesc}>  {eventData.pointValueDesc}</div>
            <div className={styles.switchType}>  {['否', '是'][eventData.switchType]}</div>
            <div className={styles.enabled}>  {['否', '是'][eventData.enabled]}</div>
            <div className={styles.operate}>
              <i className={`iconfont icon-edit ${styles.edit}`} onClick={() => { this.onChangeColumn('editable', true); }} />
              <i className={`iconfont icon-del ${styles.del}`} onClick={() => { this.delEvent(eventData); }} />
            </div>
          </React.Fragment> || null
        }
      </div>
    );
  }
}


export default EventColumn;
