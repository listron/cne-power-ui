import React, { Component } from "react";
import { Select, Table, Modal, Button, Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import styles from "./warnConfig.scss";
import WarningTip from '../../../../Common/WarningTip';

class DetailRule extends Component {
  static propTypes = {
    changeWarnStore: PropTypes.func,
    warnDetail: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
    }
  }

  componentDidMount() { // 初始请求数据

  }

  onPrev = () => { // 向前

  }

  onNext = () => { // 向后

  }

  onCancelEdit = () => { // 退出按钮
    this.props.changeWarnStore({ showPage: 'home' })
  }

  warnDetail = (warnDetail) => {
    return `预警规则：当测点值 ${warnDetail.warningRuler}${warnDetail.warningValue}会产生预警， 当测点${warnDetail.warningRuler}${warnDetail.warningValue}时预警才会消失`
  }

  render() {
    const { warnDetail } = this.props;
    return (
      <div className={styles.detailRule} >
        <div className={styles.detailTop}>
          <Button type="primary">编辑</Button>
          <div className={styles.action}>
            <i className="iconfont icon-last" onClick={this.onPrev} />
            <i className="iconfont icon-next" onClick={this.onNext} />
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
          </div>
        </div>
        <div className={styles.detailCont}>
          <div className={styles.detailBox}>
            <div className={styles.detail}>
              <div>所属电站 <span>{warnDetail.stationName || '--'}</span></div>
              <div>设备类型 <span>{warnDetail.deviceTypeName || '--'}</span></div>
              <div>设备型号 <span>{warnDetail.deviceModeName || '--'}</span></div>
              <div>测点描述 <span>{warnDetail.devicePointDesc || '--'}</span></div>
              <div>测点单位 <span>{warnDetail.devicePointUnit || '--'}</span></div>
            </div>
            <div className={styles.detailRule}>
              <div>预警描述 <span>{warnDetail.warningCheckDesc || '--'}</span></div>
              <div>预警规则
                <Tooltip placement="topLeft" overlayStyle={{maxWidth: 500, fontSize: '12px' }} title={this.warnDetail(warnDetail)} className={styles.tooltip}> <i className="iconfont icon-help" onClick={this.refresh}></i>
                </Tooltip>
                <span className={styles.warningRuler}>{warnDetail.warningRuler}{warnDetail.warningValue}震荡区间{warnDetail.warningDeadZone} </span></div>
              <div>预警级别 <span>{warnDetail.warningLevel || '--'}级</span></div>
              <div>是否启用 <span>{warnDetail.warningEnabled === 1 ? '是' : '否' || '--'}</span></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DetailRule