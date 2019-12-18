import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';
import { algorithmControlAction } from './algorithmControlAction.js';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import AlgorithmModal from '../../../../components/HighAnalysis/FaultDiagnose/AlgorithmControl/AlgorithmModal/AlgorithmModal';
import ListView from '../../../../components/HighAnalysis/FaultDiagnose/AlgorithmControl/ListView/ListView';
import AddAlgorithm from '../../../../components/HighAnalysis/FaultDiagnose/AlgorithmControl/AddAlgorithm/AddAlgorithm';
import Footer from '../../../../components/Common/Footer';
import { handleRight } from '@utils/utilFunc';

import styles from './algorithmControl.scss';

class AlgorithmControl extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    getInspectIdList: PropTypes.func,
    changeAlgorithmControlStore: PropTypes.func,
    viewType: PropTypes.string,
    getAlgoOptionList: PropTypes.func,
    getListView: PropTypes.func,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    algorithmModalId: PropTypes.array,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    status: PropTypes.string,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    stationCode: PropTypes.string,
    algorithmModalName: PropTypes.array,
    stationCodes: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      pageFlag: true, // 展示新建页/table页
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
      pageFlag: flag,
    });
  };

  onChangeFilter = (params) => {
    const {
      getListView,
      pageSize,
      pageNum,
      algorithmModalId,
      createTimeStart,
      createTimeEnd,
      status,
      sortField,
      sortMethod,
      stationCode,
      stationCodes,
      algorithmModalName,
    } = this.props;
    // 新的参数
    const newParams = {
      pageSize,
      pageNum,
      algorithmModalId,
      createTimeStart,
      createTimeEnd,
      status,
      sortField,
      sortMethod,
      stationCode,
      stationCodes,
      algorithmModalName,
      ...params,
    };
    getListView(newParams);
  };

  showAlgorithmFunc = () => {
    // 展示算法
    const { changeAlgorithmControlStore } = this.props;
    // 展示算法
    changeAlgorithmControlStore({
      viewType: 'algorithm',
    });
  };

  showListViewFunc = () => {
    const {
      changeAlgorithmControlStore,
      getListView,
      algorithmModalId,
    } = this.props;
    // 展示列表视图
    changeAlgorithmControlStore({
      viewType: 'list',
    });
    const listParams = {
      stationCode: null,
      algorithmIds: algorithmModalId,
      startTime: '',
      endTime: '',
      status: null,
      pageSize: null,
      pageNum: null,
      sortField: '',
      sortMethod: '',
    };
    // 列表
    getListView(listParams);
  };

  render() {
    const { pageFlag } = this.state;
    const { viewType } = this.props;
    const controlOperation = handleRight('turbineFDD_console_new');
    const checkStyle = {
      color: '#ffffff',
      backgroundColor: '#199475',
    };
    const UnCheckStyle = {
      color: '#666666',
      backgroundColor: '#ffffff',
    };
    return (
      <div className={styles.controlBox}>
        <CommonBreadcrumb breadData={[{name: '算法控制台'}]} style={{marginLeft: '38px'}} />
        {pageFlag ? [
          <div className={styles.controlType} key="controlType">
            <div
              style={viewType === 'algorithm' ? checkStyle : UnCheckStyle}
              onClick={this.showAlgorithmFunc}
            >
              <i className="iconfont icon-grid" />
              <span>算法模型</span>
            </div>
            <div
              style={viewType === 'list' ? checkStyle : UnCheckStyle}
              onClick={this.showListViewFunc}
            >
              <i className="iconfont icon-table" />
              <span>列表视图</span>
            </div>
          </div>,
          <div className={styles.controlContainer} key="controlContainer">
            <div className={styles.controlBox}>
            {(viewType === 'algorithm') && controlOperation && (
              <Button className={styles.addControl} onClick={() => {return this.onAddControlFunc(false);}}>
                <Icon type="plus" />
                <span className={styles.text}>添加</span>
              </Button>
            )}
          <div>
          {
            viewType === 'algorithm' ?
            <AlgorithmModal onChangeFilter={this.onChangeFilter} {...this.props} />
            : <ListView onAddControlFunc={this.onAddControlFunc} onChangeFilter={this.onChangeFilter} {...this.props} />
          }
          </div>
          </div>
          </div>,
        ]: <AddAlgorithm onAddControlFunc={this.onAddControlFunc} {...this.props} />}
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return ({
    ...state.highAanlysisReducer.algorithm.toJS(),
    deviceTypes: state.common.get('deviceTypes'),
    stations: state.common.get('stations'),
  });
};
const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: algorithmControlAction.resetStore }),
  getAlgoList: () => dispatch({ type: algorithmControlAction.getAlgoList }),
  getAlgoOptionList: () => dispatch({ type: algorithmControlAction.getAlgoOptionList }),
  changeAlgorithmControlStore: payload => dispatch({ type: algorithmControlAction.changeAlgorithmControlStore, payload }),
  getAddWarnTask: payload => dispatch({ type: algorithmControlAction.getAddWarnTask, payload }),
  getListView: payload => dispatch({ type: algorithmControlAction.getListView, payload }),
  getTaskStatusStat: payload => dispatch({ type: algorithmControlAction.getTaskStatusStat, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmControl);
