
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./powerstation.scss";
import PropTypes from "prop-types";
import { Tabs } from 'antd';
class Allstation extends Component {
  static PropTypes={

  }
  constructor(props) {
    super(props);
    this.state={}
  }

  handleTab=()=>{
   console.log(1);
  }


  render() {
    const TabPane = Tabs.TabPane;
    return(
      <div className={styles.monitor}>
  <Tabs defaultActiveKey="all" onChange={this.handleTab}>
    <TabPane tab="全部" key="all">
    1
    {/* <MonitorAll/> */}
    </TabPane>
    <TabPane tab="风电" key="wind">
    2
{/* <MonitorWind/> */}
    </TabPane>
    <TabPane tab="光伏" key="light">
    3
{/* <MonitorLight/> */}
    </TabPane>
  </Tabs>;
      </div>
    );
  }
}
const mapStateToProps=(state)=>({

})
const mapDispatchToProps=(dispatch)=>({

})


export default connect(mapStateToProps, mapDispatchToProps)(Allstation);
