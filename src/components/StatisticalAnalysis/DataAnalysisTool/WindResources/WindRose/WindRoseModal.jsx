import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Icon } from 'antd';
import BigWindRose from './BigWindRose';
import styles from './windRose.scss';

export default class WindRoseModal extends Component{
  static propTypes = {
    currentImgIndex: PropTypes.number,
    changeCurrentImgIndex: PropTypes.func,
    isShowModal: PropTypes.bool,
    hideImg: PropTypes.func,
    likeStatusChange: PropTypes.func,
    deviceList: PropTypes.array,
  };

  preImg = () => {
    const { currentImgIndex } = this.props;
    if (currentImgIndex <= 0) {
      return;
    }
    this.props.changeCurrentImgIndex(currentImgIndex - 1);
  };

  nextImg = () => {
    const { currentImgIndex, deviceList } = this.props;
    if (!deviceList || currentImgIndex >= deviceList.length - 1) {
      return;
    }
    this.props.changeCurrentImgIndex(currentImgIndex + 1);
  };

  render(){
    const { isShowModal, hideImg, deviceList, currentImgIndex, likeStatusChange } = this.props;
    const curChart = deviceList[currentImgIndex];
    const likeStatus = curChart ? curChart.likeStatus : false;
    const deviceName = curChart ? curChart.deviceName : '';
    return(
      <React.Fragment>
        <span ref={'date'} />
        <Modal
          footer={null}
          visible={isShowModal}
          onCancel={hideImg}
          width={1345}
          destroyOnClose={true}
          wrapClassName={styles.windRoseModal}
          getContainer={() => this.refs.date}
        >
          <div className={styles.imgBox}>
            <div className={styles.handleButton}>
              <Button onClick={this.preImg} disabled={currentImgIndex === 0}>
                <Icon type="left" />
              </Button>
            </div>
            <div className={styles.imgContainer} >
              <BigWindRose
                {...this.props}
                saveBtn={likeStatus}
                id={`${deviceName}_${currentImgIndex}`}
                index={currentImgIndex}
                deviceName={deviceName}
                likeStatusChange={likeStatusChange}
              />
            </div>
            <div className={styles.handleButton}>
              <Button onClick={this.nextImg} disabled={!deviceList || currentImgIndex === deviceList.length - 1}>
                <Icon type="right" />
              </Button>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}
