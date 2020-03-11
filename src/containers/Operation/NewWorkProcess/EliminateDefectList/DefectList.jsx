import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { eliminateDefectListAction } from './defectListReducer';
import { commonAction } from '@containers/alphaRedux/commonAction';
import styles from './defectList.scss';
import { Button } from 'antd';
import searchUtil from '@utils/searchUtil';
import DefectSearch from '@components/Operation/NewWorkProcess/EliminateDefectList/DefectSearch';
import DefectsHandler from '@components/Operation/NewWorkProcess/EliminateDefectList/DefectsHandler';
import DefectTable from '@components/Operation/NewWorkProcess/EliminateDefectList/DefectTable';

/**
 * 直接跳转进来的从路径上修改
 * history.push(`/operation/workProcess/view?page=list&tab=defect&listSearch=${JSON.stringify({stationCodes:[77,95], stationType:1 })}`);
 * @ page 代表的是当前页面  list 列表页 defectDetail 消缺详情 inspectDeatail 巡检详情
 * @ tab  defect 指的是缺陷 inspect 巡检的列表页
 * @ listSearch 列表页面需要的参数 例如 stationCodes 电站 stationType 电站类型 等等，可以传递的参数根绝筛选条件 格式请按照上述格式进行传递 否则解析不了
 */
class DefectList extends Component {

  static propTypes = {
    theme: PropTypes.string,
    location: PropTypes.object,
    history: PropTypes.object,
    resetStore: PropTypes.func,
    getLostGenType: PropTypes.func,
    getDeviceTypes: PropTypes.func,
    getDefectList: PropTypes.func,
    getParticipant: PropTypes.func,
    listParams: PropTypes.object,
  };


  componentDidMount() {
    const { getDefectList, getParticipant, listParams } = this.props;
    const { history } = this.props;
    const { search } = history.location;
    const urlParams = searchUtil(search).parse(); //默认为缺陷列表页
    const urlParamsSerch = urlParams.listSearch && JSON.parse(urlParams.listSearch) || {}; // 判断从路由中过来的筛选条件
    // getDefectList({ ...listParams, ...urlParamsSerch }); // 获取消缺列表
    // getParticipant(); //  获取所有参与者。
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
    const { theme } = this.props;
    return (
      <div className={`${styles.cont} ${styles[theme]}`}>
        <DefectSearch {...this.props} />
        <DefectsHandler {...this.props} />
        <DefectTable />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    ...state.operation.eliminateDefectList.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
    username: state.common.get('username'),
    theme: 'light',
  });
};

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: eliminateDefectListAction.resetStore }),
  changeStore: payload => dispatch({ type: eliminateDefectListAction.changeStore, payload }),
  getDefectList: payload => dispatch({ type: eliminateDefectListAction.getDefectList, payload }),
  getParticipant: payload => dispatch({ type: eliminateDefectListAction.getParticipant, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectList);
