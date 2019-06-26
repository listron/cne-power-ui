import React, { Component } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import styles from './examinerComp.scss';

export default class DetailModal extends Component {

  static propTypes = {
    handleDistributionId: PropTypes.number,
    detailModalShow: PropTypes.bool,
    settedDetail: PropTypes.array,
    settingList: PropTypes.array,
    changeStore: PropTypes.func,
  }

  hideDetail = () => this.props.changeStore({
    detailModalShow: false,
    handleDistributionId: null,
    settedDetail: null
  });

  render(){
    const { detailModalShow, settedDetail, handleDistributionId, settingList } = this.props;
    const currentInfo = settingList.find(e => e.distributionId === handleDistributionId) || {};
    return (
      <Modal
        visible={detailModalShow}
        title={`${currentInfo.stationName || ''}电站——审核人设置`}
        onCancel={this.hideDetail}
        footer={null}
      >
        <div className={styles.detailModal}>
          {settedDetail && settedDetail.map(e => (
            <div className={styles.eachInfo} key={e.nodeName}>
              <span className={styles.nodeName}>{e.nodeName}</span>
              <span className={styles.users} title={e.userNames || ''}>{e.userNames || '--'}</span>
            </div>
          ))}
        </div>
      </Modal>
    )
  }
}