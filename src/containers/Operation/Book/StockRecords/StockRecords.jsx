import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./stockRecords.scss";
import { commonAction } from '../../../alphaRedux/commonAction';
import { stockRecordsAction } from "./stockRecordsAction.js";
import Footer from '../../../../components/Common/Footer';
import StockSearch from '../../../../components/Operation/Book/StockRecords/StockSearch';
import StockList from '../../../../components/Operation/Book/StockRecords/StockList';

class StockRecords extends Component {
  static propTypes = {
    resetStore:PropTypes.func,
  };

  componentWillUnmount() {
    this.props.resetStore();
  }

  render() {
    return (
      <div className={styles.stockRecordsBox}>
        <div className={styles.stockRecordsCenter}>
          <div className={styles.stockRecordsContent}>
            <StockSearch {...this.props} />
            <StockList {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.operation.stockRecords.toJS(),
    stations: state.common.get('stations').toJS(),
  }
};

const mapDispatchToProps = (dispatch) => ({
  stockRecordsStore: payload => dispatch({ type: stockRecordsAction.stockRecordsStore, payload }),
  resetStore: payload => dispatch({ type: stockRecordsAction.resetStore, payload }),
  getWarehouseName: payload => dispatch({ type: stockRecordsAction.getWarehouseName, payload }),
  getInRecordList: payload => dispatch({ type: stockRecordsAction.getInRecordList, payload }),
  getOutRecordList: payload => dispatch({ type: stockRecordsAction.getOutRecordList, payload }),
  downLoadFile: payload => dispatch({ type: commonAction.downLoadFile, payload: {
    ...payload,
    actionName: stockRecordsAction.stockRecordsStore
  } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StockRecords)
