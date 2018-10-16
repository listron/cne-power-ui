import React, {Component} from 'react';
import {Input, Button, DatePicker, Icon, Select, Form} from 'antd';
import moment from 'moment';
import StationSelect from '../../../../Common/StationSelect';
import PropTypes from 'prop-types';
import styles from './planSide.scss';
import WarningTip from '../../../../Common/WarningTip';
// const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;
const FormItem = Form.Item;

class AddPlan extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
    changePlanStore: PropTypes.func,
    planStations: PropTypes.array,
    form: PropTypes.object,
    getStations: PropTypes.func,
    getOwnStations: PropTypes.func,
    onShowSideChange: PropTypes.func,
    continueAdd: PropTypes.bool,
    stations: PropTypes.object,
    addPlanYear: PropTypes.string,
    addStationCodes: PropTypes.array,

  };

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
      open: false,
      dateValue: '2018',
    }

  }
  componentWillReceiveProps(nextProps) {
  }

  // componentWillUnmount(){
  //   this.props.changePlanStore({
  //     planStations:[],
  //     addPlanYear:'',
  //     addStationCodes:[],
  //   })
  // }

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
      loading:false,
      planStations:[],
      addPlanYear:'',
      continueAdd:false,
      addStationCodes:[],
    });

  };
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
  };


  selectTime = (value) => {
    this.props.getOwnStations({
      planYear: value
    });
    this.props.changePlanStore({
      addPlanYear: value
    })
  };
  selectStation = (stations) => {
    this.props.changePlanStore({
      addStationCodes: stations
    })
  };
  toPlanStations = () => {
    this.props.onShowSideChange({showSidePage: 'edit'});
  };

  render() {
    const {showWarningTip, warningTipText} = this.state;
    const {planStations, stations, continueAdd, addPlanYear, addStationCodes} = this.props;
    const canAdd = addPlanYear && addStationCodes && addStationCodes.length > 0;
    const currentYear = new Date().getFullYear();
    let year = [currentYear + 1, currentYear];
    return (
      <div className={styles.addPlan}>
        {showWarningTip &&
        <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText}/>}
        <div className={styles.editTop}>
          <span className={styles.text}>添加</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow}/>
        </div>
        <div className={styles.mainPart}>
          <div className={styles.selectTime}>
            <span><i>*</i>年份填写</span>
            <Select style={{width: 105}} onChange={this.selectTime} value={addPlanYear || '--'}>
              {year.map((year) => {
                return <Option value={String(year)} key={year}>{year}</Option>
              })}
            </Select>
          </div>
          <div className={styles.selectStation}>
            <span><i>*</i>电站选择</span>
            <StationSelect
              value={addStationCodes}
              data={stations.toJS()}
              multiple={true}
              onChange={this.selectStation}
              disabled={continueAdd ? false : true}
              disabledStation={planStations}
            />
            <Button onClick={this.toPlanStations} disabled={!canAdd}
                    className={canAdd ? styles.addPlanNext : styles.addPlanNextDisabled}>下一步</Button>
          </div>
        </div>
      </div>
    )
  }
}


export default Form.create({})(AddPlan);
