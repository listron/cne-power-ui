import React,{ Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './scatterDiagram.scss';
import { commonAction } from '../../../alphaRedux/commonAction';
import { scatterDiagramAction } from './scatterDiagramReducer';
import ScatterDiagramSearch from '../../../../components/Monitor/DataAnalysis/DataScatterDiagram/ScatterDiagramSearch';
import ScatterDiagramDataType from '../../../../components/Monitor/DataAnalysis/DataScatterDiagram/ScatterDiagramDataType';
import ScatterDiagramChart from '../../../../components/Monitor/DataAnalysis/DataScatterDiagram/ScatterDiagramChart';
import ScatterDiagramList from '../../../../components/Monitor/DataAnalysis/DataScatterDiagram/ScatterDiagramList';
import Footer from '../../../../components/Common/Footer/index';

class DataScatterDiagram extends Component{
  static propTypes = {
    scatterDiagramType: PropTypes.string,
    resetScatterDiagramStore: PropTypes.func,
  };

  componentWillUnmount() {
    this.props.resetScatterDiagramStore();
  }

  render(){
    const { scatterDiagramType } = this.props;
    return(
      <div className={styles.scatterDiagram}>
        <div className={styles.contentBox}>
          <div className={styles.scatterDiagramContent}>
            <ScatterDiagramSearch {...this.props} />
            <div className={styles.dataContent}>
              <ScatterDiagramDataType {...this.props} />
              <div className={styles.dataCenter}>
                {scatterDiagramType === 'chart' && <ScatterDiagramChart {...this.props} />}
                {scatterDiagramType === 'list' && <ScatterDiagramList {...this.props} />}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.monitor.dataScatterDiagram.toJS(),
  stations: state.common.get('stations').toJS().filter(e => e.stationType === 0),
})

const mapDispatchToProps = (dispatch) =>({
  changeScatterDiagramStore: payload => dispatch({ type: scatterDiagramAction.CHANGE_SCATTERDIAGRAM_STORE, payload }),
  resetScatterDiagramStore: () => dispatch({ type: scatterDiagramAction.RESETS_SCATTERDIAGRAM_STORE }),
  getPoints: payload => dispatch({ type: scatterDiagramAction.getPoints, payload }),
  getChartScatterDiagram: payload => dispatch({ type: scatterDiagramAction.getChartScatterDiagram, payload }),
  getListScatterDiagram: payload => dispatch({ type: scatterDiagramAction.getListScatterDiagram, payload }),
  downLoadFile: payload => dispatch({ type: commonAction.downLoadFile, payload: {
    ...payload,
    actionName: scatterDiagramAction.CHANGE_SCATTERDIAGRAM_STORE
  } }),
})

export default connect(mapStateToProps, mapDispatchToProps)(DataScatterDiagram);
