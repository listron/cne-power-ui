import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {newInspectListAction} from './inspectListReducer';
import { commonAction } from '@containers/alphaRedux/commonAction';
import styles from './inspectList.scss';
import InspectSearch from '../../../../components/Operation/NewWorkProcess/Inspect/InspectSearch';
import InspectTable from '../../../../components/Operation/NewWorkProcess/Inspect/InspectTable';
import searchUtil from '@utils/searchUtil';

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
    const { history } = this.props;
    const { search } = history.location;
    const urlParams = searchUtil(search).parse(); //默认为缺陷列表页
    const urlParamsSerch = urlParams.listSearch && JSON.parse(urlParams.listSearch) || {}; // 判断从路由中过来的筛选条件
    getInspectList({
      ...params,
      ...urlParamsSerch,
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
  ...state.operation.newInspectList.toJS(),
  stations: state.common.get('stations').toJS(),
  deviceTypes: state.common.get('deviceTypes').toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: newInspectListAction.resetStore }),
  changeStore: payload => dispatch({ type: newInspectListAction.changeStore, payload }),
  getInspectList: payload => dispatch({ type: newInspectListAction.getInspectList, payload }),
  setInspectCheck: payload => dispatch({ type: newInspectListAction.setInspectCheck, payload }),

});

export default connect(mapStateToProps, mapDispatchToProps)(InspectList);
