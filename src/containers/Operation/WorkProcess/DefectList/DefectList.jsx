import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { defectListAction } from './defectListReducer';
import { commonAction } from '@containers/alphaRedux/commonAction';
import styles from './defectList.scss';
import { Button } from 'antd';
import searchUtil from '@utils/searchUtil';
import DefectSearch from '@components/Operation/WorkProcess/Defect/DefectSearch';
import DefectTableList from '@components/Operation/WorkProcess/Defect/DefectTableList';

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
    const { getDefectList, getParticipant, getLostGenType, listParams } = this.props;
    const { history } = this.props;
    const { search, pathname } = history.location;
    const urlParams = searchUtil(search).parse(); //默认为缺陷列表页
    const urlParamsSerch = urlParams.listSearch && JSON.parse(urlParams.listSearch) || {}; // 判断从路由中过来的筛选条件
    getLostGenType({ objectType: 1 }); //获取所有损失缺陷类型
    getDefectList({ ...listParams, ...urlParamsSerch }); // 获取消缺列表
    getParticipant(); //  获取所有参与者。
  }


  componentWillReceiveProps() {

  }


  componentWillUnmount() { // 卸载的时候要注意
    const { history, location } = this.props;
    const { pathname } = history.location;
    const historyPathname = location.pathname;
    if (pathname !== historyPathname) { // 判断如果 从当前的页面跳到其他页面 则需要清空路由
      this.props.resetStore();
    }
  }

  detail = () => { // 进入详情页面
    const { location, history } = this.props;
    const { pathname } = location;
    history.push(`${pathname}?page=defectDetail`);
  }


  render() {
    const { pageLoading, theme = 'light' } = this.props;
    return (
      <div className={styles.cont}>
        <DefectSearch {...this.props} />
        <DefectTableList {...this.props} />
        {/* <Button onClick={this.detail}> 进入详情页面</Button> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    ...state.operation.defectList.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
    username: state.common.get('username'),
    theme: state.common.get('theme'),
  });
};

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: defectListAction.resetStore }),
  changeStore: payload => dispatch({ type: defectListAction.changeStore, payload }),
  getDefectList: payload => dispatch({ type: defectListAction.getDefectList, payload }),
  getParticipant: payload => dispatch({ type: defectListAction.getParticipant, payload }),
  getLostGenType: params => dispatch({ // 获取缺陷类型
    type: commonAction.getLostGenType,
    payload: {
      params,
      actionName: defectListAction.changeStore,
      resultName: 'defectTypes',
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefectList);
