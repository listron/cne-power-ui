import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select, Tooltip } from 'antd';
import styles from './defectEvent.scss';
import CneTips from '@components/Common/Power/CneTips';
import PicUploader from '../../Common/PicUploader';
import path from '../../../../../constants/path';
const { TextArea } = Input;
const { Option } = Select;



export default class DefectEvenrEdit extends Component {
  static propTypes = {
    deviceTypes: PropTypes.array,
    record: PropTypes.object,
    deviceModes: PropTypes.array,
    stationCode: PropTypes.number,
    record: PropTypes.object,
    onChange: PropTypes.func,
    isVertify: PropTypes.bool,
  }

  constructor() {
    super();
    this.state = {
      visible: false,
    };
  }



  changeDefectType = (value) => { // 修改缺陷类型
    const { record, onChange } = this.props;
    onChange({ index: record.index, defectTypeCode: value });
  }

  changeDeviceType = (value) => { // 修改设备类型
    const { record, onChange, stationCode } = this.props;
    const [deviceTypeCode, deviceTypeName] = value.split('_');
    onChange({ index: record.index, deviceTypeCode, deviceTypeName });
    this.props.getStationTypeDeviceModes({ stationCode, deviceTypeCode });
  }

  changeDeviceName = (value) => { // 改变设备型号
    const { record, onChange } = this.props;
    const [deviceFullcode, deviceName] = value.split('_');
    onChange({ index: record.index, deviceFullcode, deviceName });
  }

  changeDefectLevel = (value) => { // 修改缺陷级别
    const { record, onChange } = this.props;
    onChange({ index: record.index, defectLevel: value });
  }


  onDescChange = ({ target }) => {
    const { record, onChange } = this.props;
    onChange({ index: record.index, eventDesc: target.value || '' });
  }

  onConfirm = () => { // 确认删除
    const { record, delChange } = this.props;
    delChange(record);
  }


  onPicChange = (value) => { // 图片旋转
    const { record, onChange } = this.props;
    const eventImgs = value.map(e => {
      return {
        url: e,
        imgId: '',
        updateSign: 1,
      };
    });
    onChange({ index: record.index, eventImgs });
  }

  errorTip = (value) => { //错误提示
    const { isVertify, record = {} } = this.props;
    if (isVertify && !record[value]) {
      return 'error';
    }
  }

  initTip = (value) => { // 默认提示
    const { record = {} } = this.props;
    if (!record[value] && record[value] !== 0) {
      return 'init';
    }
  }


  render() {
    const { deviceTypes = [], record = {}, stationCode, deviceModes = [], isVertify, del } = this.props;
    const {
      eventDesc, defectTypeCode, deviceTypeCode, deviceTypeName, deviceName, deviceFullcode, defectLevel, eventImgs = [],
    } = record;
    const { visible } = this.state;
    const downloadTemplet = `${path.basePaths.APIBasePath}${path.pubilcPath.imgUploads}`;
    return (
      <div className={styles.infoEditBox}>
        <div className={styles.status}>
          {del && <i className={`iconfont icon-wrong ${styles.close}`} onClick={() => this.setState({ visible: true })} />}
        </div>
        <div className={styles.editDevice}>
          <div className={styles.defectType}>
            <div className={styles.recordName}>缺陷类型 <span className={styles.star}>*</span></div>
            <Select
              value={defectTypeCode}
              placeholder={'请选择'}
              onChange={this.changeDefectType}
              required={isVertify}
              className={`${styles[this.errorTip('defectTypeCode')]} ${styles[this.initTip('defectTypeCode')]}`}
            >
              <Option value={1} >设备缺陷</Option>
              <Option value={0} >其他缺陷</Option>
            </Select>
          </div>
          {defectTypeCode !== 0 &&
            <React.Fragment>
              <div className={styles.deviceType} >
                <div className={styles.recordName}>设备类型 <span className={styles.star}>*</span></div>
                <Select
                  placeholder={'请选择'}
                  value={deviceTypeCode && `${deviceTypeCode}_${deviceTypeName}` || ''}
                  onChange={this.changeDeviceType}
                  disabled={deviceTypes.length === 0}
                  required={isVertify}
                  className={`${styles[this.errorTip('deviceTypeCode')]} ${deviceTypes.length !== 0 && styles[this.initTip('deviceTypeCode')]}`}
                >
                  {deviceTypes.map(e => (
                    <Option
                      key={`${e.deviceTypeCode}_${e.deviceTypeName}`}
                      value={`${e.deviceTypeCode}_${e.deviceTypeName}`}
                      title={e.deviceTypeName}
                    >
                      {e.deviceTypeName}
                    </Option>))}
                </Select>
              </div>
              <div className={styles.deviceName}>
                <div className={styles.recordName}>设备名称 <span className={styles.star}>*</span></div>
                <Select
                  placeholder={'请选择'}
                  onChange={this.changeDeviceName}
                  disabled={!deviceTypeCode}
                  required={isVertify}
                  value={deviceFullcode && `${deviceFullcode}_${deviceName}` || ''}
                  className={`${styles[this.errorTip('deviceFullcode')]} ${deviceTypeCode && styles[this.initTip('deviceFullcode')]}`}
                >
                  {deviceModes.map(e =>
                    (<Option
                      value={`${e.deviceFullcode}_${e.deviceName}`}
                      key={`${e.deviceFullcode}_${e.deviceName}`}
                      title={e.deviceName}
                    >{e.deviceName}
                    </Option>))}
                </Select>
              </div>
              <div className={styles.defectLevel} onChange={this.changeDefectLevel}>
                <div className={styles.recordName}>缺陷级别 <span className={styles.star}>*</span> </div>
                <Select placeholder={'请选择'} onChange={this.changeDefectLevel} value={defectLevel} required={isVertify}>
                  <Option value={1} key={'1'}>一级</Option>
                  <Option value={2} key={'2'}>二级</Option>
                  <Option value={3} key={'3'}>三级</Option>
                  <Option value={4} key={'4'}>四级</Option>
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
          <TextArea onChange={this.onDescChange} value={eventDesc} placeholder={'请填写缺陷描述，必填！'} required={isVertify} />
        </div>
        <div className={styles.editPic}>
          <span className={styles.editTitle}>
            <span className={styles.recordName}>添加照片</span>
            <span className={styles.titleTip}>最多4张</span>
          </span>
          <span>{
            <PicUploader
              value={eventImgs && eventImgs.map(e => e.url) || []}
              mode="edit"
              maxPicNum={4}
              onChange={this.onPicChange}
              uploadUrl={downloadTemplet}
            />
          }</span>
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
