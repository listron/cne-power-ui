import React, { Component } from 'react';
import { Button, Icon, Select, Form } from 'antd';
import moment from 'moment';
import StationSelect from '../../../../Common/StationSelect';
import PropTypes from 'prop-types';
import styles from './planSide.scss';
import CneButton from '@components/Common/Power/CneButton';
const Option = Select.Option;

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
  }


  onWarningTipShow = () => {
    this.props.changePlanStore({
      showPage: 'list',
      loading: false,
      planStations: [],
      addPlanYear: '',
      continueAdd: false,
      addStationCodes: [],
    });
  };

  selectTime = (value) => {
    this.props.getOwnStations({
      planYear: value,
    });
    this.props.changePlanStore({
      addPlanYear: value,
    });
    this.props.getStations(); //  重新请求电站列表
  };

  selectStation = (stations) => {
    this.props.changePlanStore({
      addStationCodes: stations,
      stationType: stations.length > 0 && stations[0].stationType,
    });
  };


  toPlanStations = () => {
    this.props.onShowSideChange({ showSidePage: 'edit' });
  };

  render() {
    const { continueAdd, addPlanYear, addStationCodes, planStations } = this.props;
    const canAdd = addPlanYear && addStationCodes && addStationCodes.length > 0;
    const currentYear = moment().year();
    const year = [currentYear + 1, currentYear];
    return (
      <div className={styles.addPlan}>
        <div className={styles.editTop}>
          <span className={styles.text}>添加</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.onWarningTipShow} />
        </div>
        <div className={styles.mainPart}>
          <div className={styles.selectTime}>
            <span><i>*</i>年份填写</span>
            <Select style={{ width: 105 }} onChange={this.selectTime} value={addPlanYear || '--'}>
              {year.map((year) => {
                return <Option value={`${year}`} key={year}>{`${year}`}</Option>;
              })}
            </Select>
          </div>
          <div className={styles.selectStation}>
            <span><i>*</i>电站选择</span>
            <StationSelect
              value={addStationCodes}
              data={planStations}
              multiple={true}
              onChange={this.selectStation}
              disabled={continueAdd ? false : true}
              oneStyleOnly={true}
            />
            <CneButton onClick={this.toPlanStations} disabled={!canAdd}
              className={canAdd ? styles.addPlanNext : styles.addPlanNextDisabled}>下一步</CneButton>
          </div>
        </div>
      </div>
    );
  }
}


export default Form.create({})(AddPlan);
