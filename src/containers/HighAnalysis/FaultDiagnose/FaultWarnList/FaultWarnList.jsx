import React from 'react';
import PropTypes from 'prop-types';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import FaultWarnMainList from '../../../../components/HighAnalysis/FaultDiagnose/FaultWarnList/FaultWarnList';
import styles from './faultWarnList.scss';
import Footer from '../../../../components/Common/Footer';
import {faultWarnListAction} from './faultWarnListAction';
import {connect} from 'react-redux';

class FaultWarnList extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    stations: PropTypes.object,
    changeWarnListStore: PropTypes.func,
    location: PropTypes.object,
    match: PropTypes.object,
    getAlgoModel: PropTypes.func,
    viewType: PropTypes.number,
    resetStore: PropTypes.func,
    getList: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      match: {params: { fanWarnId }},
      getAlgoModel,
    } = this.props;
    const params = {
      stationCode: fanWarnId,
    };
    getAlgoModel(params);
  }

  componentWillUnmount(){
    const {resetStore } = this.props;
    resetStore();
  }

  onChangeFilter = (params) => {
    const { changeWarnListStore } = this.props;
    changeWarnListStore({...params});
  };

  render() {
    return (
      <div className={styles.faultWarnList}>
        <CommonBreadcrumb breadData={[{name: '故障预警'}]} style={{marginLeft: '38px'}} />
        <div className={styles.faultWarnListContainer}>
          <div className={styles.faultWarnListContent}>
            <FaultWarnMainList onChangeFilter={this.onChangeFilter} {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.highAanlysisReducer.faultWarnList.toJS(),
    stations: state.common.get('stations'),
  };
};
const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: faultWarnListAction.resetStore }),
  changeWarnListStore: payload => dispatch({ type: faultWarnListAction.changeWarnListStore, payload }),
  getAlgoModel: payload => dispatch({ type: faultWarnListAction.getAlgoModel, payload }),
  getList: payload => dispatch({ type: faultWarnListAction.getList, payload }),
  getFanList: payload => dispatch({ type: faultWarnListAction.getFanList, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(FaultWarnList);
