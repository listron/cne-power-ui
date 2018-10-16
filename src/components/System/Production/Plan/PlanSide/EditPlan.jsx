import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './planSide.scss';
import {Input, Button, DatePicker, Icon, Select, Form} from 'antd';
import WarningTip from '../../../../Common/WarningTip';
import PlanAddTable from './PlanAddTable'

class PlanSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
    onShowSideChange: PropTypes.func,
    changePlanStore: PropTypes.func,
    addPlanInfo: PropTypes.func,
    addPlanYear: PropTypes.string,
    addStationCodes: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
      addValueChange: '', // 信息是否修改过
      leave: '', //判断离开之后返回到什么页面
      addSave: 'false' // 是否保存
    }

  }

  onWarningTipShow = (name) => {
    if (this.state.addValueChange === "change") {
      this.setState({
        showWarningTip: true,
        leave: name
      })
    } else {
      name === 'quit' ? this.props.changePlanStore({showPage: 'list'}) : this.props.onShowSideChange({showSidePage: 'add'});
    }
  };

  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.state.leave === 'quit' ? this.props.changePlanStore({showPage: 'list'}) : this.props.onShowSideChange({showSidePage: 'add'});
  };
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
  };

  save = () => {
    this.setState({
      addSave: 'true'
    })
  };

  addPlanSave = (stations) => { // 保存数据判断
    let continueAdd = stations.every((list, index) => { //判断是否可以保存
      let saveAddStation = list.yearPR && list.monthPower.length === 12;
      if (!saveAddStation) {
        　return false;
      }
      let startIndex = 0;
      list.onGridTime ? startIndex = Number(list.onGridTime) : startIndex = 0;
      for (let i = startIndex; i < list.monthPower.length; i++) {
        if (list.monthPower[i] === "" || typeof(list.monthPower[i]) === "undefined") {
         return false
        }else{
          return true
        }
      }
    });

    if(continueAdd){
     let data= stations.map((list,index)=>{
        let station = {};
        station.year = Number(list.planYear);
        station.monthPower = list.monthPower;
        station.planPower = list.planPower;
        station.yearPR = list.yearPR;
        station.stationCode = list.stationCode;
        return station
      });
      this.setState({addSave:'false'})
      this.props.addPlanInfo({"data": data})
      // this.props.changePlanStore({showPage: 'list'})
    }else{

      alert(" 请先填写完整之后再保存")
      this.setState({
        addSave:'false',
        // warningTipText:"请先填写完整之后再保存",
        // showWarningTip:true,
      })

    }


  };


  addValueChange = (e) => {
    this.setState({
      addValueChange: e
    })
  };

  render() {
    const {addPlanYear, addStationCodes} = this.props;
    const {showWarningTip, warningTipText, addSave} = this.state;
    return (
      <div className={styles.editPlan}>
        {showWarningTip &&
        <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText}/>}

        {/*{}*/}
        <div className={styles.editPlanTitle}>
          <span className={styles.sideEidtTitleTip}>添加</span>
          <div className={styles.sideEditTitleRight}>
            <Button onClick={() => {
              this.onWarningTipShow("prev")
            }} className={styles.addPlanPrev}>上一步</Button>
            <Button onClick={this.save} className={styles.savePlan}>保存</Button>
            <Icon type="arrow-left" className={styles.backIcon} onClick={() => {
              this.onWarningTipShow("quit")
            }}/>
          </div>
        </div>
        <div className={styles.mainPart}>
          <PlanAddTable
            addValueChange={this.addValueChange}
            save={addSave}
            addplansave={this.addPlanSave}
            {...this.props}
          />
        </div>
      </div>
    )
  }
}

export default PlanSide;
