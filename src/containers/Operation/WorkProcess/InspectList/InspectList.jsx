import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { inspectListAction } from './inspectListReducer';
import { commonAction } from '@containers/alphaRedux/commonAction';
import styles from './inspectList.scss';

class InspectList extends Component {

  static propTypes = {
    theme: PropTypes.string,
    history: PropTypes.object,
    location: PropTypes.object,
    resetStore: PropTypes.func,
  };

  componentDidMount() {

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
    const { pageLoading, theme = 'light' } = this.props;
    return (
      <div className={styles.cont}> 巡检页面</div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.inspectList.toJS(),
  stations: state.common.get('stations').toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: inspectListAction.resetStore }),
  changeStore: payload => dispatch({ type: inspectListAction.changeStore, payload }),

});

export default connect(mapStateToProps, mapDispatchToProps)(InspectList);
