import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./algorithmControl.scss";
import PropTypes from 'prop-types';
import { Icon, Button } from "antd";
import { algorithmControlAction } from './algorithmControlAction.js';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import AlgorithmModal from '../../../../components/HighAnalysis/FaultDiagnose/AlgorithmControl/AlgorithmModal/AlgorithmModal';
import ListView from '../../../../components/HighAnalysis/FaultDiagnose/AlgorithmControl/ListView/ListView';
import AddAlgorithm from '../../../../components/HighAnalysis/FaultDiagnose/AlgorithmControl/AddAlgorithm/AddAlgorithm';
import Footer from '../../../../components/Common/Footer';

class AlgorithmControl extends Component {
  static propTypes = {
    resetStore:PropTypes.func,
    getInspectIdList: PropTypes.func,
    changeAlgorithmControlStore: PropTypes.func,
    viewType: PropTypes.string,
    getAlgoOptionList: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      pageFlag: true // 展示新建页/table页
    };
  }

  componentDidMount() {
    const { getAlgoOptionList } = this.props;
    getAlgoOptionList();
  }

  componentWillUnmount(){
    const { resetStore } = this.props;
    resetStore();
  }

  onAddControlFunc = (flag) => {
    this.setState({
      pageFlag: flag
    });
  };

  onChangeFilter = (params) => {
    const { changeAlgorithmControlStore } = this.props;
    changeAlgorithmControlStore({...params});
  };

  showAlgorithmFunc = () => {
    // 展示算法
    this.onChangeFilter({
      viewType: "algorithm"
    });
  };

  showListViewFunc = () => {
    // 展示列表视图
    this.onChangeFilter({
      viewType: "list"
    });
  };

  render() {
    const { pageFlag } = this.state;
    const { viewType } = this.props;
    const checkStyle = {
      color: "#ffffff",
      backgroundColor: "#199475"
    };
    const UnCheckStyle = {
      color: "#666666",
      backgroundColor: "#ffffff"
    };
    return (
      <div className={styles.controlBox}>
        <CommonBreadcrumb breadData={[{name:'算法控制台'}]} style={{marginLeft:'38px'}} />
        {pageFlag ? [
          <div className={styles.controlType} key="controlType">
            <div
              style={viewType === "algorithm" ? checkStyle : UnCheckStyle}
              onClick={this.showAlgorithmFunc}
            >
              <Icon type="swap" />
              <span>算法模型</span>
            </div>
            <div
              style={viewType === "list" ? checkStyle : UnCheckStyle}
              onClick={this.showListViewFunc}
            >
              <Icon type="swap" />
              <span>列表视图</span>
            </div>
          </div>,
          <div className={styles.controlContainer} key="controlContainer">
            <div className={styles.controlBox}>
            {(viewType === "algorithm") && (
              <Button className={styles.addControl} onClick={() => {return this.onAddControlFunc(false)}}>
                <Icon type="plus" />
                <span className={styles.text}>添加</span>
              </Button>
            )}
          <div>
          {
            viewType === "algorithm" ?
            <AlgorithmModal onChangeFilter={this.onChangeFilter} {...this.props} />
            : <ListView onAddControlFunc={this.onAddControlFunc} onChangeFilter={this.onChangeFilter} {...this.props} />
          }
          </div>
          </div>
          </div>
        ]: <AddAlgorithm onAddControlFunc={this.onAddControlFunc} {...this.props} />}
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return ({
    ...state.highAanlysisReducer.algorithm.toJS(),
    deviceTypes: state.common.get('deviceTypes'),
    stations: state.common.get('stations'),
  })
};
const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: algorithmControlAction.resetStore }),
  getAlgoList: () => dispatch({ type: algorithmControlAction.getAlgoList }),
  getAlgoOptionList: () => dispatch({ type: algorithmControlAction.getAlgoOptionList }),
  changeAlgorithmControlStore: payload => dispatch({ type: algorithmControlAction.changeAlgorithmControlStore, payload }),
  getAddWarnTask: payload => dispatch({ type: algorithmControlAction.getAddWarnTask, payload }),
  getListView: payload => dispatch({ type: algorithmControlAction.getListView, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmControl)
