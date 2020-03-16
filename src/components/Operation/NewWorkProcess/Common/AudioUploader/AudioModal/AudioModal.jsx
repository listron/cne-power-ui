import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import ReactPlayer from 'react-player';
import styles from './modal.scss';

export default class AudioModal extends Component {
  static propTypes = {
    theme: PropTypes.string,
    visible: PropTypes.bool,
    wrapModalClassName: PropTypes.string,
    hideAudioModal: PropTypes.func,
  };

  static defaultProps = {
    theme: 'light',
  };

  closeModal = () => { // 关闭
    console.log('cloabale???')
    this.props.hideAudioModal();
  };

  render() {
    const { theme, wrapModalClassName, visible } = this.props;
    return (
      <Modal
        visible={visible}
        wrapClassName={`${styles.audioModalBox} ${styles[theme]} ${wrapModalClassName}`}
        footer={null}
        closable={null}
        maskClosable={null}
        maskStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
        width={630}
      >
        <div className={styles.audioModalContent}>
          <div className={styles.audioModalTitle}>
            <i
              title="关闭"
              onClick={this.closeModal}
              className={`iconfont icon-closeall ${styles.closeAudioIcon}`}
            />
          </div>
          <ReactPlayer
            url="/video/01-1000.mp4"
            muted
            autoPlay
            loop
            playing={false}
            className={styles.audioPlayer}
            width="auto"
            height="auto"
          />
        </div>
      </Modal>
    );
  }
}
