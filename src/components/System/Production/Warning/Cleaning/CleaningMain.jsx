import React, { Component } from "react";
import { Input, Button, InputNumber, message } from 'antd';
import styles from "./cleaning.scss";
import PropTypes from 'prop-types';
import { handleRight } from '@utils/utilFunc';
import CneButton from '@components/Common/Power/CneButton';

class CleaningMain extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    getCleaningData: PropTypes.func,
    changeWarnStore: PropTypes.func,
    addCleaningData: PropTypes.func,
    lossPowerPercent: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    }
  }

  componentDidMount() {
    const { enterpriseId } = this.props;
    this.props.getCleaningData({ enterpriseId });
  }

  modify = () => { // '修改'按钮
    this.setState({
      isShow: true,
    })
  }

  changeCount = (value) => { //设置'阈值'
    value && !Number.isInteger(value) && message.info('请输入整数!')
    this.props.changeWarnStore({ lossPowerPercent: value });
  }

  handleClear = () => { //'恢复默认值'按钮
    this.props.changeWarnStore({ lossPowerPercent: 10 })
  }

  handleSubmit = () => { //'保存'按钮
    const { lossPowerPercent, enterpriseId } = this.props;
    let electricity = this.messagetip('electricity', lossPowerPercent);
    if (electricity) {
      this.setState({
        isShow: false,
      })
      this.props.addCleaningData({ lossPowerPercent, enterpriseId });
    }
  }


  messagetip = (type, value) => { //提示判断
    let name = type === 'sendName' ? '最大下发条数' : '电量损失比阈值'
    !Number.isInteger(+value) && message.info(name + '请输入整数!')
    if (Number.isInteger(+value)) {
      return true
    }
  }

  handleCancel = (e) => { //'取消'按钮
    const { enterpriseId } = this.props;
    this.setState({
      isShow: false,
    })
    this.props.getCleaningData({ enterpriseId });
  }



  render() {
    const { isShow } = this.state;
    const { lossPowerPercent } = this.props;
    const cleaningOperation = handleRight('cleanModel_modify');
    return (
      !isShow ?
        <div className={styles.cleaningBox}>
          <div className={styles.thresholdt}>
            <span className={styles.thresholdtText}>电量损失比阈值</span>
            <span className={styles.thresholdtNum}>{lossPowerPercent || '--'}</span>
            <span>%</span>
          </div>

          {cleaningOperation && <div className={styles.btn}>
            <CneButton onClick={this.modify}>修改</CneButton>
          </div>}
        </div> :

        <div className={styles.cleaningBoxCopy}>
          <div className={styles.thresholdt}>
            <span className={styles.thresholdtText}>电量损失比阈值</span>
            <InputNumber min={1} defaultValue={lossPowerPercent} onChange={this.changeCount} value={lossPowerPercent} />
            <span>%</span>
          </div>

          <div className={styles.btn}>
            <CneButton className={styles.btnBottom} onClick={this.handleClear} >恢复默认值</CneButton>
            <CneButton className={styles.btnBottom} type="submit" onClick={this.handleSubmit} >保存</CneButton>
            <CneButton className={styles.btnBottom} onClick={this.handleCancel}>取消</CneButton>
          </div>
        </div>
    )
  }
}
export default CleaningMain;