import React, { Component } from 'react';
import { Input, Switch } from 'antd';
import CneButton from '@components/Common/Power/CneButton';
import styles from './handle.scss';
const { TextArea } = Input;
import CneTips from '@components/Common/Power/CneTips';
import PropTypes from 'prop-types';
import PicUploader from '../../Common/PicUploader';
import VideoUploader from '../../Common/VideoUploader';
import path from '../../../../../constants/path';



/** 
 * record 每一条的信息
 * onChange 状态改变的函数
 * saveChange 保存的函数
 * singleSave 单独保存
 * delChange 删除的函数 两种删除方式，一种是直接删除，一种是删除本地的
 * isVertify 验证的时候
 * closeIconisShow 删除的按钮 是否存在 
*/
export default class InfoEdit extends Component {
  static propTypes = {
    record: PropTypes.object,
    onChange: PropTypes.func,
    saveChange: PropTypes.func,
    delChange: PropTypes.func,
    isVertify: PropTypes.bool,
    singleSave: PropTypes.bool, // 单独保存 只有执行的过程中有
    closeIconisShow: PropTypes.bool, // 关闭按钮是否显示
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

  onPicChange = (value) => { // 图片上传
    const { record, onChange } = this.props;
    const handleImgs = value.map(e => {
      return {
        url: e,
        imgId: '',
        updateSign: 1,
      };
    });
    onChange({ index: record.index, handleImgs });
  }

  onVideoChange = (value) => { // 视频编辑
    const { record, onChange } = this.props;
    onChange({ index: record.index, handleVideos: value });
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

  exchangeActioncode = (allActions, code) => {
    const cur = allActions.filter(e => e.actionCode === code);
    return cur.length > 0 && !cur[0].isPermission || false;
  }

  render() {
    const { closeIconisShow, record = {}, isVertify, singleSave } = this.props;
    const {
      handleDesc, isChangePart, isCoordinate, partName, coordinateDesc, handleImgs = [], handleVideos,
    } = record;
    const { handleVertify, visible, tipText } = this.state;
    const inputRequire = (isVertify || handleVertify) && { required: true } || { pattern: '/^\s*$/g' };
    const downloadTemplet = `${path.basePaths.APIBasePath}${path.pubilcPath.imgUploads}`;
    return (
      <div className={styles.infoEditBox}>
        <div className={styles.editRecord}>
          <span className={styles.editTitle}>
            <span className={styles.editTitleName}>处理记录 <span className={styles.star}>*</span></span>
            <span className={styles.titleTip}>
              {handleDesc ? (`${handleDesc}`).length : 0}/999字
            </span>
          </span>
          <TextArea
            onChange={this.onDescChange}
            value={handleDesc}
            placeholder={'请填写处理记录，必填'}
            required={isVertify || handleVertify}
            maxLength="999"
          />
          {<i
            className={`iconfont icon-wrong ${styles.cancelEdit} ${closeIconisShow && styles.disDiplay}`}
            onClick={this.cancelEdit}
          />}
        </div>
        <div className={styles.editPic}>
          <span className={styles.editTitle}>
            <span className={styles.editTitleName}>添加照片</span>
            <span className={styles.titleTip}>最多4张</span>
          </span>
          <span>{
            <PicUploader
              value={handleImgs && handleImgs.map(e => e.url) || []}
              mode="edit"
              maxPicNum={4}
              onChange={this.onPicChange}
              uploadUrl={downloadTemplet}
            />}</span>
        </div>
        <div className={styles.editVideo}>
          <span className={styles.editTitle}>
            <span className={styles.editTitleName}>添加视频</span>
            <span className={styles.titleTip}>不超过15s</span>
          </span>
          <span>{
            <VideoUploader
              value={handleVideos && handleVideos.length > 0 && handleVideos || []}
              mode="edit"
              onChange={this.onVideoChange}
              maxNum={1}
              uploadUrl={downloadTemplet}
            />}</span>
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
            {!!isCoordinate &&
              <TextArea
                value={coordinateDesc}
                onChange={this.onCoordinateInfoChange}
                placeholder="请输入协调内容"
                required={isVertify || handleVertify}
                maxLength="999"
              />}
          </span>
        </div>
        <div className={styles.saveEditRow}>
          {singleSave &&
            <CneButton className={styles.btn} onClick={this.onEditInfoSave}>
              <i className={`iconfont icon-save ${styles.btnIcon}`} />
              <span className={styles.actionName}>保存</span>
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
