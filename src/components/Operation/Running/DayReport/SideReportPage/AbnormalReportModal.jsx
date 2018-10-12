
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Modal, Button } from 'antd';
import LostGenTable from './LostGenTable';
import LostAddForm from './LostAddForm';

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
      addLostFormShow: false,
      faultGenList: props.abnormalList, // 选中电站故障损失。
      limitGenList: [], // 选中电站限电损失。
      electricInfo: {}, // 发电信息
    }
  }

  confirmAbnormal = () => {
    console.log('确认保存异常！')
  }

  changeFaultList = (faultGenList, closeAddForm=false) => { // 修改损失电量信息
    console.log(faultGenList)
    const newState = {faultGenList};
    closeAddForm && (newState.addLostFormShow = false);
    this.setState({ ...newState });
  }


  toAddGenLost = () => { // 添加损失电量信息=>展示form添加框
    this.setState({
      addLostFormShow: true
    })
  }

  changeLimitList = (limitGenList) => { // -- todo 限电信息table内调整
    this.setState({
      limitGenList
    })
  }

  render(){
    const { abnormalModalshow, abnormalInfo, hideAbnormalModal} = this.props;
    const { addLostFormShow, faultGenList, limitGenList } = this.state;
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
            <Button onClick={this.toAddGenLost} disabled={addLostFormShow} >添加</Button>
          </div>
          <LostGenTable faultGenList={faultGenList} abnormalInfo={abnormalInfo} changeFaultList={this.changeFaultList} />
          {addLostFormShow && <LostAddForm faultGenList={faultGenList} changeFaultList={this.changeFaultList} abnormalInfo={abnormalInfo} />}
        </Modal>
    )
  }
}

export default AbnormalReportModal;
