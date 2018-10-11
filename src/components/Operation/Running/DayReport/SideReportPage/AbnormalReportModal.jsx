
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Modal, Button } from 'antd';
import LostGenTable from './LostGenTable';

class AbnormalReportModal extends Component {
  static propTypes = {
    abnormalInfo: PropTypes.object,
    abnormalList: PropTypes.array,
    abnormalModalshow: PropTypes.bool,
    hideAbnormalModal: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      faultGenList: props.abnormalList, // 选中电站故障损失。
      limitGenList: [], // 选中电站限电损失。
      electricInfo: {}, // 发电信息
    }
  }

  confirmAbnormal = () => {
    console.log('确认保存异常！')
  }

  changeFaultList = (faultGenList) => {
    console.log(faultGenList)
    this.setState({
      faultGenList
    })
  }

  changeLimitList = (limitGenList) => {
    this.setState({
      limitGenList
    })
  }

  render(){
    const { abnormalModalshow, abnormalInfo, hideAbnormalModal} = this.props;
    const { faultGenList, limitGenList } = this.state;
    return (
      <Modal
          title={`添加异常-${abnormalInfo.stationName}`}
          visible={abnormalModalshow}
          onOk={this.confirmAbnormal}
          onCancel={hideAbnormalModal}
          width={1200}
        >
          <div>
            <span>损失电量信息</span>
            <Button>添加</Button>
          </div>
          <LostGenTable faultGenList={faultGenList} abnormalInfo={abnormalInfo} changeFaultList={this.changeFaultList} />
        </Modal>
    )
  }
}

export default AbnormalReportModal;
