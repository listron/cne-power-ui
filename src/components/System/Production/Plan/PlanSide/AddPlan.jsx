
import React, { Component } from 'react';
import { Input, Button ,DatePicker,Icon} from 'antd';
import moment from 'moment';
import StationSelect from '../../../../Common/StationSelect';
import PropTypes from 'prop-types';
import styles from './planSide.scss';
import WarningTip from '../../../../Common/WarningTip';
const { MonthPicker, RangePicker } = DatePicker;

class PlanSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
    changePlanStore: PropTypes.func,
    planStations:PropTypes.array,
  };

  constructor(props){
    super(props);
    this.state={
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
      open:false,
      dateValue:'2018',
    }

  }

  onWarningTipShow = () =>{
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


  onPanelChange=(value,mode)=>{
    let data=new Date(value._d).getFullYear()
    this.setState({open:false,dateValue:data})
  };

  onOpenChange=()=>{
    this.setState({open:true})
  };

  disabledEndDate = (endValue) => {
    // const startValue = this.state.startValue;
    // if (!endValue || !startValue) {
    //   return false;
    // }
    // return endValue.valueOf() <= startValue.valueOf();
  }

  render(){
    const { showWarningTip, warningTipText } = this.state;
    const {planStations,stations}= this.props;
    const canAddPlan = true ;
    const dateFormat = 'YYYY';
    return (
      <div className={styles.addPlan}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.editTop}>
          <span className={styles.text}>添加</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow} />
        </div>
        <div className={styles.mainPart}>
          <div>
            <span className={styles.year}>年份填写</span>
            <DatePicker
              format={dateFormat}
              mode='year'
              open={this.state.open}
              focus={this.focus}
              value={moment(this.state.dateValue, dateFormat)}
              onOpenChange={this.onOpenChange}
              placeholder="--"
              disabledDate={this.disabledStartDate}
              onPanelChange={(value,mode)=>(this.onPanelChange(value,mode))}
              />
          </div>
          <div className={styles.topLeft}>
            <span className={styles.station}>电站选择</span>
            <StationSelect
              // value={stations}
              data={stations.toJS()}
              multiple={true}
              onChange={this.stationSelected}
              disabled={planStations}
            />
            <Button onClick={this.toReportStations} disabled={!canAddPlan} className={styles.btn}>下一步</Button>
          </div>
        </div>

      </div>
    )
  }
}

export default PlanSide;
