import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Icon } from 'antd';
import SingleScatter from './SingleScatter';
import styles from './dataAnalysisStyle.scss';

class SingleStationModal extends React.Component {
  static propTypes = {
    currentImgIndex: PropTypes.number,
    changeCurrentImgIndex: PropTypes.func,
    data: PropTypes.array,
    imageListShow: PropTypes.bool,
    hideImg: PropTypes.func,
    onChange: PropTypes.func,

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
    const { currentImgIndex, data } = this.props;
    // console.log('currentImgIndex: ', currentImgIndex);
    if (!data || currentImgIndex >= data.length - 1) {
      return;
    }
    this.props.changeCurrentImgIndex(currentImgIndex + 1);
  }

  render() {
    const { imageListShow, hideImg, deviceList, data = [], currentImgIndex, likeChange } = this.props;
    const curChart = deviceList[currentImgIndex];
    const chartData = data[currentImgIndex];
    const likeStatus = curChart ? curChart.likeStatus : false;
    const deviceName = curChart ? curChart.deviceName : '';



    return (
      <React.Fragment>
        <span ref={'date'}></span>
        <Modal
          footer={null}
          visible={imageListShow}
          onCancel={hideImg}
          width={980}
          destroyOnClose={true}
          wrapClassName={styles.singleStationModal}
          getContainer={() => this.refs.date}
        >
          <div className={styles.imgBox}>
            <div className={styles.handleButton}>
              <Button onClick={this.preImg} disabled={currentImgIndex === 0}>
                <Icon type="left" />
              </Button>
            </div>
            <div className={styles.imgContainer} >
              <SingleScatter
                {...this.props}
                saveBtn={likeStatus}
                id={`${deviceName}_${currentImgIndex}`}
                index={currentImgIndex}
                title={deviceName}
                chartData={chartData}
                saveImgUrl={this.saveImgUrl}
                onChange={likeChange}

              />
            </div>
            <div className={styles.handleButton}>
              <Button onClick={this.nextImg} disabled={!data || currentImgIndex === data.length - 1}>
                <Icon type="right" />
              </Button>
            </div>
          </div>


        </Modal>
      </React.Fragment>
    );
  }
}
export default (SingleStationModal);
