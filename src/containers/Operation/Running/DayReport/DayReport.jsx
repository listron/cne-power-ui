import React, { Component } from 'react';
import { connect } from 'react-redux';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import DayReportMainList from '../../../../components/Operation/Running/DayReport/DayReportMainList';
import DayReportSide from '../../../../components/Operation/Running/DayReport/DayReportSide';
import { dayReportAction } from './dayReportAction';
import { commonAction } from '../../../alphaRedux/commonAction';
import PropTypes from 'prop-types';
import styles from './dayReport.scss';
import Cookie from 'js-cookie';
import moment from 'moment';

class DayReport extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    startTime: PropTypes.string, // 日报查询月,
    enterpriseId: PropTypes.string,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    stationType: PropTypes.number, // 筛选的电站类型
    stationNameSort: PropTypes.number, // 排序方式
    getDayReportList: PropTypes.func, // 日报列表
    getDayReportConfig: PropTypes.func, // 日报配置
    toChangeDayReportStore: PropTypes.func,
    resetStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      sidePage: 'report',
    };
  }

  componentDidMount(){
    this.props.getDayReportList({
      startTime: moment().format('YYYY-MM'),
      pageSize: 10,
      pageNum: 1,
      stationType: 2, // 筛选的电站类型
      stationNameSort: 0, // 排序方式
    });
    this.props.getDayReportConfig({ // 请求上报日报配置信息
      enterpriseId: this.props.enterpriseId,
      module: 'report',
      type: '-1',
    });
  }

  componentWillUnmount(){
    this.props.resetStore();
  }

  onSidePageChange = ({ sidePage }) => {
    this.setState({ sidePage });
  }

  onToggleSide = () => {
    const { showPage } = this.props;
    this.setState({ sidePage: showPage });
  }

  render() {
    const { showPage } = this.props;
    const { sidePage } = this.state;
    return (
      <div className={styles.dayReport}>
        <div className={styles.dayReportContainer} >
          <DayReportMainList {...this.props} />
          <TransitionContainer
            show={showPage !== 'list'}
            onEnter={this.onToggleSide}
            onExited={this.onToggleSide}
            timeout={500}
            effect="side"
          >
            <DayReportSide {...this.props} sidePage={sidePage} onSidePageChange={this.onSidePageChange} />
          </TransitionContainer>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.dayReport.toJS(),
  stations: state.common.get('stations').toJS(),
  enterpriseId: Cookie.get('enterpriseId'),
  userId: Cookie.get('userId'),
});

const mapDispatchToProps = (dispatch) => ({
  toChangeDayReportStore: payload => dispatch({type: dayReportAction.toChangeDayReportStore, payload}),
  resetStore: () => dispatch({ type: dayReportAction.resetStore }),
  getDayReportList: payload => dispatch({type: dayReportAction.getDayReportList, payload}),
  getDayReportConfig: payload => dispatch({type: dayReportAction.getDayReportConfig, payload}),
  getStationBaseReport: payload => dispatch({type: dayReportAction.getStationBaseReport, payload}),
  getReportUploadedStation: payload => dispatch({type: dayReportAction.getReportUploadedStation, payload}),
  uploadDayReport: payload => dispatch({ type: dayReportAction.uploadDayReport, payload}),
  dayReportDetail: payload => dispatch({type: dayReportAction.dayReportDetail, payload}),
  dayReportUpdate: payload => dispatch({type: dayReportAction.dayReportUpdate, payload}),
  getStationDeviceTypes: params => dispatch({
    type: commonAction.getStationDeviceTypes,
    payload: {
      params,
      deviceTypeAction: dayReportAction.dayReportFetchSuccess,
      resultName: 'stationDeviceTypes',
    },
  }),
  findDeviceExist: params => dispatch({
    type: commonAction.findDeviceExist,
    payload: {
      params,
      actionName: dayReportAction.changeDayReportStore,
      resultName: 'deviceExistInfo',
    },
  }),
  getLostGenType: params => dispatch({
    type: commonAction.getLostGenType,
    payload: {
      params,
      actionName: dayReportAction.dayReportFetchSuccess,
      resultName: 'lostGenTypes',
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DayReport);
