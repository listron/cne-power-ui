import React, { Component } from "react";
import styles from "./plan.scss";
import { connect } from 'react-redux';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import CommonBreadcrumb from "../../../../components/Common/CommonBreadcrumb";
import PlanMain from '../../../../components/System/Production/Plan/PlanMain/PlanMain';
import PlanSide from '../../../../components/System/Production/Plan/PlanSide/PlanSide';
import PropTypes from 'prop-types';
import { planAction } from './planAction';
import { commonAction } from "../../../alphaRedux/commonAction";


class Plan extends Component {
  // 属性的限制
  static propTypes = {
    showPage: PropTypes.string,
    sort: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    stationCodes: PropTypes.array,
    sortField: PropTypes.string,
    planYear: PropTypes.any,
    sortMethod: PropTypes.string,
    changePlanStore: PropTypes.func,
    getPlanList: PropTypes.func,
    editPlanInfo: PropTypes.func,
    getStations: PropTypes.func,
    getYearList: PropTypes.func,
    resetStore: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      showSidePage: 'list'
    }
  }

  componentWillMount() {
    this.props.getYearList();
  }

  componentDidMount() {
    this.props.getStations(); // 导入电站之后，需要重新加载一次
  }

  componentWillUnmount() {
    this.props.resetStore()
  }
  onShowSideChange = ({ showSidePage }) => {
    this.setState({ showSidePage });
  };
  onToggleSide = () => {
    const { showPage } = this.props;
    this.setState({
      showSidePage: showPage
    });
  };
  render() {
    const { showPage } = this.props;
    const { showSidePage } = this.state;
    return (
      <div className={styles.planContainerBox}>
        <CommonBreadcrumb breadData={[{ name: '生产计划', }]} style={{ marginLeft: '38px' }} />
        <div className={styles.planContainer}>
          <PlanMain {...this.props} onWarningTipToggle={this.onWarningTipToggle} />
          <TransitionContainer
            show={showPage !== 'list'}
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
  changePlanStore: payload => dispatch({ type: planAction.changePlanStore, payload }),
  getYearList: payload => dispatch({ type: planAction.getYearList, payload }),
  getPlanList: payload => dispatch({ type: planAction.getPlanList, payload }),
  editPlanInfo: payload => dispatch({ type: planAction.editPlanInfo, payload }),
  getStations: payload => dispatch({ type: commonAction.getStations, payload }),
  getOwnStations: payload => dispatch({ type: planAction.getOwnStations, payload }),
  addPlanInfo: payload => dispatch({ type: planAction.addPlanInfo, payload }),
  resetStore: payload => dispatch({ type: planAction.resetStore, payload }),
  importFile: payload => dispatch({ type: planAction.importFile, payload }),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile, payload: {
      ...payload,
      actionName: planAction.changePlanStore,
    }
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Plan);
