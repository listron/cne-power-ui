import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './handle.scss';
import PicUploader from '../../Common/PicUploader';
import VideoUploader from '../../Common/VideoUploader';
import moment from 'moment';

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
    createUserName: PropTypes.string,
  };

  render() {
    const {
      handleDesc, isChangePart, isCoordinate, partName, coordinateDesc, handleImgs = [], handleVideos, createTime, createUserName,
    } = this.props;
    return (
      <div
        className={styles.eachInfo}
        style={{ borderColor: isCoordinate ? '#df4b33' : '#d4d4d4' }}
      >
        <div className={styles.userInfo}>
          <span>
            <span className={styles.handleTime}>{createTime && moment(createTime).format('YYYY-MM-DD HH:mm')}</span>
            <span>{createUserName || '--'}</span>
          </span>
          {!!isCoordinate && <span className="iconfont icon-xietiao" title={'协调'} />}
        </div>
        <div className={styles.handleRecord}>
          <span className={styles.recordName}>处理记录: </span>
          <span className={styles.recordText}>{handleDesc || '--'}</span>
        </div>
        {!!isCoordinate && <div className={styles.coordinateRecord}>
          <span className={styles.recordName}>协调内容: </span>
          <span className={styles.recordText}>{coordinateDesc || '--'}</span>
        </div>}
        {!!isChangePart && <div className={styles.partRecord}>
          <span className={styles.recordName}>更换备件:</span>
          <span className={styles.recordText}>{partName || '--'}</span>
        </div>}
        {((handleImgs && handleImgs.length > 0) || (handleVideos && handleVideos.length > 0)) &&
          <div className={styles.imgRecord}>
            <span className={styles.recordName} />
            <span className={styles.picBox}>
              {handleImgs && handleImgs.length > 0 &&
                <PicUploader
                  value={handleImgs.map(e => e.url)}
                  mode="review"
                />
              }
              {handleVideos && handleVideos.length > 0 &&
                <VideoUploader
                  value={handleVideos}
                  onChange={this.onVideoChange}
                  mode="review"
                />
              }
            </span>
          </div>
        }
      </div>
    );
  }
}
