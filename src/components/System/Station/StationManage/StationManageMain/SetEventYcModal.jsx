

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, Modal, message, Checkbox, Button, Switch, InputNumber, Icon } from 'antd';
import styles from './stationMain.scss';

class SetEventYxModal extends Component { // 遥测诊断或者是数据质量诊断的数据
  static propTypes = {
    eventData: PropTypes.array,
    type: PropTypes.string,
    closeEventModal: PropTypes.func,
    setDiagconfigYc: PropTypes.func,
    loading: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    const { eventData } = props;
    this.state = {
      eventData,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { eventData } = nextProps;
    if (eventData.length !== this.props.eventData.length) {
      this.setState({ eventData });
    }
  }


  componentWillUnmount() {
    this.setState({ eventData: [] });
  }


  onChange = (bool, e) => { // 改变开关
    const { eventData } = this.state;
    const diagStationConfigId = e.diagStationConfigId;
    const resetData = eventData.findIndex(e => e.diagStationConfigId === diagStationConfigId);
    eventData[resetData]['configEnabled'] = +bool;
    setTimeout(() => { this.setState({ eventData }); }, 0);
  }

  numberChange = (value, list) => { // 改变阈值
    const { eventData } = this.state;
    const diagStationConfigId = list.diagStationConfigId;
    const resetData = eventData.findIndex(e => e.diagStationConfigId === diagStationConfigId);
    eventData[resetData]['threshold'] = value;
    setTimeout(() => { this.setState({ eventData }); }, 0);
  }

  confirmSetting = () => { // 确定
    const { eventData } = this.state;
    const { setDiagconfigYc } = this.props;
    setDiagconfigYc({ eventData, func: this.props.closeEventModal });
  }

  cancelSetting = () => { // 取消
    this.props.closeEventModal({ eventYcModal: false });
  }


  render() {
    const { eventData } = this.state;
    const { type, loading } = this.props;
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
          <Button onClick={this.confirmSetting} className={styles.confirm}>
            <div className={styles.buttonCont}>
              {loading && <Icon type="loading" style={{ fontSize: 18 }} spin />} 确 定
            </div>
          </Button>
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
