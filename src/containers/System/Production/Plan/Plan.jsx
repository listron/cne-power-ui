import React, {Component} from "react";
import styles from "./plan.scss";
import {connect} from 'react-redux';
import {Button, Table, Icon} from 'antd';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import CommonBreadcrumb from "../../../../components/Common/CommonBreadcrumb";
import PlanMain from '../../../../components/System/Production/Plan/PlanMain/PlanMain';
import PlanSide from '../../../../components/System/Production/Plan/PlanSide/PlanSide';

import PropTypes from 'prop-types';
import {planAction} from './planAction';
import {commonAction} from "../../../alphaRedux/commonAction";


class Plan extends Component {
  // 属性的限制
  static propTypes = {
    showPage: PropTypes.string,
    sort: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    stationCodes:PropTypes.array,
    sortField:PropTypes.string,
    planYear:PropTypes.number,
    sortMethod:PropTypes.string,
    changePlanStore:PropTypes.func,
    getPlanList: PropTypes.func,
    editPlanInfo: PropTypes.func,
    getStations: PropTypes.func,

  };

  constructor(props) {
    super(props);
    this.state = {
      showSidePage: 'list'
    }
  }

  onShowSideChange = ({ showSidePage }) => {
    this.setState({ showSidePage });
  }
  onToggleSide = () => {
    const { showPage } = this.props;
    this.setState({
      showSidePage: showPage
    });
  }

  componentDidMount() {
    const params = {
      year: this.props.planYear || new Date().getFullYear(), // 年份 默认是当前年
      stationCodes: this.props.stationCodes, // 电站编码
      sortField: this.props.sortField, // 1:区域 2：电站名称 3:装机容量 4:年份 5: 年计划发电量
      sortMethod: this.props.sortMethod, //排序 => 'field,0/1'field代表排序字段，0升序,1降序
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize,
    };
    this.props.getPlanList(params)
  }

  componentWillUnmount() {
    this.props.changePlanStore({
      showPage: 'list',
      sortField:'',
      sortMethod:'',
      pageNum: 1,//当前页号
      pageSize: 10,//每页容纳条数
      year: '', // 选择年份 默认当前年
      stationCodes: null,
    });
  }



  render() {
    const { showPage } = this.props;
    const { showSidePage } = this.state;
    const breadCrumbData = {
      breadData: [{name: '生产计划',}],
    };
    return (
      <div className={styles.planContainerBox}>
        <CommonBreadcrumb  {...breadCrumbData} style={{marginLeft: '38px'}}/>
        <div className={styles.planContainer}>
          <PlanMain {...this.props} onWarningTipToggle={this.onWarningTipToggle}/>
          <TransitionContainer
            show={showPage  !== 'list'}
            // show={true}
            onEnter={this.onToggleSide}
            onExited={this.onToggleSide}
            timeout={500}
            effect="side"
          >
            <PlanSide {...this.props} showSidePage={showSidePage} onShowSideChange={this.onShowSideChange} />
          </TransitionContainer>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  ...state.system.plan.toJS(),
  stations: state.common.get('stations'),
});

const mapDispatchToProps = (dispatch) => ({
  changePlanStore: payload => dispatch({type: planAction.changePlanStore, payload}),
  getPlanList: payload => dispatch({type: planAction.getPlanList, payload}),
  editPlanInfo: payload => dispatch({type: planAction.editPlanInfo, payload}),
  getStations: payload => dispatch({ type: commonAction.getStations, payload }),
  getOwnStations: payload => dispatch({ type: planAction.getOwnStations, payload }),
  addPlanInfo: payload => dispatch({ type: planAction.addPlanInfo, payload }),


});

export default connect(mapStateToProps, mapDispatchToProps)(Plan);
