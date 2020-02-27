import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './planSide.scss';
import { Button, Icon } from 'antd';
import WarningTip from '../../../../Common/WarningTip';
import PlanAddTable from './AddPlanTable';

class PlanSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
    onShowSideChange: PropTypes.func,
    changePlanStore: PropTypes.func,
    addPlanInfo: PropTypes.func,
    addPlanYear: PropTypes.string,
    addStationCodes: PropTypes.array,
    stationType: PropTypes.number,

  };

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '是否放弃当前的修改!',
      addValueChange: '', // 信息是否修改过
      leave: '', //判断离开之后返回到什么页面
      addSave: 'false', // 是否保存
      warningTipSaveText: '请先填写完整之后再保存',
      showSaveWarningTip: false,
      prev: 'false',
    };
  }

  onWarningTipShow = (name) => { // 上一步按钮
    this.setState({ prev: 'true', leave: name });
  };

  confirmWarningTip = () => { // 上一步
    this.setState({
      showWarningTip: false,
      prev: 'false',
    });
    this.state.leave === 'quit' ?
      this.props.changePlanStore({
        showPage: 'list',
        loading: false,
        planStations: [],
        addPlanYear: '',
        continueAdd: false,
        addStationCodes: [],
      }) :
      this.props.onShowSideChange({ showSidePage: 'add' });
  };

  cancelWarningTip = () => { // 上一步
    this.setState({
      showWarningTip: false,
      prev: 'false',
    });
  };

  save = () => { // 保存按钮
    this.setState({
      addSave: 'true',
    });
  };

  addPlanSave = (stations) => { // 保存数据判断
    const { stationType } = this.props;
    const continueSave = stations.every((list, index) => { //判断是否可以保存
      const pvSaveAddStation = list.yearPR && list.monthPower.length === 12;
      const windSaveAddStation = list.monthPower.length === 12;
      const saveAddStation = stationType === 0 ? windSaveAddStation : pvSaveAddStation;
      if (!saveAddStation) {
        return false;
      }
      let startIndex = 0;
      list.setGridTime ? startIndex = Number(list.setGridTime) - 1 : startIndex = 0;
      for (let i = startIndex; i < list.monthPower.length; i++) {
        if (list.monthPower[i] === '' || typeof (list.monthPower[i]) === 'undefined') {
          return false;
        }
      }
      return true;
    });
    if (continueSave) {
      const data = stations.map((list, index) => {
        const station = {};
        station.year = Number(list.planYear);
        station.monthPower = list.monthPower;
        station.planPower = list.planPower;
        station.yearPR = list.yearPR || null;
        station.stationCode = list.stationCode;
        return station;
      });
      this.setState({ addSave: 'false' });
      this.props.addPlanInfo({ 'data': data });
      this.props.changePlanStore({
        showPage: 'list',
        addPlanYear: '', //计划生产的年份
        addStationCodes: [], // 计划生产的电站
      });
    } else {
      this.setState({
        addSave: 'false',
        showSaveWarningTip: true,
      });
    }
  };

  saveWarningTip = () => { // 保存按钮的提示
    this.setState({
      showSaveWarningTip: false,
    });
  };

  addValueChange = (stations) => { // 是否添加新的数据
    if (stations.some(e => e.eddit === 'true')) {
      this.setState({
        showWarningTip: true,
        prev: 'flase',
      });
    } else {
      this.state.leave === 'quit' ?
        this.props.changePlanStore({
          showPage: 'list',
          loading: false,
          planStations: [],
          addPlanYear: '',
          continueAdd: false,
          addStationCodes: [],
        }) :
        this.props.onShowSideChange({ showSidePage: 'add' });
    }
  }

  render() {
    const { showWarningTip, warningTipText, addSave, warningTipSaveText, showSaveWarningTip, prev } = this.state;
    const { addStationCodes } = this.props;
    return (
      <div className={styles.editPlan}>
        {showWarningTip &&
          <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        {showSaveWarningTip && <WarningTip onOK={this.saveWarningTip} value={warningTipSaveText} />}
        <div className={styles.editPlanTitle}>
          <span className={styles.sideEidtTitleTip}>添加</span>
          <div className={styles.sideEditTitleRight}>
            <Button onClick={() => {
              this.onWarningTipShow('prev');
            }} className={styles.addPlanPrev}>上一步</Button>
            <Button onClick={this.save} className={styles.savePlan}>保存</Button>
            <i className={`iconfont icon-fanhui ${styles.backIcon}`} onClick={() => { this.onWarningTipShow('quit'); }} />
          </div>
        </div>
        <div className={styles.mainPart}>
          <div className={styles.mainPartTop}>
            <p>新添加<span>{addStationCodes.length}</span>条</p>
          </div>
          <PlanAddTable
            addValueChange={this.addValueChange}
            save={addSave}
            prev={prev}
            addplansave={this.addPlanSave}
            {...this.props}
          />
        </div>
      </div>
    );
  }
}

export default PlanSide;
