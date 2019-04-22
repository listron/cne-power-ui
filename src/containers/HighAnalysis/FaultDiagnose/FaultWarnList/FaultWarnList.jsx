import React from "react";
import PropTypes from "prop-types";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import FaultWarnMainList from '../../../../components/HighAnalysis/FaultDiagnose/FaultWarnList/FaultWarnList';
import styles from "./faultWarnList.scss";
import Footer from '../../../../components/Common/Footer';
import {faultWarnAction} from "../FaultWarn/faultWarnAction";
import {connect} from "react-redux";

class FaultWarnList extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    stations: PropTypes.object,
    singleStationCode: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className={styles.faultWarnList}>
        <CommonBreadcrumb breadData={[{name:'故障预警'}]} style={{marginLeft:'38px'}} />
        <div className={styles.faultWarnListContainer}>
          <div className={styles.faultWarnListContent}>
            <FaultWarnMainList {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.highAanlysisReducer.faultWarn.toJS(),
    stations: state.common.get('stations'),
  }
};
const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: faultWarnAction.resetStore }),
});
export default connect(mapStateToProps, mapDispatchToProps)(FaultWarnList)
