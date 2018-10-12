
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Modal, Button, Icon } from 'antd';
import LostGenTable from './LostGenTable';
import LostAddForm from './LostAddForm';

class AbnormalReportModal extends Component {
  static propTypes = {
    abnormalInfo: PropTypes.object,
    deviceExistInfo: PropTypes.object,
    abnormalList: PropTypes.array,
    abnormalModalshow: PropTypes.bool,
    hideAbnormalModal: PropTypes.func,
    findDeviceExist: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      addLostFormShow: false,
      addLimitFormShow: false, // 限电损失添加form框。
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

  toAddGenLimit = () => { // 添加限电信息 =>展示限电form
    this.setState({
      addLimitFormShow: true
    })
  }

  changeLimitList = (limitGenList, closeAddForm=false) => { // -- todo 限电信息table内调整
    this.setState({
      limitGenList
    })
  }

  render(){
    const { abnormalModalshow, abnormalInfo, hideAbnormalModal, findDeviceExist, deviceExistInfo} = this.props;
    const { addLostFormShow, faultGenList, limitGenList, addLimitFormShow } = this.state;
    return (
      <Modal
          title={`添加异常-${abnormalInfo.stationName}`}
          visible={abnormalModalshow}
          onOk={this.confirmAbnormal}
          onCancel={hideAbnormalModal}
          width={1200}
          wrapClassName={styles.addAbnormalModal}
        >
        <div className={styles.addGenLostHeader} >
          <span>损失电量信息<Icon type="caret-right" theme="outlined" /></span>
          <Button onClick={this.toAddGenLost} disabled={addLostFormShow} icon="plus" className={styles.uploadGenLost} >添加</Button>
        </div>
        <LostGenTable faultGenList={faultGenList} abnormalInfo={abnormalInfo} changeFaultList={this.changeFaultList} />
        {addLostFormShow && <LostAddForm 
          findDeviceExist={findDeviceExist} 
          faultGenList={faultGenList} 
          changeFaultList={this.changeFaultList}  
          abnormalInfo={abnormalInfo}
          deviceExistInfo={deviceExistInfo} 
        /> }
        <div>
          <span>限电信息</span>
          <Button disabled={addLimitFormShow} onClick={this.toAddGenLimit} >添加</Button>
        </div>
        
        {addLimitFormShow && <div>添加限电信息框</div>}

      </Modal>
    )
  }
}

export default AbnormalReportModal;
