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
import { siblings } from "../../../../utils/utilFunc.js";

class AlgorithmControl extends Component {
  static propTypes = {
    resetStore:PropTypes.func,
    getInspectList: PropTypes.func,
    getInspectIdList: PropTypes.func,
    changeAlgorithmControlStore: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      showType: "list", // 展示算法或列表algorithm/list
      pageFlag: true // 展示新建页/table页
    };
  }
  componentDidMount() {
    const { pageFlag } = this.state;
    if (pageFlag) {
      this.addEvent();
    }
  }

  componentDidUpdate() {
    const { pageFlag } = this.state;
    if (pageFlag) {
      this.addEvent();
    }
  }

  componentWillUnmount(){
    this.props.resetStore();
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

  typeFunc = (type) => {
    this.setState({
      showType: type
    });
  };

  addEvent() {
    const { typeBox } = this;
    const arr = typeBox.children;
    const ways = [];
    for (let i = 0; i < arr.length; i+=1) {
      ways.push(arr[i]);
    }
    Array.prototype.forEach.call(ways, (item) => {
      item.addEventListener("click", this.checkType);
    });
  }

  checkType() {
    /* eslint-disable no-param-reassign */
    siblings(this).forEach((item, index, arr) => {
      arr[index].style.color = "#666666";
      arr[index].style.backgroundColor = "#ffffff";
    });
    this.style.color = "#ffffff";
    this.style.backgroundColor = "#199475";
  }

  render() {
    const { showType, pageFlag } = this.state;
    return (
      <div className={styles.controlBox}>
        <CommonBreadcrumb breadData={[{name:'算法控制台'}]} style={{marginLeft:'38px'}} />
        {pageFlag ? [
          <div className={styles.controlType} ref={ref => {this.typeBox = ref}} key="controlType">
            <div onClick={() => {return this.typeFunc("algorithm")}}>
              <Icon type="swap" />
              <span>算法模型</span>
            </div>
            <div onClick={() => {return this.typeFunc("list")}}>
              <Icon type="swap" />
              <span>列表视图</span>
            </div>
          </div>,
          <div className={styles.controlContainer} key="controlContainer">
            <div className={styles.controlBox}>
            {(showType === "algorithm") && (
              <Button className={styles.addControl} onClick={() => {return this.onAddControlFunc(false)}}>
                <Icon type="plus" />
                <span className={styles.text}>添加</span>
              </Button>
            )}
          <div>
          {showType === "algorithm" ? <AlgorithmModal {...this.props} /> : <ListView onAddControlFunc={this.onAddControlFunc} onChangeFilter={this.onChangeFilter} {...this.props} />}
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
    stations: state.common.get('stations'),
    stationCodes: state.highAanlysisReducer.algorithm.get('stationCodes'),
    deviceTypeCode: state.highAanlysisReducer.algorithm.get('deviceTypeCode'),
    createTimeStart: state.highAanlysisReducer.algorithm.get('createTimeStart'),
    createTimeEnd: state.highAanlysisReducer.algorithm.get('createTimeEnd'),
    algorithmModalName: state.highAanlysisReducer.algorithm.get('algorithmModalName').toJS(),
    algorithmModalId: state.highAanlysisReducer.algorithm.get('algorithmModalId').toJS(),
    deviceTypes: state.common.get('deviceTypes'),
  })
};
const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: algorithmControlAction.resetStore }),
  changeAlgorithmControlStore: payload => dispatch({ type: algorithmControlAction.changeAlgorithmControlStore, payload }),
  getInspectList: payload => dispatch({ type: algorithmControlAction.GET_INSPECT_LIST_SAGA, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmControl)
