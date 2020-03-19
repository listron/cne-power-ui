import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import ReactPlayer from 'react-player';
import styles from './modal.scss';

export default class VideoModal extends Component {
  static propTypes = {
    theme: PropTypes.string,
    modalVideoSrc: PropTypes.bool,
    wrapModalClassName: PropTypes.string,
    hideVideoModal: PropTypes.func,
  };

  static defaultProps = {
    theme: 'light',
  };

  closeModal = () => { // 关闭
    this.props.hideVideoModal();
  };

  render() {
    const { theme, wrapModalClassName, modalVideoSrc } = this.props;
    return (
      <Modal
        visible={!!modalVideoSrc}
        wrapClassName={`${styles.videoModalBox} ${styles[theme]} ${wrapModalClassName}`}
        footer={null}
        closable={null}
        maskClosable={null}
        maskStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
        width={960}
      >
        <div className={styles.videoModalContent}>
          <div className={styles.videoModalTitle}>
            <i
              title="关闭"
              onClick={this.closeModal}
              className={`iconfont icon-closeall ${styles.closeVideoIcon}`}
            />
          </div>
          <ReactPlayer
            url={modalVideoSrc}
            onReady={this.playerReady}
            controls={true}
            className={styles.videoPlayer}
            height="640px"
            width="960px"
          />
        </div>
      </Modal>
    );
  }
}
