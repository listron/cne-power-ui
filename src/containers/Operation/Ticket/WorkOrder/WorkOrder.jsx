import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./workOrder.scss";
import { workOrderAction } from './workOrderAction';
import WorkOrderContainer from '../../../../components/Operation/Ticket/WorkOrder/WorkOrder'

/**
 *  1 defectId  缺陷id  缺陷的ID 必填
 *  2 otherFrom 是否是从其他页面跳过来的 默认为true  
 *  3 pageName  返回的列表叫什么 如'list'
 *  4 onChange 回掉函数 返回的是需要的返回的一个页面
 *  5 pageNum  页数  现在为止，只有缺陷列表页有 选填
    6 pageSize  选填
 */
class WorkOrder extends Component {
  static propTypes = {
    defectId: PropTypes.string,
    getDefectDetail: PropTypes.func,
    onChange: PropTypes.func,
    getDefectIdList: PropTypes.func,
    getDefectCommonList: PropTypes.func,
    pageName: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    stationType: PropTypes.string,
    defectSource: PropTypes.string,
    callback: PropTypes.bool,
    resetStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)

  }

  componentDidMount() {
    const { defectId, getDefectDetail, getDefectCommonList } = this.props;
    // 如果是路由传过来的
    // const searchInfo = this.props.history.location.search;
    // const stationCode = searchInfo.substring(searchInfo.indexOf('=') + 1);
    getDefectDetail({ defectId })
    getDefectCommonList({ languageType: '1' })
  }

  componentWillReceiveProps(nextProps) {
    const { callback, pageName, onChange, getDefectIdList, stationType, defectSource, pageNum, pageSize } = nextProps;
    callback && onChange({ pageName })
    stationType && this.props.stationType !== stationType && getDefectIdList({ stationType, defectSource, pageNum, pageSize })
  }

  componentWillUnmount() {
    console.log('卸载页面')
    this.props.resetStore()
  }





  render() {
    return (
      <div className={styles.workOrderBox} >
        <WorkOrderContainer {...this.props} />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.operation.workOrder.toJS(),
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeTransferStoreSaga: payload => dispatch({ type: workOrderAction.changeWorkOrderStoreSaga, payload }),
  resetStore: payload => dispatch({ type: workOrderAction.resetStore, payload }),
  getDefectDetail: payload => dispatch({ type: workOrderAction.getDefectDetail, payload }),
  getDefectIdList: payload => dispatch({ type: workOrderAction.getDefectIdList, payload }),
  getDefectCommonList: payload => dispatch({ type: workOrderAction.getDefectCommonList, payload }),
  getDefectTypes: payload => dispatch({ type: workOrderAction.getDefectTypes, payload }),
  sendDefect: payload => dispatch({ type: workOrderAction.sendDefect, payload }),
  rejectDefect: payload => dispatch({ type: workOrderAction.rejectDefect, payload }),
  closeDefect: payload => dispatch({ type: workOrderAction.closeDefect, payload }),
  handleDefect: payload => dispatch({ type: workOrderAction.handleDefect, payload }),
  checkDefect: payload => dispatch({ type: workOrderAction.checkDefect, payload }),
})

export default connect(mapStateToProps, mapDispatchToProps)(WorkOrder)