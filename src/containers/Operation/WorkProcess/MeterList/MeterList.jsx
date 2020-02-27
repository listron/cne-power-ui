import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { meterListAction } from './meterListReducer';
import MeterSearch from '@components/Operation/WorkProcess/Meter/MeterSearch';
import MeterTable from '@components/Operation/WorkProcess/Meter/MeterTable';
import searchUtil from '@utils/searchUtil';
import styles from './meterList.scss';

class MeterList extends Component {

  static propTypes = {
    theme: PropTypes.string,
    history: PropTypes.object,
    location: PropTypes.object,
    resetStore: PropTypes.func,
    getMeterList: PropTypes.func,
    getParticipant: PropTypes.func,
    listParams: PropTypes.object,
  };

  componentDidMount() {
    const { getMeterList, listParams, getParticipant } = this.props;
    const { history } = this.props;
    const { search } = history.location;
    const { listSearch, params } = searchUtil(search).parse(); // 抄表列表页
    const urlParamsSearch = listSearch && JSON.parse(listSearch) || {}; // 判断从路由中过来的筛选条件
    const paramsSearch = params && JSON.parse(params) || {}; // 判断从详情页中过来的筛选条件
    // 列表查询参数
    const listSearchParams = paramsSearch.listParams ? {
      ...listParams,
      ...urlParamsSearch,
      ...paramsSearch.listParams,
    } : {
      ...listParams,
      ...urlParamsSearch,
    };
    // 调用抄表列表页
    getMeterList(listSearchParams);
    // 获取所有执行人列表
    getParticipant();
  }

  componentWillUnmount() { // 卸载的时候要注意
    const { history, location, resetStore } = this.props;
    const { pathname } = history.location;
    const historyPathname = location.pathname;
    if (pathname !== historyPathname) { // 判断如果 从当前的页面跳到其他页面 则需要清空路由
      resetStore();
    }
  }

  render() {
    const { theme = 'light' } = this.props;
    return (
      <div className={`${styles.meterBox} ${theme}`}>
        <MeterSearch {...this.props} />
        <MeterTable {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.meterList.toJS(),
  stations: state.common.get('stations').toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: meterListAction.resetStore }),
  changeStore: payload => dispatch({ type: meterListAction.changeStore, payload }),
  getMeterList: payload => dispatch({ type: meterListAction.getMeterList, payload }),
  getParticipant: payload => dispatch({ type: meterListAction.getParticipant, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MeterList);
