import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './inspectRecord.scss';

class FilteredItemValue extends Component {
  static propTypes = {
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    userId: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    inspectStatus: PropTypes.any,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }
  onCancelStartTime = () => {//取消开始时间
    const { onChangeFilter } = this.props;
    onChangeFilter({
      startDate: '',
    });
  }
  onCancelEndTime = () => { //取消结束时间
    const { onChangeFilter } = this.props;
    onChangeFilter({
      endDate: '',
    })
  }
  onCancelInspectStatus = () => {//取消巡检状态
    const { onChangeFilter } = this.props;
    onChangeFilter({
      inspectStatus: null,
    })
  }
  onCancelUserId = (cancelCode) => {//删除某巡检人
    const { userId, onChangeFilter } = this.props;
    const newInspectUserId = userId.split(',').filter(e => e !== cancelCode);
    onChangeFilter({
      userId: newInspectUserId.join(',')
    });
  }
  onCancelDeviceType = (cancelCode) => {//删除某设备
    const { deviceTypeCode, onChangeFilter } = this.props;
    const newInspectDevice = deviceTypeCode.split(',').filter(e => e !== cancelCode);
    onChangeFilter({
      deviceTypeCode: newInspectDevice.join(',')
    });
  }

  resetAll = () => {//删除所有筛选条件
    const { onChangeFilter } = this.props;
    onChangeFilter({
      startDate: '',
      endDate: '',
      userId: '',
      deviceTypeCode: '',
      inspectStatus: null,
    });
  }

  render() {
    //inspectDeviceType是从巡检工单里传过来的设备类型，其中包括设备名以及设备code
    //inspectPersonList是用户名以及用户id
    const { startDate, endDate, userId, inspectStatus, inspectUsers, deviceTypeCode, deviceTypeItems } = this.props;
    const inspectUserArray = userId.split(',');
    const selectedInspectPerson = inspectUsers.filter(e => inspectUserArray.some(m => m === `${e.id}`));
    const inspectDevice = deviceTypeCode.split(',');
    // console.log(inspectDevice);
    const selectedInspectDevice = deviceTypeItems&&deviceTypeItems.filter(e => inspectDevice.some(m => m === `${e.deviceTypeCode}`));
    // console.log(selectedInspectDevice);
    const style = {
      background: '#fff',
      borderStyle: 'dashed',
      padding: '0 10px',
      height: '30px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      marginRight: '16px',
    }
    return (
      <div className={styles.filteredItems}>
        <span>已选条件</span>
        {startDate !== '' && <Tag style={style} closable onClose={this.onCancelStartTime}>开始 {startDate}</Tag>}
        {endDate !== '' && <Tag style={style} closable onClose={this.onCancelEndTime}>结束 {endDate}</Tag>}
        {selectedInspectPerson.length > 0 && selectedInspectPerson.map((e, i) => (
          <Tag style={style} closable onClose={() => this.onCancelUserId(e.id)} key={i}>
            {e && e.name}
          </Tag>
        ))}
        {inspectStatus && <Tag style={style} closable onClose={this.onCancelInspectStatus}>
          {inspectStatus === '1' ? '有异常' : '无异常'}
        </Tag>}
        {selectedInspectDevice && selectedInspectDevice.map((e, i) => (
          <Tag style={style} closable onClose={() => this.onCancelDeviceType(e.deviceTypeCode)} key={i}>
            {e && e.deviceTypeName}
          </Tag>
        ))}
        <Tag closable onClose={this.resetAll}>清空条件</Tag>
      </div>
    );
  }

}

export default FilteredItemValue;