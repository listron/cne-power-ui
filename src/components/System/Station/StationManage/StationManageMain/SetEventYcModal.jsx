

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, Modal, message, Checkbox, Button, Switch, InputNumber } from 'antd';
import styles from './stationMain.scss';

class SetEventYxModal extends Component { // 遥测诊断或者是数据质量诊断的数据
  static propTypes = {
    eventData: PropTypes.array,
    type: PropTypes.string,
    closeEventModal: PropTypes.func,
    setDiagconfigYc: PropTypes.func,
  }

  constructor(props) {
    super(props);
    const { eventData } = props;
    this.state = {
      eventData,
    };
  }

  componentDidMount() {
    const { eventData } = this.props;
    this.setState({ eventData });
  }


  onChange = (bool, e) => {
    const { eventData } = this.state;
    const diagStationConfigId = e.diagStationConfigId;
    const resetData = eventData.findIndex(e => e.diagStationConfigId === diagStationConfigId);
    eventData[resetData]['configEnabled'] = +bool;
    setTimeout(() => { this.setState({ eventData }); }, 0);
  }

  numberChange = (value, list) => {
    console.log(12344, value, list);
    const { eventData } = this.state;
    const diagStationConfigId = list.diagStationConfigId;
    const resetData = eventData.findIndex(e => e.diagStationConfigId === diagStationConfigId);
    eventData[resetData]['threshold'] = value;
    setTimeout(() => { this.setState({ eventData }); }, 0);
  }

  confirmSetting = () => {
    const { eventData } = this.state;
    const { setDiagconfigYc } = this.props;
    setDiagconfigYc(eventData);
    console.log('eventData', eventData);
  }



  cancelSetting = () => {
    this.props.closeEventModal({ eventYcModal: false });
  }




  render() {
    const { eventData } = this.state;
    const { type } = this.props;
    return (
      <Modal
        title={<span>遥测诊断设置</span>}
        visible={true}
        onCancel={this.cancelSetting}
        okText="保存"
        cancelText="取消"
        wrapClassName={styles.SetEventYcModal}
        width={625}
        footer={<div className={styles.footer}>
          <div onClick={this.cancelSetting} className={styles.cancel}>取 消</div>
          <Button onClick={this.confirmSetting} className={styles.confirm}>确定</Button>
        </div>}
      >
        <div>
          {type === 'yc' &&
            eventData.map(list => {
              return (<div key={list.configCode} className={styles.configCode}>
                <span className={styles.ycName}>{list.configName}</span>
                <Switch onChange={(e) => this.onChange(e, list)} checked={list.configEnabled && true || false} />
              </div>);
            })
          }
          {type === 'data' &&
            eventData.map(list => {
              return (
                <div key={list.configCode} className={styles.configCodeData}>
                  <span className={styles.ycName}>{list.configName}</span>
                  <Switch onChange={(e) => this.onChange(e, list)} checked={list.configEnabled && true || false} />
                  {list.configEnabled &&
                    <div className={styles.inputNumber}> 阈值
                   <InputNumber min={1} max={100} value={list.threshold} onChange={(value) => this.numberChange(value, list)} />
                      % </div> || ''}
                </div>
              );
            })
          }
        </div>


      </Modal>
    );
  }
}

export default SetEventYxModal;
