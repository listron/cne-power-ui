import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { meterReadSetAction } from './meterReadSetAction.js';
import MeterReadAllSatation from '../../../../components/Operation/Running/MeterReadSet/MeterReadAllSatation';
import MeterReadSingleSatation from '../../../../components/Operation/Running/MeterReadSet/MeterReadSingleSatation';
import Footer from '../../../../components/Common/Footer';
import styles from './meterReadSet.scss';
import searchUtil from '@utils/searchUtil';

class MeterReadSet extends Component{
  static propTypes= {
    resetStore: PropTypes.func,
    changeMeterReadSetStore: PropTypes.func,
    getMeterList: PropTypes.func,
    getBaseDevice: PropTypes.func,
    getPriceDetail: PropTypes.func,
    theme: PropTypes.string,
    showPage: PropTypes.string,
    history: PropTypes.object,
  }

  constructor(props){
    super(props);
  }

  componentDidMount () {
    const { history, changeMeterReadSetStore, getMeterList, getBaseDevice, getPriceDetail } = this.props;
    const { search } = history.location;
    const { searchParams } = searchUtil(search).parse();
    const urlSearchParams = searchParams && JSON.parse(searchParams) || {}; // 判断从路由中过来的筛选条件
    const { stationCode } = urlSearchParams;
    changeMeterReadSetStore({
      ...urlSearchParams,
    });
    if(JSON.stringify(urlSearchParams) !== '{}'){
      getMeterList({stationCode});
      getBaseDevice({stationCode});
      getPriceDetail({stationCode});
    }
  }

  componentWillUnmount(){
    this.props.resetStore();
  }

  render(){
    const { showPage, theme } = this.props;
    return(
      <div className={`${styles.meterReadSet} ${styles[theme]}`}>
        <div className={styles.meterReadContent}>
          {showPage === 'allStation' && <MeterReadAllSatation {...this.props} />}
          {showPage === 'singleStation' && <MeterReadSingleSatation {...this.props} />}
          <Footer theme={theme} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.meterReadSet.toJS(),
  stations: state.common.get('stations').toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  changeMeterReadSetStore: payload => dispatch({type: meterReadSetAction.changeMeterReadSetStore, payload}),
  resetStore: () => dispatch({ type: meterReadSetAction.resetStore }),
  getMeterList: payload => dispatch({type: meterReadSetAction.getMeterList, payload}),
  getUpDateMeterList: payload => dispatch({type: meterReadSetAction.getUpDateMeterList, payload}),
  getDeleteMeterList: payload => dispatch({type: meterReadSetAction.getDeleteMeterList, payload}),
  getChangeMeterList: payload => dispatch({type: meterReadSetAction.getChangeMeterList, payload}),
  getBaseDevice: payload => dispatch({type: meterReadSetAction.getBaseDevice, payload}),
  getPriceDetail: payload => dispatch({type: meterReadSetAction.getPriceDetail, payload}),
  getAddMeterList: payload => dispatch({type: meterReadSetAction.getAddMeterList, payload}),
  getMeterPrice: payload => dispatch({type: meterReadSetAction.getMeterPrice, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(MeterReadSet);
