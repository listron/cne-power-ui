import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { defectDetailAction } from './defectDetailReducer';
import { commonAction } from '@containers/alphaRedux/commonAction';
import searchUtil from '@utils/searchUtil';
import styles from './defectDetail.scss';

class DefectDetail extends Component {

  static propTypes = {
    theme: PropTypes.string,
  };

  componentDidMount() {
    const { history } = this.props;
    const { search, pathname } = history.location;
    const { page = 'defectDetail', defectId } = searchUtil(search).parse(); //默认为缺陷列表页
    console.log('page', page, defectId);
  }


  componentWillUnmount() {

  }


  render() {
    const { pageLoading, theme = 'light' } = this.props;
    return (
      <div className={styles.cont}> 缺陷详情页面</div>
    );
  }
}

const mapStateToProps = (state) => ({
  // ...state.operation.workStage.toJS(),
  stations: state.common.get('stations').toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: defectDetailAction.resetStore }),
  changeStore: payload => dispatch({ type: defectDetailAction.changeStore, payload }),

});

export default connect(mapStateToProps, mapDispatchToProps)(DefectDetail);
