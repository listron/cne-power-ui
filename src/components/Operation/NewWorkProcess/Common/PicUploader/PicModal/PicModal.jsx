import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import axios from 'axios';
import path from '@path';
import styles from './picModal.scss';

const { basePaths, APISubPaths } = path;
const { APIBasePath } = basePaths;
const { ticket } = APISubPaths;

export default class PicModal extends Component {
  static propTypes = {
    mode: PropTypes.string,
    theme: PropTypes.string,
    modalPicSrc: PropTypes.string,
    wrapModalClassName: PropTypes.string,
    value: PropTypes.array,
    onPicChange: PropTypes.func,
    onModalPicIndexChange: PropTypes.func,
  };

  static defaultProps = {
    theme: 'light',
  };

  rotatePic = async () => { // 旋转图片
    const { value, modalPicSrc } = this.props;
    const rotateUrl = `${APIBasePath}${ticket.getRotateImg}`;
    try {
      const response = await axios.post(rotateUrl, {
        url: modalPicSrc,
        rotate: 90,
      });
      const { data } = response.data || {};
      const newValues = value.map(e => e === modalPicSrc ? data : e);
      this.props.onPicChange(newValues); // 数据源替换
      this.props.onModalPicIndexChange(data); // 旋转项替换
    } catch(error) {
      console.log('图片旋转失败');
    }
  };

  deletePic = () => {
    const { value, modalPicSrc } = this.props;
    if (value.length < 2) { // 删除后没图片了~
      this.props.onModalPicIndexChange(null);
      this.props.onPicChange();
    }
    const curIndex = value.indexOf(modalPicSrc);
    const newIndex = curIndex === value.length - 1 ? curIndex - 1 : curIndex + 1;
    this.props.onModalPicIndexChange(value[newIndex]);
  };

  prevPic = () => { // 前一张
    const { value, modalPicSrc } = this.props;
    const curIndex = value.indexOf(modalPicSrc);
    const preSrc = value[curIndex - 1];
    preSrc && this.props.onModalPicIndexChange(preSrc);
  };

  nextPic = () => { // 后一张
    const { value, modalPicSrc } = this.props;
    const curIndex = value.indexOf(modalPicSrc);
    const nextSrc = value[curIndex + 1];
    nextSrc && this.props.onModalPicIndexChange(nextSrc);
  };

  closeModal = () => { // 关闭
    this.props.onModalPicIndexChange(null);
  };

  render() {
    const { value, theme, wrapModalClassName, modalPicSrc, mode } = this.props;
    const curIndex = value.indexOf(modalPicSrc);
    const len = value.length;
    return (
      <Modal
        visible={!!modalPicSrc}
        wrapClassName={`${styles.meterPicZoomBox} ${styles[theme]} ${wrapModalClassName}`}
        footer={null}
        closable={null}
        maskClosable={null}
        maskStyle={{backgroundColor: 'rgba(153,153,153,0.2)'}}
        width={630}
      >
        <div className={styles.picZoomContent}>
          <div className={styles.picZoomTitle}>
            <div className={styles.picZoomTop}>
              <div className={styles.picZoomNum}>
                {len ? curIndex + 1 : 0}/{len}
              </div>
              <div className={styles.picZoomHandle}>
                {mode === 'edit' && <i
                  title="旋转"
                  className="iconfont icon-xuanzhuan"
                  onClick={this.rotatePic}
                />}
                {mode === 'edit' && <i
                  title="删除"
                  className="iconfont icon-del"
                  onClick={this.deletePic}
                />}
              </div>
              <div />
            </div>
            <div className={styles.picZoomClose}>
              <i
                title="关闭"
                onClick={this.closeModal}
                className="iconfont icon-closeall"
              />
            </div>
          </div>
          <div className={styles.picZoomImgBox}>
            <div className={styles.picZoomImgContent}>
              <div className={styles.picLeftBox}>
                <i
                  title="前一张"
                  onClick={this.prevPic}
                  className={`iconfont icon-arrowleft ${curIndex - 1 >= 0 ? '' : styles.picLeft}`}
                />
              </div>
              <img src={modalPicSrc} alt="" />
              <div className={styles.picRightBox}>
                <i
                  title="后一张"
                  onClick={this.nextPic}
                  className={`iconfont icon-arrowr ${curIndex + 1 < len ? '' : styles.picRight}`}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
