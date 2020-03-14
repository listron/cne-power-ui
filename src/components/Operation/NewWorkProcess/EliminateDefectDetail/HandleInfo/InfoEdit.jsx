import React, { Component } from 'react';
import { Input, Switch } from 'antd';
import CneButton from '@components/Common/Power/CneButton';
import styles from './handle.scss';
const { TextArea } = Input;
import CneTips from '@components/Common/Power/CneTips';
import PropTypes from 'prop-types';

export default class InfoEdit extends Component {
  static propTypes = {
    record: PropTypes.object,
    onChange: PropTypes.func,
    saveChange: PropTypes.func,
    delChange: PropTypes.func,
    key: PropTypes.number,
  };

  constructor() {
    super();
    this.state = {
      handleVertify: false,
      visible: false, // 提示框显示
      tipText: '保存后将无法修改，确认保存此记录？',
      tipStatus: 'save',
    };
  }

  cancelEdit = () => { // 取消处理信息添加
    this.setState({
      tipText: '确定删除该事件？',
      tipStatus: 'del',
      visible: true,
    });

  }

  onDescChange = ({ target }) => {
    const { record, onChange } = this.props;
    onChange({ index: record.index, handleDesc: target.value || '' });
  }

  onPartsChange = (isChangePart) => {
    const { record, onChange } = this.props;
    onChange({ index: record.index, isChangePart: +isChangePart });
  }

  onPartsInfoChange = ({ target = {} }) => {
    const { record, onChange } = this.props;
    onChange({ index: record.index, partName: target.value });
  }

  onCoordinateChange = (isCoordinate) => {
    const { record, onChange } = this.props;
    onChange({ index: record.index, isCoordinate: +isCoordinate });
  }

  onCoordinateInfoChange = ({ target = {} }) => {
    const { record, onChange } = this.props;
    onChange({ index: record.index, coordinateDesc: target.value });
  }

  handleCheck = () => { // 校验
    const { record = {} } = this.props;
    const { handleDesc, isChangePart, partName, isCoordinate, coordinateDesc } = record;
    if (!handleDesc || (isChangePart && !partName) || (isCoordinate && !coordinateDesc)) {
      return false;
    }
    return true;
  }

  onEditInfoSave = () => { // 保存需要校验 校验成功之后，可以实现，否则只是提示，不传递
    this.setState({ handleVertify: true });
    const result = this.handleCheck();
    if (result) {
      this.setState({
        visible: true,
        tipText: '保存后将无法修改，确认保存此记录？',
        tipStatus: 'save',
      });
    }
  }

  onConfirm = () => { // 确认保存 保存／删除
    const { tipStatus } = this.state;
    const { record, saveChange, delChange } = this.props;
    if (tipStatus === 'save') {
      saveChange(record);
    }
    if (tipStatus === 'del') {
      delChange(record);
    }
    this.setState({ visible: false });
  }

  render() {
    const { isFinish = 0, record = {} } = this.props;
    const {
      handleDesc, isChangePart, isCoordinate, partName, coordinateDesc, handleImg, handleVideo,
    } = record;
    const { handleVertify, visible, tipText } = this.state;
    const isVertify = false;
    const inputRequire = (isVertify || handleVertify) && { required: true } || { pattern: '/^\s*$/g' };
    return (
      <div className={styles.infoEditBox}>
        <div className={styles.editRecord}>
          <span className={styles.editTitle}>
            <span className={styles.editTitleName}>处理记录 <span className={styles.star}>*</span></span>
            <span className={styles.titleTip}>
              {handleDesc ? (`${handleDesc}`).length : 0}/999字
            </span>
          </span>
          <TextArea onChange={this.onDescChange} value={handleDesc} placeholder={'请填写处理记录，必填'} required={isVertify || handleVertify} />
          {isFinish !== 1 && <i
            className={`iconfont icon-wrong ${styles.cancelEdit}`}
            onClick={this.cancelEdit}
          />}
        </div>
        <div className={styles.editPic}>
          <span className={styles.editTitle}>
            <span className={styles.editTitleName}>添加照片</span>
            <span className={styles.titleTip}>最多4张</span>
          </span>
          <span>{handleImg.join(',')}</span>
        </div>
        <div className={styles.editVideo}>
          <span className={styles.editTitle}>
            <span className={styles.editTitleName}>添加视频</span>
            <span className={styles.titleTip}>不超过15s</span>
          </span>
          <span>{handleVideo.join(',')}</span>
        </div>
        <div className={styles.editParts}>
          <span className={styles.editTitle}>更换备件 {!!isChangePart && <span className={styles.star}>*</span>}</span>
          <span className={styles.partsInput}>
            <Switch checked={!!isChangePart} onChange={this.onPartsChange} />
            {!!isChangePart && <Input value={partName} onChange={this.onPartsInfoChange} {...inputRequire} placeholder="请输入备件名称+备件型号" />}
          </span>
        </div>
        <div className={styles.editCoordinate}>
          <span className={styles.editTitle}>
            <span className={styles.editTitleName}>
              <span className={styles.coorName}>协调</span>
              {!!isCoordinate && <span className={styles.star}>*</span>}</span>
            {!!isCoordinate && <span className={styles.titleTip}>
              {coordinateDesc ? (`${coordinateDesc}`).length : 0}/999字
            </span>}

          </span>
          <span className={styles.coordinateInput}>
            <Switch checked={!!isCoordinate} onChange={this.onCoordinateChange} />
            {!!isCoordinate && <TextArea value={coordinateDesc} onChange={this.onCoordinateInfoChange} placeholder="请输入协调内容" required={isVertify || handleVertify} />}
          </span>
        </div>
        <div className={styles.saveEditRow}>
          {isFinish !== 0 || isFinish !== 1 &&
            <CneButton className={styles.saveEditButton} onClick={this.onEditInfoSave}>
              <i className={'iconfont icon-save'} />
              保存
          </CneButton>
          }
        </div>
        <CneTips
          tipText={tipText}
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
