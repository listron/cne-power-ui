import React,{ Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './scatterDiagram.scss';
import { commonAction } from '../../../alphaRedux/commonAction';
import { scatterDiagramAction } from './scatterDiagramAction';
import ScatterDiagramSearch from '../../../../components/Monitor/DataAnalysis/DataScatterDiagram/ScatterDiagramSearch';
import ScatterDiagramDataType from '../../../../components/Monitor/DataAnalysis/DataScatterDiagram/ScatterDiagramDataType';
import ScatterDiagramChart from '../../../../components/Monitor/DataAnalysis/DataScatterDiagram/ScatterDiagramChart';
import ScatterDiagramList from '../../../../components/Monitor/DataAnalysis/DataScatterDiagram/ScatterDiagramList';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer/index';
import Cookie from 'js-cookie';

class DataScatterDiagram extends Component{
  static propTypes = {
    enterpriseId: PropTypes.string,
    getSecendInterval: PropTypes.func,
    scatterDiagramType: PropTypes.string,
    selectStationType: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    stationDeviceTypes: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    xPointList: PropTypes.array,
    yPointList: PropTypes.array,
  };

  componentDidMount(){ // 获取数据时间间隔
    const { enterpriseId } = this.props;
    this.props.getSecendInterval({ enterpriseId });
  }

  render(){
    const {scatterDiagramType, selectStationType, deviceTypeCode, stationDeviceTypes, pageNum, pageSize, xPointList, yPointList} = this.props;
    const queryListParams = { selectStationType, deviceTypeCode, stationDeviceTypes, pageNum, pageSize, xPointList, yPointList } 
    return(
      <div className={styles.scatterDiagram}>
        <CommonBreadcrumb breadData={[{ name: '散点图' }]} style={{ marginLeft: '40px' }} />
        <div className={styles.contentBox}>
          <div className={styles.scatterDiagramContent}>
            <ScatterDiagramSearch {...this.props} queryListParams={queryListParams} />
            <ScatterDiagramDataType {...this.props} />
            <div className={styles.dataCenter}>
              {scatterDiagramType === 'chart' && <ScatterDiagramChart {...this.props} />}
              {scatterDiagramType === 'list' && <ScatterDiagramList {...this.props} />}
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
  stationTypeCount: 'wind',
  enterpriseId: Cookie.get('enterpriseId'),
})

const mapDispatchToProps = (dispatch) =>({
  changeScatterDiagramStore: payload => dispatch({ type: scatterDiagramAction.CHANGE_SCATTERDIAGRAM_STORE,payload }),
  resetScatterDiagramStore: payload => dispatch({ type: scatterDiagramAction.RESETS_SCATTERDIAGRAM_STORE,payload }),
  getSecendInterval: payload => dispatch({ type: scatterDiagramAction.getSecendInterval,payload }),
  getPointInfo: payload => dispatch({ type: scatterDiagramAction.getPointInfo,payload }),
  getChartScatterDiagram: payload => dispatch({ type: scatterDiagramAction.getChartScatterDiagram,payload }),
  getListScatterDiagram: payload => dispatch({ type: scatterDiagramAction.getListScatterDiagram,payload }),
  downLoadFile: payload => dispatch({ type: commonAction.downLoadFile, payload }),

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