import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Tabs} from 'antd';
import Defect from './Defect/Defect';
import Inspect from './Inspect/Inspect';
import Footer from '../../../components/Common/Footer';
import { ticketAction } from '../../../constants/actionTypes/operation/ticketAction';
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
  }

  onChangeTab = (tab) => {
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
        pageSize: 10,
        sort: '',
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
        <Tabs activeKey={this.state.tab} onChange={this.onChangeTab} type="card">
          <TabPane tab="缺陷" key="defect">
            <Defect showTab={this.state.tab} showContainer={this.props.showContainer} onChangeShowContainer={this.props.onChangeShowContainer} />
          </TabPane>
          <TabPane tab="巡检" key="inspect">
            <Inspect showTab={this.state.tab} showContainer={this.props.showContainer} onChangeShowContainer={this.props.onChangeShowContainer}  />
          </TabPane>
        </Tabs>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  showContainer: state.operation.ticket.get('showContainer'),
});

const mapDispatchToProps = (dispatch) => ({
  onChangeShowContainer: payload => dispatch({ type: ticketAction.CHANGE_SHOW_CONTAINER_SAGA, payload }),
  clearDefectState: payload => dispatch({ type: ticketAction.CLEAR_DEFECT_STATE_SAGA, payload }),
  clearInspectState: payload => dispatch({ type: ticketAction.CLEAR_INSPECT_STATE_SAGA, payload }),
  getDefectList: payload => dispatch({ type: ticketAction.GET_DEFECT_LIST_SAGA, payload }),
  getInspectList: payload => dispatch({ type: ticketAction.GET_INSPECT_LIST_SAGA, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Ticket);