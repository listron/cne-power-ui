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
    imageListShow: PropTypes.boolean,
    hideImg: PropTypes.func,

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
    console.log('currentImgIndex: ', currentImgIndex);
    if (!data || currentImgIndex >= data.length - 1) {
      return;
    }
    this.props.changeCurrentImgIndex(currentImgIndex + 1);
  }

  render() {
    const { imageListShow, hideImg, data = [], currentImgIndex, likeArr } = this.props;
    // console.log('likeArr: ', likeArr);
    // console.log('currentImgIndex: ', currentImgIndex);
    const curChart = data[currentImgIndex];
    // console.log('curChart: ', curChart);
    const deviceName = curChart ? curChart.deviceName : '';
    // console.log('deviceName: ', deviceName);
    const chartData = curChart ? curChart.chartData : [];
    // console.log('chartData: ', chartData);

    return (
      <React.Fragment>
        <span ref={'date'}></span>
        <Modal
          footer={null}
          visible={imageListShow}
          onCancel={hideImg}
          width={760}
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
                saveBtn={likeArr[currentImgIndex]}
                id={`${deviceName}_${currentImgIndex}`}
                title={deviceName}
                chartData={chartData}
                saveImgUrl={this.saveImgUrl}

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
