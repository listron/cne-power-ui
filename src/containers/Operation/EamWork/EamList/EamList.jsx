import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {eamListAction} from './eamListAction';
import CneFooter from '@components/Common/Power/CneFooter';
import EamSearch from '@components/Operation/EamWork/EamList/EamSearch';
import EamTable from '@components/Operation/EamWork/EamList/EamTable';
import styles from './eamList.scss';

class EamList extends Component {

  static propTypes = {
    theme: PropTypes.string,
    getEamStationList: PropTypes.func,
    getEamList: PropTypes.func,
    selectedStation: PropTypes.array,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    workOrderType: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  };

  componentDidMount() {
    const { getEamList, getEamStationList, workOrderType, startTime, endTime, pageSize, pageNum, selectedStation } = this.props;
    // 获取EAM电站列表
    getEamStationList();
    // 获取EAMl列表
    getEamList({
      workOrderType,
      startTime,
      endTime,
      pageSize,
      pageNum,
      stationNames: selectedStation.map(cur => cur.stationCode),
    });
  }

  render() {
    const { theme = 'light' } = this.props;
    return (
      <div className={`${styles.eamListBox} ${styles[theme]}`}>
        <div className={styles.eamListContent}>
          <div className={styles.eamListWrap}>
            <EamSearch {...this.props} />
            <EamTable {...this.props} />
          </div>
        </div>
        <CneFooter />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.eamList.toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: eamListAction.resetStore }),
  changeStore: payload => dispatch({ type: eamListAction.changeStore, payload }),
  getEamStationList: () => dispatch({ type: eamListAction.getEamStationList }),
  getEamList: payload => dispatch({ type: eamListAction.getEamList, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EamList);
