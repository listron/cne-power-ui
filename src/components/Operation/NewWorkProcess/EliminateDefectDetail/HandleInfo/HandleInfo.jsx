import React, { Component } from 'react';
import CneButton from '@components/Common/Power/CneButton';
import InfoDetail from './InfoDetail';
import InfoEdit from './InfoEdit';
import styles from './handle.scss';

export default class HandleInfo extends Component {

  static propTypes = {

  };

  addHandleInfo = () => {
    // 添加记录, 新增一个新的可填写表单区域
  }

  mockHandleInfos = [
    {
      handleDesc: '一条处理信息描述',
      isChangePart: 1, // 是否更换备件
      isCoordinate: 1, // 是否协调
      partName: '更换的名称', // 更换部件名称
      coordinateDesc: '协调说明1111', // 协调说明
      handleImgs: [], // 处理图片路径数组 [{imgId, url}]
      handleVideos: [], // 处理视频
    }, {
      handleDesc: '两条处理信息描述',
      isChangePart: 0, // 是否更换备件
      isCoordinate: 0, // 是否协调
      partName: '', // 更换部件名称
      coordinateDesc: '', // 协调说明
      handleImgs: [], // 处理图片路径数组
      handleVideos: [], // 处理视频
    },
  ]

  render() {
    const { mockHandleInfos = {} } = this;
    return (
      <section className={styles.handleInfo}>
        <h4 className={styles.handleTitle}>
          <div className={styles.titleName}>处理信息</div>
          <CneButton className={styles.addBtn} onClick={this.addHandleInfo}>
            <i className={`iconfont icon-newbuilt ${styles.addIcon}`} />
            <span className={styles.text}>添加记录</span>
          </CneButton>
        </h4>
        <div className={styles.handleContents}>
          {mockHandleInfos.map((e, i) => (
            <InfoDetail key={i} {...e} />
          ))}
          <InfoEdit />
        </div>
      </section>
    );
  }
}
