

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, Modal, message, Checkbox, Button, Radio, Icon } from 'antd';
import styles from './stationMain.scss';
import { Link } from 'react-router-dom';

class SetEventYxModal extends Component { // 电站管理列表页
  static propTypes = {
    allEventYx: PropTypes.array,
    setDiagconfigYx: PropTypes.func,
    closeEventModal: PropTypes.func,
    stationCode: PropTypes.number,
    loading: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: {},
    };
  }


  confirmSetting = () => {
    const { checkedKeys } = this.state;
    const { allEventYx, stationCode, setDiagconfigYx } = this.props;
    const defaultSelectKeys = {};
    allEventYx.forEach(list => { // 只有设备类型_设备型号 是唯一key值
      const deviceTypeCode = list.deviceTypeCode;
      list.deviceModes.forEach(mode => {
        const deviceModeCode = mode.deviceModeCode;
        const defaultValue = mode.versions.filter(e => e.selected);
        if (defaultValue.length > 0) {
          defaultSelectKeys[`${deviceTypeCode}_${deviceModeCode}`] = defaultValue[0].diagModeVersionId;
        }
      });
    });
    const selectKeys = { ...defaultSelectKeys, ...checkedKeys };
    const diagModeVersions = Object.values(selectKeys);
    setDiagconfigYx({ diagModeVersions: diagModeVersions, stationCode, func: this.props.closeEventModal });

  }


  cancelSetting = () => {
    this.props.closeEventModal({ eventYxModal: false });
  }

  onChange = (e) => { // 改变版本
    const parentCode = e.target.name;
    const { checkedKeys } = this.state;
    checkedKeys[parentCode] = e.target.value;
    this.setState({ checkedKeys });
  }



  render() {
    const { allEventYx, loading } = this.props;
    return (
      <Modal
        title={<span>请设置平台级告警规则</span>}
        visible={true}
        onCancel={this.cancelSetting}
        okText="保存"
        cancelText="取消"
        wrapClassName={styles.eventYx}
        width={625}
        footer={<div className={styles.footer}>
          <div className={styles.text}>若未找到需要的软件版本，去<a>添加平台级告警规则设置</a></div>
          <div className={styles.button}>
            <div onClick={this.cancelSetting} className={styles.cancel}>取 消</div>
            <Button onClick={this.confirmSetting} className={styles.confirm}>
              <div className={styles.buttonCont}>
                {loading && <Icon type="loading" style={{ fontSize: 18 }} spin />} 确 定
            </div>
            </Button>
          </div>
        </div>}
      >
        {allEventYx.map(list => {
          return (
            <div key={list.deviceTypeCode}>
              <div className={styles.deviceTypeName}><span>{list.deviceTypeName}</span></div>
              <div className={styles.deviceTypeCont}>
                {list.deviceModes.map(mode => {
                  const defaultValue = mode.versions.filter(e => e.selected);
                  const diagModeVersionId = defaultValue.length > 0 && defaultValue[0].diagModeVersionId || '';
                  return (
                    <React.Fragment>
                      <div key={mode.deviceTypeCode} >{mode.deviceModeName}({mode.manufactorName})  </div>
                      <Radio.Group
                        name={`${list.deviceTypeCode}_${mode.deviceModeCode}`}
                        onChange={this.onChange}
                        defaultValue={`${diagModeVersionId}`}
                      >
                        {mode.versions.map(e => { return <Radio value={`${e.diagModeVersionId}`} key={e.diagModeVersionId} className={styles.version}> {e.version} </Radio>; })}
                      </Radio.Group>
                    </React.Fragment>
                  );
                })
                }
              </div>
            </div>);
        })}
      </Modal>
    );
  }
}

export default SetEventYxModal;
