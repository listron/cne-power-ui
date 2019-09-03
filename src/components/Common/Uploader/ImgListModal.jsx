import React, { Component } from 'react';
import { Modal, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './uploader.scss';

class ImgListModal extends Component {
  static propTypes = {
    data: PropTypes.array,
    imageListShow: PropTypes.bool,
    hideImg: PropTypes.func,
    currentImgIndex: PropTypes.number,
    changeCurrentImgIndex: PropTypes.func,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      imgWidth: 580,
    };
  }

  preImg = () => {
    const { currentImgIndex } = this.props;
    if (currentImgIndex <= 0) {
      return;
    }
    this.props.changeCurrentImgIndex(currentImgIndex - 1);
  }

  nextImg = () => {
    const { currentImgIndex, data } = this.props;
    if (!data || currentImgIndex >= data.length - 1) {
      return;
    }
    this.props.changeCurrentImgIndex(currentImgIndex + 1);
  }

  download = () => {
    const { downLoadFile, downloadHref } = this.props;
    downLoadFile({
      url: downloadHref,
      method: 'get',
    });

  }

  render() {
    const { imageListShow, hideImg, data = [], currentImgIndex, downloadHref, downLoadFile, theme = 'light' } = this.props;
    const { imgWidth } = this.state;
    const listMargin = currentImgIndex * (-imgWidth);
    return (
      <React.Fragment>
        <span ref="modal"></span>
        <Modal
          footer={null}
          visible={imageListShow}
          onCancel={hideImg}
          width={760}
          getContainer={() => this.refs.modal}
        >
          <div className={`${styles.imgModal} ${styles[theme]}`}>
            <div className={styles.imgTitle}>
              {currentImgIndex - 0 + 1}/{data.length}
              {downloadHref && downLoadFile && <Button className={styles.download} onClick={this.download} >下载</Button>}
            </div>
            <div className={styles.imgBox}>
              <div className={styles.handleButton}>
                <Button onClick={this.preImg} disabled={currentImgIndex === 0}>
                  <Icon type="left" />
                </Button>
              </div>
              <div className={styles.imgContainer} style={{ width: imgWidth }}>
                <ul className={styles.imgList} style={{ marginLeft: `${listMargin}px` }}>
                  {data && data.length > 0 && data.map(e => (
                    <li className={styles.eachImg} key={e.uid}>
                      <img src={e.thumbUrl} alt={e.name} width={imgWidth} style={{ transform: `rotate(${e.rotate}deg)` }} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.handleButton}>
                <Button onClick={this.nextImg} disabled={!data || currentImgIndex === data.length - 1}>
                  <Icon type="right" />
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}
export default ImgListModal;
