import React,{ Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './scatterDiagram.scss';
import { commonAction } from '../../../alphaRedux/commonAction';

import { scatterDiagramAction } from './scatterDiagramAction';
import ScatterDiagramSearch from '../../../../components/Monitor/DataAnalysis/DataScatterDiagram/ScatterDiagramSearch';
import ScatterDiagramHandle from '../../../../components/Monitor/DataAnalysis/DataScatterDiagram/ScatterDiagramHandle';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer/index';
import Cookie from 'js-cookie';

class DataScatterDiagram extends Component{
  static propTypes = {
    enterpriseId: PropTypes.string,
    getSecendInterval: PropTypes.func,
  };

  componentDidMount(){ // 获取数据时间间隔
    const { enterpriseId } = this.props;
    this.props.getSecendInterval({ enterpriseId });
  }

  render(){
    return(
      <div className={styles.scatterDiagram}>
        <CommonBreadcrumb breadData={[{ name: '散点图' }]} style={{ marginLeft: '40px' }} />
        <div className={styles.contentBox}>
          <div className={styles.scatterDiagramContent}>
            <ScatterDiagramSearch {...this.props} />
            <ScatterDiagramHandle {...this.props} />
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.monitor.dataScatterDiagram.toJS(),
  stations: state.common.get('stations').toJS(),
  stationTypeCount: state.common.get('stationTypeCount'),
  enterpriseId: Cookie.get('enterpriseId'),
})

const mapDispatchToProps = (dispatch) =>({
  changeScatterDiagramStore: payload => dispatch({ type: scatterDiagramAction.CHANGE_SCATTERDIAGRAM_STORE,payload }),
  resetScatterDiagramStore: payload => dispatch({ type: scatterDiagramAction.RESETS_CATTERDIAGRAM_STORE,payload }),
  getSecendInterval: payload => dispatch({ type: scatterDiagramAction.getSecendInterval,payload }),
  getPointInfo: payload => {
    return dispatch({ type: scatterDiagramAction.getPointInfo,payload })
  },
  getChartScatterDiagram: payload => dispatch({ type: scatterDiagramAction.getchartscatterdiagram,payload }),
  getListScatterDiagram: payload => dispatch({ type: scatterDiagramAction.getListScatterDiagram,payload }),
  

  getDeviceModel: params => dispatch({
    type: commonAction.getDeviceModel,
    payload: {
      params,
      actionName: scatterDiagramAction.GET_SCATTERDIAGRAM_SUCCESS,
      resultName: 'deviceModels'
    }
  }),
})

export default connect(mapStateToProps, mapDispatchToProps)(DataScatterDiagram);