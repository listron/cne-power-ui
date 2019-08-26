import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Icon } from 'antd';
import styles from './sequenceStyles.scss';
import SequenceChart from './SequenceChart';
import BigSequenceChats from './BigSequenceChats';

class SequenceModal extends React.Component {
  static propTypes = {
    currentImgIndex: PropTypes.number,
    changeCurrentImgIndex: PropTypes.func,
    data: PropTypes.object,
    isShowModal: PropTypes.bool,
    hideImg: PropTypes.func,
    onChange: PropTypes.func,
    curBigChartData: PropTypes.object,

  }
  constructor(props, context) {
    super(props, context);
  }
  preImg = () => {
    const { currentImgIndex } = this.props;
    if (currentImgIndex <= 0) {
      return;
    }
    this.props.changeCurrentImgIndex(currentImgIndex - 1);
  }

  nextImg = () => {
    const { currentImgIndex, deviceList } = this.props;
    // console.log('currentImgIndex: ', currentImgIndex);
    if (!deviceList || currentImgIndex >= deviceList.length - 1) {
      return;
    }
    this.props.changeCurrentImgIndex(currentImgIndex + 1);
  }

  render() {
    const { isShowModal, hideImg, deviceList, curBigChartData, currentImgIndex, likeStatusChange } = this.props;
    const curChart = deviceList[currentImgIndex];
    const likeStatus = curChart ? curChart.likeStatus : false;
    const deviceName = curChart ? curChart.deviceName : '';

    return (
      <React.Fragment>
        <span ref={'date'}></span>
        <Modal
          footer={null}
          visible={isShowModal}
          onCancel={hideImg}
          width={1280}
          destroyOnClose={true}
          wrapClassName={styles.sequenceModal}
          getContainer={() => this.refs.date}
        >
          <div className={styles.imgBox}>
            <div className={styles.handleButton}>
              <Button onClick={this.preImg} disabled={currentImgIndex === 0}>
                <Icon type="left" />
              </Button>
            </div>
            <div className={styles.imgContainer} >
              <BigSequenceChats
                {...this.props}
                saveBtn={likeStatus}
                id={`${deviceName}_${currentImgIndex}`}
                index={currentImgIndex}
                deviceName={deviceName}
                allChartData={curBigChartData}
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
export default (SequenceModal)
  ;
