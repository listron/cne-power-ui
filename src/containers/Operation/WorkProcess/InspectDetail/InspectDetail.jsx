import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { inspectDetailAction } from './inspectDetailReducer';

import InspectBaseInfo from '../../../../components/Operation/WorkProcess/InspectDetail/InspectBaseInfo';
import InspectProcess from '../../../../components/Operation/WorkProcess/InspectDetail/InspectProcess';
import { Icon } from 'antd';
import searchUtil from '@utils/searchUtil';
import styles from './inspectDetail.scss';

class InspectDetail extends Component {

  static propTypes = {
    theme: PropTypes.string,
    history: PropTypes.object,
    location: PropTypes.object,
    resetStore: PropTypes.func,
    getInspectDetail: PropTypes.func,
  };
  constructor() {
    super();

  }

  componentDidMount() {
    const { history, getInspectDetail } = this.props;
    const { search } = history.location;
    const { page = 'inspectDetail', inspectId } = searchUtil(search).parse(); //默认为缺陷列表页
    getInspectDetail({
      inspectId,
    });
  }


  componentWillUnmount() {
    const { history, location, resetStore } = this.props;
    const { pathname } = history.location;
    const historyPathname = location.pathname;
    if (pathname !== historyPathname) { // 判断如果 从当前的页面跳到其他页面 则需要清空路由
      resetStore();
    }
  }

  onCancelEdit = () => {
    const { location, history } = this.props;
    const { pathname } = location;
    history.push(`${pathname}?page=list&tab=inspect`);
    // history.go(-1);
  }



  render() {
    const { theme = 'light' } = this.props;

    return (
      <div className={`${styles.inspectDetailBox} ${theme}`}>
        <div className={styles.header}>
          <div className={styles.text}>巡检详情</div>
          <div className={styles.arrowBox}>
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.leftContent}>
            <InspectBaseInfo {...this.props} />
          </div>
          <div className={styles.rightContent}>
            <InspectProcess {...this.props} />
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.inspectDetail.toJS(),
  deviceTypes: state.common.get('deviceTypes').toJS(),
  stations: state.common.get('stations').toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: inspectDetailAction.resetStore }),
  changeStore: payload => dispatch({ type: inspectDetailAction.changeStore, payload }),
  getInspectDetail: payload => dispatch({ type: inspectDetailAction.getInspectDetail, payload }),
  setInspectCheck: payload => dispatch({ type: inspectDetailAction.setInspectCheck, payload }),

});

export default connect(mapStateToProps, mapDispatchToProps)(InspectDetail);
