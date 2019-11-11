import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { defectListAction } from './defectListReducer';
import { commonAction } from '@containers/alphaRedux/commonAction';
import styles from './defectList.scss';
import { Button } from 'antd';

import DefectSearch from '@components/Operation/WorkProcess/Defect/DefectSearch';
import DefectTableList from '@components/Operation/WorkProcess/Defect/DefectTableList';

class DefectList extends Component {

  static propTypes = {
    theme: PropTypes.string,
    location: PropTypes.object,
    history: PropTypes.object,
    resetStore: PropTypes.func,
  };

  componentDidMount() {
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
    this.props.changeStore({ name: 'tcl' });
    history.push(`${pathname}?page=defectDetail`);
  }


  render() {
    const { pageLoading, theme = 'light' } = this.props;
    return (
      <div className={styles.cont}>
        缺陷页面
        <DefectSearch {...this.props} />
        <DefectTableList {...this.props} />
        <Button onClick={this.detail}> 进入详情页面</Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    ...state.operation.defectList.toJS(),
    stations: state.common.get('stations').toJS(),
    theme: state.common.get('theme'),
  });
};

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: defectListAction.resetStore }),
  changeStore: payload => dispatch({ type: defectListAction.changeStore, payload }),

});

export default connect(mapStateToProps, mapDispatchToProps)(DefectList);
