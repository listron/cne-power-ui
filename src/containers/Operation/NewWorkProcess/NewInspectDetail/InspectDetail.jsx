import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import {newInspectDetailAction} from './inspectDetailReducer';

import InspectBaseInfo from '../../../../components/Operation/NewWorkProcess/InspectDetail/InspectBaseInfo';
import InspectProcess from '../../../../components/Operation/NewWorkProcess/InspectDetail/InspectProcess';
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
    loading: PropTypes.bool,

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
    const { resetStore } = this.props;
    resetStore();
  }

  onCancelEdit = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}?page=list&tab=inspect`);
  }



  render() {
    const { theme = 'light', loading } = this.props;

    return (
      <div className={`${styles.inspectDetailBox} ${theme}`}>
        <div className={styles.header}>
          <div className={styles.text}>巡检详情</div>
          <div className={styles.arrowBox}>
            <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
          </div>
        </div>
        <Spin spinning={loading}>
          <div className={styles.content}>
            <div className={styles.leftContent}>
              <InspectBaseInfo {...this.props} />
            </div>
            <div className={styles.rightContent}>
              <InspectProcess {...this.props} />
            </div>
          </div>
        </Spin>

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.newInspectDetail.toJS(),
  deviceTypes: state.common.get('deviceTypes').toJS(),
  stations: state.common.get('stations').toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: newInspectDetailAction.resetStore }),
  changeStore: payload => dispatch({ type: newInspectDetailAction.changeStore, payload }),
  getInspectDetail: payload => dispatch({ type: newInspectDetailAction.getInspectDetail, payload }),
  setInspectCheck: payload => dispatch({ type: newInspectDetailAction.setInspectCheck, payload }),

});

export default connect(mapStateToProps, mapDispatchToProps)(InspectDetail);
