

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, Modal, message, Checkbox, Button, Radio } from 'antd';
import styles from './stationMain.scss'

class SetEventYxModal extends Component { // 电站管理列表页
  static propTypes = {
    allEventYx: PropTypes.array,
    departmentSetInfo: PropTypes.object,
    closeDepartmentModal: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      // checkedKeys,
    }
  }



  render() {
    const { allEventYx } = this.props;
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
          <Button onClick={this.cancelSetting} className={styles.cancel}>取消</Button>
          <Button onClick={this.confirmSetting} className={styles.confirm}>保存</Button>
        </div>}
      >
        {
          allEventYx.map(list => {
            return (
              <div>
                <div>{list.deviceTypeName}</div>
                {list.deviceModes.map(mode => {
                  const defaultValue = mode.versions.filter(e => e.selected);
                  const diagModeVersionId = defaultValue.length > 0 && defaultValue[0].diagModeVersionId || '';
                  return (
                    <React.Fragment>
                      <div key={mode.deviceTypeCode}>{mode.deviceModeName}({mode.manufactorName})  </div>
                      <Radio.Group
                        name={mode.manufactorName}
                        onChange={this.onChange}
                        defaultValue={diagModeVersionId}
                      >
                        {mode.versions.map(e => { return <Radio value={e.diagModeVersionId} key={e.diagModeVersionId}> {e.version} </Radio> })}
                      </Radio.Group>
                    </React.Fragment>
                  )
                })
                }
              </div>

            );
          })
        }

      </Modal>
    )
  }
}

export default SetEventYxModal;
