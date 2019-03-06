import React,{ Component } from 'react';
import { connect } from 'react-redux';
import styles from './scatterDiagram.scss';
import { scatterDiagramAction } from './scatterDiagramAction';
import ScatterDiagramSearch from '../../../../components/Monitor/DataAnalysis/DataScatterDiagram/ScatterDiagramSearch';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer/index';
import Cookie from 'js-cookie';

class DataScatterDiagram extends Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    
  }

  render(){
    return(
      <div className={styles.scatterDiagram}>
        <CommonBreadcrumb breadData={[{ name: '散点图' }]} style={{ marginLeft: '40px' }} />
        <div className={styles.contentBox}>
          <div className={styles.scatterDiagramContent}>
            <ScatterDiagramSearch {...this.props} />
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
  // getPointInfo: payload => dispatch({ type: scatterDiagramAction.getpointinfo,payload }),
  // getChartScatterDiagram: payload => dispatch({ type: scatterDiagramAction.getchartscatterdiagram,payload }),
  // getListScatterDiagram: payload => dispatch({ type: scatterDiagramAction.getListScatterDiagram,payload }),
  getStaionDeviceType: params => dispatch({ type: scatterDiagramAction.getStaionDeviceType,payload:{
    params
  }}),
})

export default connect(mapStateToProps, mapDispatchToProps)(DataScatterDiagram);