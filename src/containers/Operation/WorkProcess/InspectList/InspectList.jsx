import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { inspectListAction } from './inspectListReducer';
import { commonAction } from '@containers/alphaRedux/commonAction';
import styles from './inspectList.scss';
import InspectSearch from '../../../../components/Operation/WorkProcess/Inspect/InspectSearch';
import InspectTable from '../../../../components/Operation/WorkProcess/Inspect/InspectTable';

class InspectList extends Component {

  static propTypes = {
    theme: PropTypes.string,
    history: PropTypes.object,
    location: PropTypes.object,
    resetStore: PropTypes.func,
    getInspectList: PropTypes.func,
    stationType: PropTypes.string,
    stationCodes: PropTypes.string,
    timeInterval: PropTypes.string,
    status: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    sort: PropTypes.string,
    params: PropTypes.object,

  };

  componentDidMount() {
    const { getInspectList, params } = this.props;
    getInspectList({
      ...params,
    });
  }
  componentWillUnmount() { // 卸载的时候要注意
    const { history, location } = this.props;
    const { pathname } = history.location;
    const historyPathname = location.pathname;
    if (pathname !== historyPathname) { // 判断如果 从当前的页面跳到其他页面 则需要清空路由
      this.props.resetStore();
    }
  }

  render() {
    const { theme = 'light' } = this.props;
    return (
      <div className={`${styles.inspectBox} ${theme}`}>
        <InspectSearch {...this.props} />
        <InspectTable {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.inspectList.toJS(),
  stations: state.common.get('stations').toJS(),
  deviceTypes: state.common.get('deviceTypes').toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: inspectListAction.resetStore }),
  changeStore: payload => dispatch({ type: inspectListAction.changeStore, payload }),
  getInspectList: payload => dispatch({ type: inspectListAction.getInspectList, payload }),
  setInspectCheck: payload => dispatch({ type: inspectListAction.setInspectCheck, payload }),

});

export default connect(mapStateToProps, mapDispatchToProps)(InspectList);
