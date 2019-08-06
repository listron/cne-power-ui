import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Icon } from 'antd';
import SingleScatter from './SingleScatter';
import styles from './dataAnalysisStyle.scss';

class SingleStationModal extends React.Component {
  constructor(props, context) {
    super(props, context);

  }
  render() {
    const { imageListShow, hideImg, data = [], currentImgIndex } = this.props;
    const curChart = data[currentImgIndex];
    console.log('curChart: ', curChart);
    const deviceName = curChart ? curChart.deviceName : '';
    console.log('deviceName: ', deviceName);
    const chartData = curChart ? curChart.chartData : [];
    console.log('chartData: ', chartData);

    return (
      <React.Fragment>
        <span ref={'date'}></span>
        <Modal
          footer={null}
          visible={imageListShow}
          onCancel={hideImg}
          width={760}
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
