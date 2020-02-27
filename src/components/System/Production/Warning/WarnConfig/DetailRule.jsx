import React, { Component } from 'react';
import { Button, Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import WarningTip from '../../../../Common/WarningTip';
import styles from './warnConfig.scss';

class DetailRule extends Component {
  static propTypes = {
    changeWarnStore: PropTypes.func,
    warnDetail: PropTypes.object,
    listQueryParams: PropTypes.object,
    warnList: PropTypes.array,
    getOtherPageDetail: PropTypes.func,
    getDetail: PropTypes.func,

  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
    };
  }

  componentDidMount() { // 初始请求数据

  }

  onPrev = () => { // 向前
    const { warnList, warnDetail, listQueryParams, getOtherPageDetail, getDetail } = this.props;
    const { pageNum } = listQueryParams;
    const detailIndex = warnList.findIndex(e => e.warningCheckId === warnDetail.warningCheckId);
    if (pageNum === 1 && detailIndex === 0) {//第一条记录
      this.setState({
        showWarningTip: true,
        warningTipText: '这是第一个!',
      });
    } else if (pageNum > 1 && detailIndex === 0) { // 向前翻一页
      listQueryParams.pageNum = pageNum - 1;
      getOtherPageDetail({ parms: listQueryParams, previous: true });
    } else if (detailIndex > 0) {
      const { warningCheckId } = warnList[detailIndex - 1];
      getDetail(warningCheckId);
    } else {
      console.log('信息有误，在tablelist中未获取');
    }
  }



  onNext = () => { // 向后
    const { warnList, warnDetail, listQueryParams, getOtherPageDetail, getDetail, totalNum } = this.props;
    const { pageNum, pageSize } = listQueryParams;
    const detailIndex = warnList.findIndex(e => e.warningCheckId === warnDetail.warningCheckId);
    const maxPage = Math.ceil(totalNum / pageSize);
    const lastPageMaxIndex = totalNum - (maxPage - 1) * pageSize - 1;
    if (pageNum === maxPage && detailIndex === lastPageMaxIndex) {//最后一条记录
      this.setState({
        showWarningTip: true,
        warningTipText: '这是最后一个!',
      });
    } else if (pageNum < maxPage && detailIndex === pageSize - 1) {
      listQueryParams.pageNum = pageNum + 1;
      getOtherPageDetail({ parms: listQueryParams, previous: false });
    } else if (pageNum <= maxPage) {
      const { warningCheckId } = warnList[detailIndex + 1];
      getDetail(warningCheckId);
    } else {
      console.log('信息有误，在tablelist中未获取');
    }
  }

  onCancelEdit = () => { // 退出按钮
    this.props.changeWarnStore({ showPage: 'home' });
  }

  warnDetail = (warnDetail) => { // 预警详情
    const rule = warnDetail.warningRuler === 1 ? '小于' : '大于';
    const rule2 = warnDetail.warningRuler === 1 ? '大于或等于' : '小于或等于';
    const value = warnDetail.warningRuler === 1 ? +warnDetail.warningValue + +warnDetail.warningDeadZone : warnDetail.warningValue - warnDetail.warningDeadZone;
    return (<div>
      <span>{'预警规则：'}</span>
      <div>{`当测点值 ${rule}${warnDetail.warningValue}会产生预警， 当测点${rule2}${value}时预警才会消失`}</div>
    </div>);
  }

  clickEdit = () => {
    this.props.changeWarnStore({ showPage: 'edit' });
  }

  confirmWarningTip = () => {
    this.setState({ showWarningTip: false });
  }

  render() {
    const { warnDetail } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    return (
      <div className={styles.detailRule} >
        {showWarningTip && <WarningTip onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.detailTop}>
          <Button type="default" onClick={this.clickEdit}>编辑</Button>
          <div className={styles.action}>
            <i className="iconfont icon-last" title="上一个" onClick={this.onPrev} />
            <i className="iconfont icon-next" title="下一个" onClick={this.onNext} />
            <i className={`iconfont icon-fanhui ${styles.backIcon}`} onClick={this.onCancelEdit} />
          </div>
        </div>
        <div className={styles.detailCont}>
          <div className={styles.detailBox}>
            <div className={styles.detail}>
              <div>所属电站 <span>{warnDetail.stationName || '--'}</span></div>
              <div>设备类型 <span>{warnDetail.deviceTypeName || '--'}</span></div>
              <div>设备型号 <span>{warnDetail.deviceModeName || '--'}</span></div>
              <div>测点描述 <span>{warnDetail.devicePointName || '--'}</span></div>
              <div>测点单位 <span>{warnDetail.devicePointUnit || '--'}</span></div>
            </div>
            <div className={styles.detailRule}>
              <div>预警描述 <span>{warnDetail.warningCheckDesc || '--'}</span></div>
              <div className={styles.detailWarnRule}>预警规则
                <div className={styles.tooltip}>
                  <Tooltip placement="topLeft" overlayStyle={{ maxWidth: 500, fontSize: '12px' }} title={this.warnDetail(warnDetail)} > <i className="iconfont icon-help"></i>
                  </Tooltip>
                </div>
                <span className={styles.warningRuler}>{warnDetail.warningRuler === 1 ? '小于' : '大于'}{warnDetail.warningValue},震荡区间 {warnDetail.warningDeadZone} </span></div>
              <div>预警级别 <span>{['一', '二', '三', '四', '五'][warnDetail.warningLevel - 1] || '--'}级</span></div>
              <div>是否启用 <span>{warnDetail.warningEnabled === 1 ? '是' : '否' || '--'}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DetailRule
  ;
