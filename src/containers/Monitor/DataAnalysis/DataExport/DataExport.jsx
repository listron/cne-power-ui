import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './dataExport.scss';
import { commonAction } from '../../../alphaRedux/commonAction';
import { dataExportAction } from './dataExportAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer/index';
import DataExportSearch from '../../../../components/Monitor/DataAnalysis/DataExport/DataExportSearch';
import DataExportList from '../../../../components/Monitor/DataAnalysis/DataExport/DataExportList';
import Cookie from 'js-cookie';

class DataExport extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    enterpriseId: PropTypes.string,
    getSecendInterval: PropTypes.func,
  };

  componentDidMount(){ // 获取数据时间间隔
    const { enterpriseId, getSecendInterval } = this.props;
    getSecendInterval({ enterpriseId });
  }

  componentWillUnmount() {
    this.props.resetStore();
  }

  render() {
    return (
      <div className={styles.dataExport}>
        <CommonBreadcrumb breadData={[{ name: '数据导出' }]} style={{ marginLeft: '40px' }} />
        <div className={styles.contentBox}>
          <div className={styles.dataContent}>
            <DataExportSearch {...this.props} />
            <DataExportList {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.monitor.dataExport.toJS(),
    stations: state.common.get('stations').toJS(),
    filterDevices: state.common.get('filterDevices').toJS(),
    stationTypeCount: state.common.get('stationTypeCount'),
    enterpriseId: Cookie.get('enterpriseId'),
  }
};


const mapDispatchToProps = (dispatch) => ({
  changeDataExportStore: payload => dispatch({ type: dataExportAction.changeDataExportStore, payload }),
  resetStore: payload => dispatch({type: dataExportAction.resetStore, payload}),
  getPointInfo: payload => dispatch({type: dataExportAction.getPointInfo, payload}),
  getAvailableDeviceType: payload => dispatch({type: dataExportAction.getAvailableDeviceType, payload}),
  getDataExportList: payload => dispatch({type: dataExportAction.getDataExportList, payload}),
  getAgainDataExport: payload => dispatch({type: dataExportAction.getAgainDataExport, payload}),
  getDataExport: payload => dispatch({type: dataExportAction.getDataExport, payload}),
  getSecendInterval: payload => dispatch({type: dataExportAction.getSecendInterval, payload}),
  downLoadFile: payload => dispatch({ type: commonAction.downLoadFile, payload: {
    ...payload,
    actionName: dataExportAction.changeDataExportStore
  } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataExport);