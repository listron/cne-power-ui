import React, {Component} from "react";
import styles from "./plan.scss";
import {connect} from 'react-redux';
import {Button, Table, Icon} from 'antd';

import CommonBreadcrumb from "../../../../components/Common/CommonBreadcrumb";
import PlanMain from '../../../../components/System/Production/Plan/PlanMain/PlanMain.jsx';

// import StationSelect from "../../../../components/Common/StationSelect";
import PropTypes from 'prop-types';
import {planAction} from './planAction';


class Plan extends Component {
  // 属性的限制
  static propTypes = {
    showPage: PropTypes.string,
    sort: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    getPlanList: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      showSidePage: 'list'
    }
  }

  // 组件卸载的时候
  componentWillUnmount() {
    this.props.changePlanStore({
      showPage: 'list',
      sort: '', //排序 => 'field,0/1'field代表排序字段，0升序,1降序
      totalNum: 0,//生产计划总数
      pageNum: 1,//当前页号
      pageSize: 10,//每页容纳条数
      planYear: '', // 选择年份 默认当前年
      stationName: ''
    });
  }

  componentDidMount() {
    const params = {
      year: this.props.planYear || new Date().getFullYear(), // 年份 默认是当前年
      stationCodes: this.props.stationCodes, // 电站编码
      sortField: this.props.sortField, // 1:区域 2：电站名称 3:装机容量 4:年份 5: 年计划发电量
      sortMethod: this.props.sort, //排序 => 'field,0/1'field代表排序字段，0升序,1降序
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize,
    };
    this.props.getPlanList(params)//请求部门列表
  }

  render() {
    const breadCrumbData = {
      breadData: [{name: '生产计划',}],
    };
    return (
      <div className={styles.planContainerBox}>
        <CommonBreadcrumb  {...breadCrumbData} style={{marginLeft: '38px'}}/>
        <div className={styles.planContainer}>
          <PlanMain {...this.props} onWarningTipToggle={this.onWarningTipToggle}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  ...state.system.plan.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changePlanStore: payload => dispatch({type: planAction.changePlanStore, payload}),
  // 获取数据
  getPlanList: payload => dispatch({type: planAction.getPlanList, payload}),


});

export default connect(mapStateToProps, mapDispatchToProps)(Plan);
