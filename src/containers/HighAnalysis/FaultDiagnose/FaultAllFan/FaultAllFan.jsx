import React from "react";
import PropTypes from "prop-types";
import styles from "./faultAllFan.scss";
import Footer from '../../../../components/Common/Footer';
import FaultAllFanMain from '../../../../components/HighAnalysis/FaultDiagnose/FaultAllFan/FaultAllFan';
import {faultWarnAction} from "../FaultWarn/faultWarnAction";
import {connect} from "react-redux";

const data = [{
  id: 1,
  name: "WGT012"
},{
  id: 2,
  name: "WGT012"
},{
  id: 3,
  name: "WGT012"
},{
  id: 4,
  name: "WGT012"
},{
  id: 5,
  name: "WGT012"
},{
  id: 6,
  name: "WGT012"
},{
  id: 7,
  name: "WGT012"
},{
  id: 8,
  name: "WGT012"
},{
  id: 9,
  name: "WGT012"
},{
  id: 10,
  name: "WGT012"
},{
  id: 11,
  name: "WGT012"
},{
  id: 12,
  name: "WGT012"
},{
  id: 13,
  name: "WGT012"
},{
  id: 14,
  name: "WGT012"
},{
  id: 15,
  name: "WGT012"
},{
  id: 16,
  name: "WGT012"
},{
  id: 17,
  name: "WGT012"
},{
  id: 18,
  name: "WGT012"
}];

class FaultAllFan extends React.Component {
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
      <div className={styles.faultAllFan}>
        <div className={styles.AllFanContent}>
          <div className={styles.title}>
            <div>故障预警</div>
            <div>返回算法模型视图</div>
          </div>
        </div>
        <FaultAllFanMain data={data} {...this.props} />
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
export default connect(mapStateToProps, mapDispatchToProps)(FaultAllFan)
