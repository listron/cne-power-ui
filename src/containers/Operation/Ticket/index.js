import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Tabs} from 'antd';
import Defect from './Defect';
import Inspect from './Inspect';
import { 
  CHANGE_SHOW_CONTAINER_SAGA
 } from '../../../constants/actionTypes/Ticket';
const TabPane = Tabs.TabPane;


class Ticket extends Component {
  static propTypes = {
    showContainer: PropTypes.string,
    onChangeShowContainer: PropTypes.func
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
    this.props.onChangeShowContainer('list');
  }

  render() {
    return (
      <div style={{display:"flex", flex: 1}}>
        <Tabs activeKey={this.state.tab} onChange={this.onChangeTab}>
          <TabPane tab="缺陷" key="defect">
            <Defect showContainer={this.props.showContainer} onChangeShowContainer={this.props.onChangeShowContainer}/>
          </TabPane>
          <TabPane tab="巡检" key="inspection">
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Ticket);