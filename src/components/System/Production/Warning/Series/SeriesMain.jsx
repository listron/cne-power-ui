import React, { Component } from "react";
import { Input, Switch, Button } from 'antd';
import styles from "./series.scss";

class SeriesMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      defaultThresholdt: 70.00,//默认阈值
      defaultSendNum: 20,//默认下发条数
    }
  }

  componentDidMount() {
    this.props.getSeriesData();
  }

  onChangeHide = (checked) => { //'开关'按钮
    let isSend = checked ? 1 : 0;
    this.props.changeStore({ isSend });
  }

  changeCount = (e) => { //设置'阈值'
    const val = e.target.value;
    if (!isNaN(val)) {
      this.props.changeStore({ lostGenPercent: val });
    }
  }

  changeSendCount = (e) => { //改变'最大下发条数'
    this.props.changeStore({ sendNum: e.target.value });

  }

  handleClear = () => { //'恢复默认值'按钮
    this.props.changeStore({ lostGenPercent: this.state.defaultThresholdt, sendNum: this.state.defaultSendNum, isSend: false });
  }

  handleSubmit = () => { //'保存'按钮
    const { lostGenPercent, isSend, sendNum } = this.props;
    this.setState({
      isShow: false,
    })
    this.props.addSeriesData({ lostGenPercent, isSend, sendNum });
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
    console.log(lostGenPercent);

    return (
      !isShow ?
        <div className={styles.seriesBox}>
          <div className={styles.thresholdt}>
            <span className={styles.thresholdtText}>电量损失比阈值</span>
            <span className={styles.thresholdtNum}>{lostGenPercent}</span>
            <span>%</span>
          </div>

          <div className={styles.Send}>
            <div className={styles.SendTop}>
              <span className={styles.SendNum}>预警自动下发</span>
              <Switch className={styles.SendSwitch} checked={isSend ? true : false} />
            </div>
            {isSend ? <div className={styles.maximum}>
              <span className={styles.maximumText}>最大下发条数</span>
              <span className={styles.maximumNum}>{sendNum}</span>
              <span>条</span>
            </div> : ''}
          </div>

          <div className={styles.btn}>
            <Button onClick={this.modify}>修改</Button>
          </div>
        </div> :

        <div className={styles.seriesBoxCopy}>
          <div className={styles.thresholdt}>
            <span className={styles.thresholdtText}>电量损失比阈值</span>
            <Input className={styles.thresholdtNum} value={lostGenPercent} onChange={this.changeCount} />
            <span>%</span>
          </div>

          <div className={styles.Send}>
            <div className={styles.SendTop}>
              <span className={styles.SendNum}>预警自动下发</span>
              <Switch className={styles.SendSwitch} checked={isSend ? true : false} onChange={this.onChangeHide} />
            </div>
            {isSend ? <div className={styles.maximum}>
              <span className={styles.maximumText}>最大下发条数</span>
              <Input className={styles.maximumNum} value={sendNum} onChange={this.changeSendCount} />
              <span>条</span>
            </div> : ''}

          </div>

          <div className={styles.btn}>
            <Button className={styles.btnBottom} onClick={this.handleClear} >恢复默认值</Button>
            <Button className={styles.btnBottom} type="submit" onClick={this.handleSubmit} >保存</Button>
            <Button className={styles.btnBottom} onClick={this.handleCancel}>取消</Button>
          </div>
        </div>
    )
  }
}
export default SeriesMain;