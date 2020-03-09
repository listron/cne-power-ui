import React, { Component } from 'react';
import { Input, Switch } from 'antd';
import styles from './handle.scss';
const { TextArea } = Input;

export default class InfoEdit extends Component {

  onDescChange = (value) => {
    console.log(value);
  }

  render() {
    return (
      <div>
        <div className={styles.editRecord}>
          <span className={styles.recordName}>处理记录: </span>
          <TextArea onChange={this.onDescChange} />
        </div>
        <div className={styles.editPic}>
          <span className={styles.recordName}>添加照片: </span>
          <span>添加照片组件</span>
        </div>
        <div className={styles.editVideo}>
          <span className={styles.recordName}>添加视频: </span>
          <span>添加视频组件</span>
        </div>
        <div className={styles.editParts}>
          <span className={styles.recordName}>更换备件: </span>
          <span>
            <Switch onChange={this.onPartsChange} />
            <Input onChange={this.onPartsInfoChange} />
          </span>
        </div>
        <div className={styles.editCoordinate}>
          <span className={styles.recordName}>协调: </span>
          <span>
            <Switch onChange={this.onCoordinateChange} />
            <TextArea onChange={this.onCoordinateInfoChange} />
          </span>
        </div>
        <div className={styles.saveEditRow}>
          <span>保存</span>
        </div>
      </div>
    );
  }
}
