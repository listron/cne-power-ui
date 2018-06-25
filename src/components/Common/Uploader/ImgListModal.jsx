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
    changeCurrentImgIndex: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      imgWidth: 580,
    };
    this.preImg = this.preImg.bind(this);
    this.nextImg = this.nextImg.bind(this);
  }

  preImg() {
    let { currentImgIndex } = this.props;
    if(currentImgIndex <= 0){
      return;
    }
    this.props.changeCurrentImgIndex(currentImgIndex-1);
  }
  
  nextImg() {
    let { currentImgIndex,data } = this.props;
    if(currentImgIndex >= data.length - 1){
      return;
    }
    this.props.changeCurrentImgIndex(currentImgIndex + 1);
  }

  render() {
    const { imageListShow, hideImg, data, currentImgIndex } = this.props;
    const { imgWidth } = this.state;
    let listMargin = currentImgIndex*(-imgWidth);
    return (
      <Modal
        footer={null}
        visible={imageListShow}
        onCancel={hideImg}
        width={760}
      >
        <div className={styles.imgModal}>
          <div className={styles.handleButton}>
            <Button onClick={this.preImg} disabled={currentImgIndex===0}>
              <Icon type="left" />
            </Button>
          </div>
          <div className={styles.imgContainer} style={{width:imgWidth}}>
            <ul className={styles.imgList} style={{marginLeft: `${listMargin}px`}}>
              {data.map(e=>(
                <li className={styles.eachImg} key={e.uid}>
                  <img src={ e.thumbUrl } alt={e.name} width={imgWidth} />
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.handleButton}>
            <Button onClick={this.nextImg} disabled={currentImgIndex===data.length-1}>
              <Icon type="right" />
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
export default ImgListModal;