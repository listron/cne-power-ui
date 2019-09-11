import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './overview.scss';
import { overviewAction } from './overviewReducer';
// import ScatterDiagramSearch from '../../../../components/Monitor/DataAnalysis/DataScatterDiagram/ScatterDiagramSearch';
// import ScatterDiagramDataType from '../../../../components/Monitor/DataAnalysis/DataScatterDiagram/ScatterDiagramDataType';
// import ScatterDiagramChart from '../../../../components/Monitor/DataAnalysis/DataScatterDiagram/ScatterDiagramChart';
// import ScatterDiagramList from '../../../../components/Monitor/DataAnalysis/DataScatterDiagram/ScatterDiagramList';
import CommonBreadcrumb from '@components/Common/CommonBreadcrumb';
import Footer from '@components/Common/Footer/index';

class Overview extends Component{
  static propTypes = {

  };

  componentWillUnmount() {

  }

  render(){
    // const { scatterDiagramType } = this.props;
    console.log(this.props);
    return(
      <div className={styles.overview}>
        <CommonBreadcrumb breadData={[{ name: '数据概览' }]} style={{ marginLeft: '40px' }} />
        <div className={styles.contentBox}>
          <div className={styles.topTab}>顶部</div>
          <div className={styles.dataOverview}>
            数据概览页面
            {/* <ScatterDiagramSearch {...this.props} /> */}
            {/* <ScatterDiagramDataType {...this.props} /> */}
            {/* <div className={styles.dataCenter}>
              {scatterDiagramType === 'chart' && <ScatterDiagramChart {...this.props} />}
              {scatterDiagramType === 'list' && <ScatterDiagramList {...this.props} />}
            </div> */}
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.monitor.overview.toJS(),
  stations: state.common.get('stations').toJS(),
});

const mapDispatchToProps = (dispatch) =>({
  getOverviewStation: payload => dispatch({ type: overviewAction.getOverviewStation, payload }),
  getOverviewDates: payload => dispatch({ type: overviewAction.getOverviewDates, payload }),
  getOverviewDevices: payload => dispatch({ type: overviewAction.getOverviewDevices, payload }),
  getOverviewPoints: payload => dispatch({ type: overviewAction.getOverviewPoints, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
