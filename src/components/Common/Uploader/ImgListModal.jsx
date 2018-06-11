import React, { Component } from 'react';
import { Modal, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './uploader.scss';

class ImgListModal extends Component {
  static propTypes = {
    value: PropTypes.array,
    imageListShow: PropTypes.bool,
    hideImg: PropTypes.func,
    currentImgIndex: PropTypes.number,
    changeCurrentImgIndex: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      imgWidth: 580,
    }
  }
  componentWillReceiveProps(nextProps){
    
  }
  preImg = () => {
    let { currentImgIndex } = this.props
    if(currentImgIndex <= 0){
      return
    }
    this.props.changeCurrentImgIndex(currentImgIndex-1)
  }
  nextImg = () => {
    let { currentImgIndex,value } = this.props
    if(currentImgIndex >= value.length - 1){
      return
    }
    this.props.changeCurrentImgIndex(currentImgIndex + 1)
  }

  render() {
    const { imageListShow, hideImg, value, currentImgIndex } = this.props;
    const { imgWidth } = this.state
    let listMargin = currentImgIndex*(-imgWidth)
    return (
      <Modal
        footer={null}
        visible={imageListShow}
        onCancel={hideImg}
        width={760}
      >
        <div className={styles.imgModal}>
          <div className={styles.handleButton}>
            <Button onClick={this.preImg} disabled={currentImgIndex===0} ><Icon type="left" /></Button>
          </div>
          <div className={styles.imgContainer} style={{width:imgWidth}}>
            <ul className={styles.imgList} style={{marginLeft: `${listMargin}px`}}>
              {value.map(e=>(<li className={styles.eachImg} key={e.uid}><img src={ e.thumbUrl } alt={e.name} width={imgWidth} /></li>))}
            </ul>
          </div>
          <div className={styles.handleButton}>
            <Button onClick={this.nextImg} disabled={currentImgIndex===value.length-1}><Icon type="right" /></Button>
          </div>
        </div>
      </Modal>
    )
    
  }
}
export default ImgListModal;