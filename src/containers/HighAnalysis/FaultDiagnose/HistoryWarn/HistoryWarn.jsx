import React from "react";
import PropTypes from "prop-types";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import styles from "./historyWarn.scss";
import Footer from '../../../../components/Common/Footer';
import HistoryWarnMain from '../../../../components/HighAnalysis/FaultDiagnose/HistoryWarn/HistoryWarn';
import {connect} from "react-redux";
import { historyWarnAction } from "./historyWarnAction";

class HistoryWarn extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    changeHistoryWarnStore: PropTypes.func,
    stationCode: PropTypes.number,
    deviceTypeCode:PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  onChangeFilter = (params) => {
    const { changeHistoryWarnStore } = this.props;
    changeHistoryWarnStore({...params});
  };

  render() {
    return (
      <div className={styles.faultWarnList}>
        <CommonBreadcrumb breadData={[{name:'历史预警'}]} style={{marginLeft:'38px'}} />
        <div className={styles.faultWarnListContainer}>
          <div className={styles.faultWarnListContent}>
            <HistoryWarnMain onChangeFilter={this.onChangeFilter} {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    stations: state.common.get('stations'),
    createTimeStart: state.highAanlysisReducer.historyWarnReducer.get('createTimeStart'),
    createTimeEnd: state.highAanlysisReducer.historyWarnReducer.get('createTimeEnd'),
    stationCode: state.highAanlysisReducer.historyWarnReducer.get('stationCode'),
    deviceTypeCode: state.highAanlysisReducer.historyWarnReducer.get('deviceTypeCode'),
    algorithmModalName: state.highAanlysisReducer.historyWarnReducer.get('algorithmModalName').toJS(),
    algorithmModalId: state.highAanlysisReducer.historyWarnReducer.get('algorithmModalId').toJS(),
    selectDeviceCode: state.highAanlysisReducer.historyWarnReducer.get('selectDeviceCode').toJS(),
  }
};
const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: historyWarnAction.resetStore }),
  changeHistoryWarnStore: payload => dispatch({ type: historyWarnAction.changeHistoryWarnStore, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(HistoryWarn)
