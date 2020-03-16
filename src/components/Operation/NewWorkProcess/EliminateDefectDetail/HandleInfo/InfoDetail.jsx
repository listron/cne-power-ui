import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './handle.scss';
import PicUploader from '../../Common/PicUploader';

export default class InfoDetail extends Component {

  static propTypes = {
    handleDesc: PropTypes.string,
    isChangePart: PropTypes.number,
    isCoordinate: PropTypes.number,
    partName: PropTypes.string,
    coordinateDesc: PropTypes.string,
    handleImgs: PropTypes.array,
    handleVideos: PropTypes.array,
    createTime: PropTypes.string,
    createuUserName: PropTypes.string,
  };

  render() {
    const {
      handleDesc, isChangePart, isCoordinate, partName, coordinateDesc, handleImgs = [], handleVideos, createTime, createuUserName,
    } = this.props;
    return (
      <div
        className={styles.eachInfo}
        style={{ borderColor: isCoordinate ? '#df4b33' : '#d4d4d4' }}
      >
        <div className={styles.userInfo}>
          <span>
            <span className={styles.handleTime}>{createTime}</span>
            <span>{createuUserName || '--'}</span>
          </span>
          <span className="iconfont icon-xietiao" />
        </div>
        <div className={styles.handleRecord}>
          <span className={styles.recordName}>处理记录: </span>
          <span>{handleDesc || '--'}</span>
        </div>
        {!!isCoordinate && <div className={styles.coordinateRecord}>
          <span className={styles.recordName}>协调内容: </span>
          <span>{coordinateDesc || '--'}</span>
        </div>}
        {!!isChangePart && <div className={styles.partRecord}>
          <span className={styles.recordName}>更换备件:</span>
          <span>{partName || '--'}</span>
        </div>}
        <div className={styles.imgRecord}>
          <span className={styles.recordName} />
          <span>
            {
              handleImgs && handleImgs.length > 0 &&
              <div className={styles.threeLine}>
                <PicUploader
                  value={handleImgs.map(e => e.url)}
                  mode="review"
                />
              </div>
            }
          </span>
        </div>
      </div>
    );
  }
}
