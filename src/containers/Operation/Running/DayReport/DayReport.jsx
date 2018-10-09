import React, { Component } from 'react';
import { connect } from 'react-redux';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import { dayReportAction } from './dayReportAction';
import PropTypes from 'prop-types';
import styles from './dayReport.scss';
import Cookie from 'js-cookie';

class DayReport extends Component {
  static propTypes = {
    showPage: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      showPage: 'list'
    }
  }

  componentDidMount(){

  }

  componentWillUnmount(){
    
  }

  onShowSideChange = ({ showSidePage }) => {
    this.setState({ showSidePage });
  }

  onToggleSide = () => {
    const { showPage } = this.props;
    this.setState({
      showSidePage: showPage
    });
  }

  render() {
    const { showPage } = this.state;
    return (
      <div className={styles.dayReport}>
        日报主页！！！
        <div className={styles.dayReportContainer} >
          <TransitionContainer
            show={false}
            timeout={500}
            effect="side"
          >
            <div>这个！</div>
          </TransitionContainer>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state.operation.dayReport.toJS(),
  stations: state.common.get('stations'),
  enterpriseId: Cookie.get('enterpriseId'),
  userId: Cookie.get('userId'),
});

const mapDispatchToProps = (dispatch) => ({
  toChangeDayReportStore: payload => dispatch({type: dayReportAction.toChangeDayReportStore, payload}),
  getDayReportList: payload => dispatch({type: dayReportAction.getDayReportList, payload}),
  dayReportConfig: payload => dispatch({type: dayReportAction.dayReportConfig, payload}),
  dayReportDetail: payload => dispatch({type: dayReportAction.dayReportDetail, payload}),
  dayReportUpdate: payload => dispatch({type: dayReportAction.dayReportUpdate, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(DayReport);
