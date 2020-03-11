import React, { Component } from 'react';
import { Input, Switch } from 'antd';
import CneButton from '@components/Common/Power/CneButton';
import styles from './handle.scss';
const { TextArea } = Input;

export default class InfoEdit extends Component {

  state = {
    handleDesc: '处理记录信息',
    isChangePart: 0, // 0否 1是
    isCoordinate: 0, // 0不需要 1需要
    partName: '哈哈哈不见',
    coordinateDesc: '协调信息1122找大力他可以搞定所有',
    handleImg: [], // 图片地址
    handleVideo: [], // 视频地址
  }

  cancelEdit = () => { // 取消处理信息添加
    console.log('取消处理信息添加');
  }

  onDescChange = ({ target }) => {
    this.setState({ handleDesc: target.value || '' });
  }

  onPartsChange = (isChangePart) => {
    this.setState({ isChangePart: isChangePart ? 1 : 0 });
  }

  onPartsInfoChange = ({ target = {} }) => {
    this.setState({ partName: target.value || '' });
  }

  onCoordinateChange = (isCoordinate) => {
    this.setState({ isCoordinate: isCoordinate ? 1 : 0 });
  }

  onCoordinateInfoChange = ({ target = {} }) => {
    this.setState({ coordinateDesc: target.value || '' });
  }

  onEditInfoSave = () => {
    console.log(this.state);
  }

  render() {
    const {
      handleDesc, isChangePart, isCoordinate, partName, coordinateDesc, handleImg, handleVideo,
    } = this.state;
    return (
      <div className={styles.infoEditBox}>
        <div className={styles.editRecord}>
          <span className={styles.editTitle}>
            <span className={styles.editTitleName}>处理记录</span>
            <span className={styles.titleTip}>
              {handleDesc ? (`${handleDesc}`).length : 0}/999字
            </span>
          </span>
          <TextArea onChange={this.onDescChange} value={handleDesc} />
          <i
            className={`iconfont icon-wrong ${styles.cancelEdit}`}
            onClick={this.cancelEdit}
          />
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
          <span className={styles.editTitle}>更换备件</span>
          <span className={styles.partsInput}>
            <Switch checked={!!isChangePart} onChange={this.onPartsChange} />
            <Input value={partName} onChange={this.onPartsInfoChange} />
          </span>
        </div>
        <div className={styles.editCoordinate}>
          <span className={styles.editTitle}>
            <span className={styles.editTitleName}>协调</span>
            <span className={styles.titleTip}>
              {coordinateDesc ? (`${coordinateDesc}`).length : 0}/999字
            </span>
          </span>
          <span className={styles.coordinateInput}>
            <Switch checked={!!isCoordinate} onChange={this.onCoordinateChange} />
            <TextArea value={coordinateDesc} onChange={this.onCoordinateInfoChange} />
          </span>
        </div>
        <div className={styles.saveEditRow}>
          <CneButton className={styles.saveEditButton}>
            <i className={'iconfont icon-save'} />
            保存
          </CneButton>
        </div>
      </div>
    );
  }
}
