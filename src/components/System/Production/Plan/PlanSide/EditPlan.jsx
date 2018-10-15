
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './planSide.scss';
import {Input, Button, DatePicker, Icon, Select, Form} from 'antd';
import WarningTip from '../../../../Common/WarningTip';
import PlanAddTable from './PlanAddTable'

class PlanSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
    onShowSideChange: PropTypes.func,
    changePlanStore:PropTypes.func,
    addPlanYear:PropTypes.string,
    addStationCodes:PropTypes.array
  };

  constructor(props){
    super(props);
    this.state={
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
    }

  }

  toSelectCondition = () => { // 返回选择时间/电站
    this.props.onShowSideChange({showSidePage:'add'});
  };


  onWarningTipShow = () => {
    this.setState({
      showWarningTip: true,
    })
  };
  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.props.changePlanStore({
      showPage: 'list',
    });

  };
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
  };

  savePlan = () => {// 保存
    console.log('save report info')

  }

  render(){
    const { addPlanYear,addStationCodes } = this.props;
    const {showWarningTip, warningTipText} = this.state;
    return (
      <div className={styles.editPlan}>
        {showWarningTip &&
        <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText}/>}
        <div className={styles.editPlanTitle} >
          <span className={styles.sideEidtTitleTip} >添加</span>
          <div className={styles.sideEditTitleRight} >
            <Button onClick={this.toSelectCondition} className={styles.addPlanPrev} >上一步</Button>
            <Button onClick={this.savePlan} className={styles.savePlan} >保存</Button>
            <Icon type="arrow-left" className={styles.backIcon}  onClick={this.onWarningTipShow} />
          </div>
        </div>
        <div className={styles.mainPart}>
          {/*<PlanAddTable {...this.props}/>*/}
        </div>
      </div>
    )
  }
}

export default PlanSide;
