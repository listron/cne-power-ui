import React, { Component } from 'react';
import { Modal, Upload, Button, message, Select, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import styles from './examinerComp.scss';
const { Option } = Select;

export default class DetailModal extends Component {

  static propTypes = {
    detailModalShow: PropTypes.bool,
    settedDetail: PropTypes.array,
    changeStore: PropTypes.func,
  }

  state = {

  }

  hideDetail = () => this.props.changeStore({
    detailModalShow: false,
    settedDetail: null
  });

  render(){
    const { detailModalShow, settedDetail } = this.props;
    return (
      <Modal
        visible={detailModalShow}
        title="审核人设置"
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