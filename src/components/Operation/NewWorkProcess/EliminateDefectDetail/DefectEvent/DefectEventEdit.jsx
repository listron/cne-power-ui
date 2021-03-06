import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select, Tooltip } from 'antd';
import styles from './defectEvent.scss';
import CneTips from '@components/Common/Power/CneTips';
import PicUploader from '../../Common/PicUploader';
import DeviceDataCheck from '../../../../Common/DeviceDataCheck';
import path from '../../../../../constants/path';
const { TextArea } = Input;
const { Option } = Select;


/**
 * record 每一条的数据
 * deviceTypes 设备类型的数组
 * stationCode 电站名称
 * onChange 数据发生改变时
 * delChange 删除的时候
 * delRight 删除的权限
 * isVertify 验证的时候
 * defectLevelList 缺陷级别的数据
 */

export default class DefectEvenrEdit extends Component {
  static propTypes = {
    record: PropTypes.object,
    deviceTypes: PropTypes.array,
    stationCode: PropTypes.number,
    onChange: PropTypes.func,
    delRight: PropTypes.bool,
    delChange: PropTypes.func,
    isVertify: PropTypes.bool,
    defectLevelList: PropTypes.array,

  }

  constructor() {
    super();
    this.state = {
      visible: false,
    };
  }

  changeDefectType = (value) => { // 修改缺陷类型
    const { record, onChange } = this.props;
    if (value) {
      onChange({ index: record.index, defectTypeCode: value, defectLevel: record.defectLevel || 1 });
    }
    if (!value) { // 其他缺陷的时候置空
      onChange({
        index: record.index,
        defectTypeCode: value,
        deviceTypeCode: null,
        deviceTypeName: '',
        deviceFullcode: null,
        deviceName: '',
        defectLevel: null,
      });
    }
  }

  changeDeviceType = (value) => { // 修改设备类型
    const { record, onChange } = this.props;
    const [deviceTypeCode, deviceTypeName] = value.split('_');
    onChange({ index: record.index, deviceTypeCode, deviceTypeName, deviceFullcode: null, deviceName: '' });
  }

  selectedDevice = (value) => { // 修改设备类型
    if (value.length > 0) {
      const { deviceCode, deviceName } = value[0];
      const { record, onChange } = this.props;
      onChange({ index: record.index, deviceFullcode: deviceCode, deviceName });
    }
  }

  changeDefectLevel = (value) => { // 修改缺陷级别
    const { record, onChange } = this.props;
    onChange({ index: record.index, defectLevel: value });
  }

  onDescChange = ({ target }) => { // 修改缺陷描述
    const { record, onChange } = this.props;
    onChange({ index: record.index, eventDesc: target.value || '' });
  }

  onConfirm = () => { // 确认删除
    const { record, delChange } = this.props;
    delChange(record);
    this.setState({ visible: false });
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
    if (isVertify && !record[value] && record[value] !== 0) {
      return 'error';
    }
  }

  initTip = (value) => { // 默认提示
    const { record = {} } = this.props;
    if (!record[value] && record[value] !== 0) {
      return 'init';
    }
  }

  toolTip = () => {
    const { defectLevelList } = this.props;
    return (<div>
      {
        defectLevelList.map(e => {
          return <div key={e.defectLevel}>{e.defectDesc}</div>;
        })
      }
    </div>);
  }

  render() {
    const { deviceTypes = [], record = {}, stationCode, isVertify, delRight, defectLevelList } = this.props;
    const {
      eventDesc, defectTypeCode, deviceTypeCode, deviceTypeName, deviceName, deviceFullcode, defectLevel = 1, eventImgs = [],
    } = record;
    const { visible } = this.state;
    const downloadTemplet = `${path.basePaths.APIBasePath}${path.pubilcPath.imgUploads}`;
    return (
      <div className={styles.infoEditBox}>
        <div className={styles.status}>
          {delRight && <i className={`iconfont icon-wrong ${styles.close}`} onClick={() => this.setState({ visible: true })} />}
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
                <DeviceDataCheck
                  disabled={!deviceTypeCode}
                  stationCode={stationCode}
                  deviceTypeCode={deviceTypeCode}
                  value={deviceFullcode && [{ deviceCode: +deviceFullcode, deviceName }] || []}
                  className={`${styles[this.errorTip('deviceFullcode')]} ${deviceTypeCode && styles[this.initTip('deviceFullcode')]}`}
                  onChange={this.selectedDevice}
                  holderText={'请选择'}
                />
              </div>
              <div className={styles.defectLevel} onChange={this.changeDefectLevel}>
                <div className={styles.recordName}>缺陷级别 <span className={styles.star}>*</span> </div>
                <Select placeholder={'请选择'} onChange={this.changeDefectLevel} value={defectLevel} required={isVertify}>
                  {defectLevelList.map(e => <Option value={e.defectLevel} key={e.defectLevel}>{e.defectLevelName}</Option>)}
                </Select>
                <Tooltip placement="top" title={this.toolTip}>
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
          <TextArea onChange={this.onDescChange} value={eventDesc} placeholder={'请填写缺陷描述，必填！'} required={isVertify} maxLength="999" />
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
