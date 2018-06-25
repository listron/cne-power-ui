import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Tabs} from 'antd';
import Defect from './Defect/Defect';
import Inspect from './Inspect';
import { 
  CHANGE_SHOW_CONTAINER_SAGA,
  CLEAR_DEFECT_STATE_SAGA,
  CLEAR_INSPECT_STATE_SAGA,
  GET_DEFECT_LIST_SAGA,
  GET_INSPECT_LIST_SAGA,
 } from '../../../constants/actionTypes/Ticket';
import styles from './ticket.scss';
const TabPane = Tabs.TabPane;


class Ticket extends Component {
  static propTypes = {
    showContainer: PropTypes.string,
    onChangeShowContainer: PropTypes.func,
    clearDefectState: PropTypes.func,
    clearInspectState: PropTypes.func,
    getDefectList: PropTypes.func,
    getInspectList: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      tab: "defect",
    };
    this.onChangeTab = this.onChangeTab.bind(this);
  }

  onChangeTab(tab) {
    this.setState({
      tab: tab
    });
    this.props.onChangeShowContainer({container: 'list'});
    if(tab === "inspect") {
      this.props.clearDefectState();//清除缺陷状态
      var params = {
        stationType: "2",
        status: '5',
        pageNum: 0,
        pageSize: 10
      }
      this.props.getInspectList(params);//获取巡检列表
    } else {
      this.props.clearInspectState();//清除巡检状态
      var params = {
        defectSource: '3',
        stationType: '2',
        status: '5',
        pageNum: 0,
        pageSize: 10,
        sort: ''
      }
      this.props.getDefectList(params);//获取缺陷列表
    }
  }

  render() {
    return (
      <div className={styles.ticket}>
        <Tabs activeKey={this.state.tab} onChange={this.onChangeTab}>
          <TabPane tab="缺陷" key="defect">
            <Defect showContainer={this.props.showContainer} />
          </TabPane>
          <TabPane tab="巡检" key="inspect">
            <Inspect showContainer={this.props.showContainer} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  showContainer: state.operation.ticket.get('showContainer'),
});

const mapDispatchToProps = (dispatch) => ({
  onChangeShowContainer: params => dispatch({ type: CHANGE_SHOW_CONTAINER_SAGA, params }),
  clearDefectState: params => dispatch({ type: CLEAR_DEFECT_STATE_SAGA, params }),
  clearInspectState: params => dispatch({ type: CLEAR_INSPECT_STATE_SAGA, params }),
  getDefectList: params => dispatch({ type: GET_DEFECT_LIST_SAGA, params }),
  getInspectList: params => dispatch({ type: GET_INSPECT_LIST_SAGA, params }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Ticket);