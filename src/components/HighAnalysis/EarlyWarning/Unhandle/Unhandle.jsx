import React, { Component } from "react";
import { connect } from "react-redux";
import { Select, Table, Modal, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from "./unhandle.scss";
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import UnhandleMain from './UnhandleMain';
import UnhandleSide from './UnhandleSide';

const Option = Select.Option;
class Unhandle extends Component {
  static propTypes = {
    changeUnhandleStore: PropTypes.func,
    getUnhandleList: PropTypes.func,
    resetStore: PropTypes.func,
    getMatrixlist: PropTypes.func,
    stationCodes: PropTypes.array,
    belongMatrixs: PropTypes.array,
    inefficiencyStatus: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    unhandleList: PropTypes.array,
    pageName: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() { // 初始请求数据
    const { stationCodes, belongMatrixs, inefficiencyStatus, pageNum, pageSize, sortField, sortMethod, getUnhandleList, getMatrixlist } = this.props;
    getUnhandleList({ stationCodes, belongMatrixs, inefficiencyStatus, pageNum, pageSize, sortField, sortMethod })
    getMatrixlist({ stationCodes: stationCodes })
  }



  render() {
    const {  pageName } = this.props;
    return (
      <div className={styles.UnhandleBox} >
        <UnhandleMain {...this.props} />
        <TransitionContainer
          show={pageName === 'detail'}
          timeout={500}
          effect="side"
        >
          <UnhandleSide {...this.props}  />
        </TransitionContainer>

      </div>
    )
  }
}

export default Unhandle