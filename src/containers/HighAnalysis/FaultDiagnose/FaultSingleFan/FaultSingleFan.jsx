import React from "react";
import PropTypes from "prop-types";
import styles from "./faultSingleFan.scss";
import Footer from '../../../../components/Common/Footer';
import FaultSingleFanMain from '../../../../components/HighAnalysis/FaultDiagnose/FaultSingleFan/FaultSingleFan';
import {faultWarnAction} from "../FaultWarn/faultWarnAction";
import {connect} from "react-redux";

class FaultSingleFan extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    stations: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className={styles.faultSingleFan}>
        <div className={styles.singleFanContent}>
          <div className={styles.title}>
            <div>故障预警</div>
            <div>返回列表视图</div>
          </div>
        </div>
        <FaultSingleFanMain {...this.props} />
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
export default connect(mapStateToProps, mapDispatchToProps)(FaultSingleFan)
