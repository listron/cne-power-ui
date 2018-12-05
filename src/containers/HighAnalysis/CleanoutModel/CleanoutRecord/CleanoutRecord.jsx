import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./cleanoutRecord.scss";
import { cleanoutRecordAction } from './cleanoutRecordAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import TransitionContainer from '../../../../components/Common/TransitionContainer';

import CleanoutRecordMain from '../../../../components/HighAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecordMain/CleanoutRecordMain';
import CleanoutRecordSide from '../../../../components/HighAnalysis/CleanoutModel/CleanoutRecord/CleanoutRecordSide/CleanoutRecordSide';
class CleanoutRecord extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    stationType: PropTypes.string, 
    stationName: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showSidePage: 'list'
    }
  }
  onShowSideChange = ({showSidePage}) => {
    this.setState({ showSidePage });
  }
  onToggleSide = () => {
    const { showPage } = this.props;
    this.setState({
      showSidePage: showPage
    });
  }
  render() {
    const{showPage, stationType, stationName, pageNum, pageSize, orderField, orderCommand,}=this.props;
    const{showSidePage}=this.state;
    //请求的参数
    const queryListParams = {
      stationType, stationName, pageNum, pageSize, orderField, orderCommand,
    }

    const breadCrumbData = {
      breadData: [
        {
          name: '清洗计划与记录',
        }
      ],
    };
    return (
      <div className={styles.cleanoutRecordBox} >
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.cleanoutRecordContainer}>
          <CleanoutRecordMain {...this.props} queryListParams={queryListParams} />
          <TransitionContainer
            show={showPage!=='list'}
            onEnter={this.onToggleSide}
            onExited={this.onToggleSide}
            timeout={500}
            effect="side"
          >
            <CleanoutRecordSide
              {...this.props} 
              showSidePage={showSidePage}
              queryListParams={queryListParams}
              onShowSideChange={this.onShowSideChange} 
            />
          </TransitionContainer>
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.advanceAanlysisReducer.cleanoutRecordReducer.toJS(),
    stations: state.common.get('stations'),
   
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeCleanoutRecordStore: payload => dispatch({ type: cleanoutRecordAction.CHANGE_CLEANOUT_RECORD_STORE_SAGA, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(CleanoutRecord)