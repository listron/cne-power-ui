import React, { Component } from 'react';
import { Input, Select, Tooltip } from 'antd';
import styles from './defectEvent.scss';
import CneTips from '@components/Common/Power/CneTips';
const { TextArea } = Input;
const { Option } = Select;



export default class DefectEvenrEdit extends Component {

  state = {
    eventDesc: '处理记录信息',
    defectTypeCode: null, // 缺陷类型
    deviceTypeCode: null, // 设备类型
    deviceFullcode: '234423', //设备全编码
    defectLevel: '1', // 缺陷级别
    partName: '哈哈哈不见',
    coordinateDesc: '协调信息1122找大力他可以搞定所有',
    handleImg: [], // 图片地址
  }

  cancelEdit = () => { // 取消处理信息添加
    console.log('取消处理信息添加');
  }

  changeDefectType = (value) => {
    console.log('e', value);
    this.setState({ defectTypeCode: value });
  }

  changeDeviceType = (value) => {
    console.log('e', value);
  }

  changeDeviceName = (value) => {
    console.log('e', value);
  }

  changeDefectLevel = (value) => {
    console.log('e', value);
  }


  render() {
    const {
      eventDesc, defectTypeCode, deviceTypeCode, deviceFullcode, defectLevel, handleImg,
    } = this.state;
    const { visible } = this.state;
    const deviceTypes = [{ deviceTypeCode: 201, deviceTypeName: '集中式逆变器' }, { deviceTypeCode: 206, deviceTypeName: '组串式逆变器' }];
    const deviceModes = [{ deviceFullcode: 123, deviceName: 123 }];
    return (
      <div className={styles.infoEditBox}>
        <div className={styles.status}>
          <i className={`iconfont icon-wrong ${styles.close}`} onClick={() => this.setState({ visible: true })} />
        </div>
        <div className={styles.editDevice}>
          <div className={styles.defectType}>
            <div className={styles.recordName}>缺陷类型 <span className={styles.star}>*</span></div>
            <Select value={defectTypeCode} placeholder={'请选择'} onChange={this.changeDefectType}>
              <Option value={1} >设备缺陷</Option>
              <Option value={0} >其他缺陷</Option>
            </Select>
          </div>
          {defectTypeCode !== 0 &&
            <React.Fragment>
              <div className={styles.deviceType} >
                <div className={styles.recordName}>设备类型 <span className={styles.star}>*</span></div>
                <Select placeholder={'请选择'} value={deviceTypeCode} onChange={this.changeDeviceType} >
                  {deviceTypes.map(e => <Option value={e.deviceTypeCode} key={e.deviceTypeCode}>{e.deviceTypeName}</Option>)}
                </Select>
              </div>
              <div className={styles.deviceName}>
                <div className={styles.recordName}>设备名称 <span className={styles.star}>*</span></div>
                <Select placeholder={'请选择'} onChange={this.changeDeviceName} disabled={!deviceTypeCode}>
                  {deviceModes.map(e => <Option value={e.deviceFullcode} key={e.deviceFullcode} title={e.deviceName}>{e.deviceName}</Option>)}
                </Select>
              </div>
              <div className={styles.defectLevel} onChange={this.changeDefectLevel}>
                <div className={styles.recordName}>缺陷级别 <span className={styles.star}>*</span> </div>
                <Select placeholder={'请选择'} >
                  <Option value="1">一级</Option>
                  <Option value="2">二级</Option>
                  <Option value="3">三级</Option>
                  <Option value="4">四级</Option>
                </Select>
                <Tooltip placement="top" title="缺陷级别的定义，需要产品那边提供文案">
                  <i className={`iconfont icon-help ${styles.iconHelp}`} />
                </Tooltip>
              </div>
            </React.Fragment>
          }

        </div>
        <div className={styles.editRecord}>
          <span className={styles.editTitle}>
            <span className={styles.recordName}>缺陷描述 <span className={styles.star}>*</span></span>
            <span className={styles.titleTip}>
              {eventDesc ? (`${eventDesc}`).length : 0}/999字
            </span>
          </span>
          <TextArea onChange={this.onDescChange} value={eventDesc} placeholder={'请填写缺陷描述，必填！'} />
        </div>
        <div className={styles.editPic}>
          <span className={styles.editTitle}>
            <span className={styles.recordName}>添加照片</span>
            <span className={styles.titleTip}>最多4张</span>
          </span>
          <span>{handleImg.join(',')}</span>
        </div>
        <CneTips
          tipText={'确认删除此事件'}
          theme={'light'}
          onConfirm={this.onConfirm}
          onCancel={() => this.setState({ visible: false })}
          confirmText={'确认'}
          visible={visible}
          width={260}
        />
      </div>
    );
  }
}
