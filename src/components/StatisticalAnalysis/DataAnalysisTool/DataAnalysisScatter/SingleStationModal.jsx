import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Icon } from 'antd';
import BigScatterChart from './BigScatterChart';
import styles from './dataAnalysisStyle.scss';

class SingleStationModal extends React.Component {
  static propTypes = {
    currentImgIndex: PropTypes.number,
    changeCurrentImgIndex: PropTypes.func,
    data: PropTypes.object,
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
    // 
    if (!data || currentImgIndex >= data.length - 1) {
      return;
    }
    this.props.changeCurrentImgIndex(currentImgIndex + 1);
  }
  likeChange = (index, bool) => {

    const { deviceList, changeToolStore } = this.props;
    deviceList[index].likeStatus = bool;
    changeToolStore({ deviceList });
  };
  render() {
    const { imageListShow, hideImg, deviceList, data, currentImgIndex } = this.props;



    return (
      <React.Fragment>
        <span ref={'date'}></span>
        <Modal
          footer={null}
          visible={imageListShow}
          onCancel={hideImg}
          width={1280}
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
              <BigScatterChart
                {...this.props}
                // saveBtn={likeStatus}
                index={currentImgIndex}
                // title={deviceName}
                likeChange={this.likeChange}
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
