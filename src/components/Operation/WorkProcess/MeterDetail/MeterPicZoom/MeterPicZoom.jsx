import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import styles from './meterPicZoom.scss';

export default class MeterPicZoom extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    theme: PropTypes.string,
    tipClassname: PropTypes.string,
    onCancel: PropTypes.func,
    width: PropTypes.number,
    style: PropTypes.object,
  };

  static defaultProps = {
    visible: false,
    theme: 'light',
  };

  constructor(props) {
    super(props);
    this.state = {
      rotate: 0,
    };
  }

  rotateImgParentDivAdapt = () => {
    const { rotate } = this.state;
    this.setState({
      rotate: rotate + 90,
    });
  };

  render() {
    const { rotate } = this.state;
    const {
      visible, theme, tipClassname, width, style, onCancel,
    } = this.props;
    const defaultModalProps = {
      style,
      footer: null,
      closable: false,
      maskClosable: false,
      maskStyle: {backgroundColor: 'rgba(153,153,153,0.2)'},
    };
    width && (defaultModalProps.width = width);
    return (
      <Modal
        {...defaultModalProps}
        visible={visible}
        wrapClassName={`${styles.meterPicZoomBox} ${styles[theme]} ${tipClassname || ''}`}
      >
        <div className={styles.picZoomContent}>
          <div className={styles.picZoomTitle}>
            <div className={styles.picZoomTop}>
              <div className={styles.picZoomNum}>
                1/5
              </div>
              <div className={styles.picZoomHandle}>
                <i title="旋转" className="iconfont icon-xuanzhuan" onClick={this.rotateImgParentDivAdapt} />
                <i title="删除" className="iconfont icon-del" />
              </div>
              <div />
            </div>
            <div className={styles.picZoomClose}>
              <i title="关闭" onClick={onCancel} className="iconfont icon-closeall" />
            </div>
          </div>
          <div className={styles.picZoomImgBox}>
            <div className={styles.picZoomImgContent}>
              <div className={styles.picLeftBox}>
                <i title="前一张" className={`iconfont icon-arrowleft ${styles.picLeft}`} />
              </div>
              <img style={{transform: `rotate(${rotate}deg)`}} src="/img/pic3.png" alt="" />
              <div className={styles.picRightBox}>
                <i title="后一张" className={`iconfont icon-arrowr ${styles.picRight}`} />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
