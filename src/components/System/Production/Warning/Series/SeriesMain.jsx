import React, { Component } from "react";
import { Input, Switch, Button, message, InputNumber } from 'antd';
import PropTypes from 'prop-types';
import styles from "./series.scss";
import { handleRight } from '@utils/utilFunc';
import CneButton from '@components/Common/Power/CneButton';

class SeriesMain extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    getSeriesData: PropTypes.func,
    changeWarnStore: PropTypes.func,
    addSeriesData: PropTypes.func,
    isSend: PropTypes.number,
    sendNum: PropTypes.any,
    lostGenPercent: PropTypes.any,
  };
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      defaultThresholdt: null,//默认阈值
      defaultSendNum: null,//默认下发条数
      defalutStatus: {

      }
    }
  }

  componentDidMount() {
    this.props.getSeriesData();
  }

  

  onChangeHide = (checked) => { //'开关'按钮
    let isSend = checked ? 1 : 0;
    this.props.changeWarnStore({ isSend });
  }

  changeCount = (value) => { //设置'阈值'
    value && !Number.isInteger(value) && message.info('请输入整数!')
    this.props.changeWarnStore({ lostGenPercent: value });
  }

  changeSendCount = (value) => { //改变'最大下发条数'
   value && !Number.isInteger(value) && message.info('请输入整数!')
    this.props.changeWarnStore({ sendNum: value });
  }

  handleClear = () => { //'恢复默认值'按钮  默认是70 关 下发条数是20 
    this.props.changeWarnStore({ lostGenPercent: 70, isSend: 0, sendNum: 20, })
  }

  handleSubmit = () => { //'保存'按钮
    const { lostGenPercent, isSend, sendNum } = this.props;
    let electricity = this.messagetip('electricity', lostGenPercent);
    let sendName = this.messagetip('sendName', sendNum);
    if (electricity && sendName) {
      this.setState({
        isShow: false,
      })
      this.props.addSeriesData({ lostGenPercent, isSend, sendNum });
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
    this.setState({
      isShow: false,
    })
    this.props.getSeriesData();
  }

  modify = () => { //'修改'按钮
    this.setState({
      isShow: true,
    })
  }

  render() {
    const { isShow } = this.state;
    const { lostGenPercent, isSend, sendNum } = this.props;
    const seriesOperation = handleRight('inefficientDetect_modify');
    return (
      <div className={styles.seriesBox} style={{width:300}}>
        <div className={styles.thresholdt}>
          <span className={styles.thresholdtText}>电量损失比阈值</span>
          {!isShow ? <span className={styles.thresholdtNum}>{lostGenPercent || '--'}</span> :
            <InputNumber min={1} defaultValue={lostGenPercent} onChange={this.changeCount} value={lostGenPercent} />}
          <span className={styles.unit}>%</span>
        </div>

        <div className={styles.Send}>
          <div className={styles.SendTop}>
            <span className={styles.SendNum}>预警自动下发</span>
            {!isShow ? <Switch className={styles.SendSwitch} checked={isSend ? true : false} disabled={true} /> :
              <Switch className={styles.SendSwitch} checked={isSend ? true : false} onChange={this.onChangeHide} />}
          </div>
          {isSend ?
            <div className={styles.maximum}>
              <span className={styles.maximumText}>最大下发条数</span>
              {!isShow ? <span className={styles.maximumNum}>{sendNum}</span> :
                <InputNumber min={1} defaultValue={sendNum} onChange={this.changeSendCount} value={sendNum} />}
              <span className={styles.unit}>条</span>
            </div> : null}
        </div>

        {
          !isShow ? <div className={styles.btn}>
            {seriesOperation && <CneButton onClick={this.modify} default >修改</CneButton>}
          </div> :
            <div className={styles.btn}>
              <CneButton className={styles.btnBottom} onClick={this.handleClear} >恢复默认值</CneButton>
              <CneButton className={styles.btnBottom} type="submit" onClick={this.handleSubmit} >保存</CneButton>
              <CneButton className={styles.btnBottom} onClick={this.handleCancel}>取消</CneButton>
            </div>
        }
      </div>
    )
  }
}
export default SeriesMain;