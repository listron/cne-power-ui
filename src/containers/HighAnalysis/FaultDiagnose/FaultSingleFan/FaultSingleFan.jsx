import React from "react";
import PropTypes from "prop-types";
import styles from "./faultSingleFan.scss";
import Footer from '../../../../components/Common/Footer';
import FaultSingleFanMain from '../../../../components/HighAnalysis/FaultDiagnose/FaultSingleFan/FaultSingleFan';
import {faultWarnAction} from "../FaultWarn/faultWarnAction";
import {connect} from "react-redux";


const data = [{
  id: 1,
  name: "叶片结冰预测"
},{
  id: 2,
  name: "叶片结冰预测"
},{
  id: 3,
  name: "叶片结冰预测"
},{
  id: 4,
  name: "叶片结冰预测"
},{
  id: 5,
  name: "叶片结冰预测"
},{
  id: 6,
  name: "叶片结冰预测"
},{
  id: 7,
  name: "叶片结冰预测"
},{
  id: 8,
  name: "叶片结冰预测"
},{
  id: 9,
  name: "叶片结冰预测"
},{
  id: 10,
  name: "叶片结冰预测"
},{
  id: 11,
  name: "叶片结冰预测"
},{
  id: 12,
  name: "叶片结冰预测"
},{
  id: 13,
  name: "叶片结冰预测"
},{
  id: 14,
  name: "叶片结冰预测"
},{
  id: 15,
  name: "叶片结冰预测"
},{
  id: 16,
  name: "叶片结冰预测"
},{
  id: 17,
  name: "叶片结冰预测"
},{
  id: 18,
  name: "叶片结冰预测"
}];
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
        <FaultSingleFanMain data={data} {...this.props} />
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
